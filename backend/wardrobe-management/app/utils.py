from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from google.oauth2 import id_token
from google.auth.transport import requests

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        id_info = id_token.verify_oauth2_token(token, requests.Request(), "292694167327-ho7su5mm59m6flj45i4hge1m9h0n73b4.apps.googleusercontent.com")
        
        user_id = id_info['sub']
        return user_id
    except ValueError:
        raise HTTPException(status_code=403, detail="Invalid or expired token")