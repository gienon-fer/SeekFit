from fastapi import FastAPI, Depends, HTTPException, status, Request
from pydantic import BaseModel
import logging
import requests
import uvicorn
import os
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

app = FastAPI()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client_id = os.getenv("GOOGLE_CLIENT_ID")

class User(BaseModel):
    id: str
    email: str
    name: str

def verify_google_token(token: str):
    try:
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), client_id)

        user_id = idinfo['sub']
        email = idinfo['email']
        name = idinfo.get('name', 'Unknown')

        return User(id=user_id, email=email, name=name)
    except ValueError as e:
        logger.error(f"Token verification failed: {str(e)}")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid token")

# curl -X GET "http://your-backend-domain.com/login" -H "Authorization: Bearer <ID_TOKEN>"
@app.get("/login", response_model=User)
async def login(request: Request):
    token = request.headers.get("Authorization")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authorization header missing")

    token = token.split("Bearer ")[-1]
    user = verify_google_token(token)
    logger.info(f"User logged in: {user}")
    return user

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)