from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from google.oauth2 import id_token
from google.auth.transport import requests

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    return "dummy_user_id"
    token = credentials.credentials
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        id_info = id_token.verify_oauth2_token(token, requests.Request(), "292694167327-5s1uh3512vkn2aebclm5hchicokjmpa6.apps.googleusercontent.com")
        
        # ID token is valid. Get the user's Google Account ID from the decoded token.
        user_id = id_info['sub']
        return user_id
    except ValueError:
        # Invalid token
        raise HTTPException(status_code=403, detail="Invalid or expired token")