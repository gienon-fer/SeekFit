from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: Optional[str] = None
    height: Optional[float] = None
    shoe_size: Optional[int] = None
    chest: Optional[float] = None
    waist: Optional[float] = None
    hips: Optional[float] = None

class UserCreate(UserBase):
    pass

class UserUpdate(UserBase):
    pass

class User(UserBase):
    id: int
    google_id: str
    last_login: datetime

    class Config:
        orm_mode: True