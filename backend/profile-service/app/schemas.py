from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: str
    height: Optional[float] = None
    shoe_size: Optional[int] = None
    chest: Optional[float] = None
    waist: Optional[float] = None
    hips: Optional[float] = None

class UserUpdate(BaseModel):
    email: Optional[str] = None
    height: Optional[float] = None
    shoe_size: Optional[int] = None
    chest: Optional[float] = None
    waist: Optional[float] = None
    hips: Optional[float] = None

class User(UserUpdate):
    id: int
    google_id: str
    last_login: datetime

    class Config:
        orm_mode: True