from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class NotificationBase(BaseModel):
    title: str
    message: str
    user_ids: List[str]

class NotificationCreate(NotificationBase):
    pass

class Notification(NotificationBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode: True