from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas import NotificationCreate, Notification
from app.models import Notification as NotificationModel
from app.db.session import get_db
from app.services.fcm_service import send_notification

router = APIRouter()

@router.post("/notifications", response_model=Notification)
def create_notification(notification: NotificationCreate, db: Session = Depends(get_db)):
    # # Logic to create notification in the database
    # db_notification = NotificationModel(
    #     title=notification.title,
    #     message=notification.message,
    #     user_id=",".join(notification.user_ids)  # Store user_ids as a comma-separated string
    # )
    # db.add(db_notification)
    # db.commit()
    # db.refresh(db_notification)
    
    # # Send notification via FCM
    # send_notification(notification.title, notification.message, notification.user_ids)
    
    # return db_notification
    # Mock response for testing
    mock_notification = Notification(
        id=1,
        title=notification.title,
        message=notification.message,
        user_ids=notification.user_ids
    )
    return mock_notification

@router.get("/notifications", response_model=List[Notification])
def list_notifications(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    # # Logic to list notifications
    # notifications = db.query(NotificationModel).offset(skip).limit(limit).all()
    # return notifications
    mock_notifications = [
        Notification(id=1, title="Title 1", message="Message 1", user_ids=["user1", "user2"]),
        Notification(id=2, title="Title 2", message="Message 2", user_ids=["user3"]),
        Notification(id=3, title="Title 3", message="Message 3", user_ids=["user4", "user5", "user6"]),
    ]

    return mock_notifications[skip:skip + limit]