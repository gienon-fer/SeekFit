from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import User, UserCreate, UserUpdate
from app.models import User as UserModel
from app.db.session import get_db
from app.utils import verify_token
import logging
from datetime import datetime

router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.get("/profile", response_model=User)
def get_profile(user_id: str = Depends(verify_token), db: Session = Depends(get_db)):
    logger.info(f"Fetching profile for user_id: {user_id}")
    user = db.query(UserModel).filter(UserModel.google_id == user_id).first()
    if user is None:
        logger.error(f"User not found for user_id: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    user.last_login = datetime.utcnow()
    db.commit()
    db.refresh(user)
    return user

@router.post("/profile", response_model=User)
def create_profile(user: UserCreate, user_id: str = Depends(verify_token), db: Session = Depends(get_db)):
    logger.info(f"Creating profile for user: {user_id}")
    db_user = db.query(UserModel).filter(UserModel.google_id == user_id).first()
    if db_user:
        logger.error(f"User already registered with google_id: {user_id}")
        raise HTTPException(status_code=400, detail="User already registered")
    new_user = UserModel(
        google_id=user_id,
        email=user.email,
        height=user.height,
        shoe_size=user.shoe_size,
        chest=user.chest,
        waist=user.waist,
        hips=user.hips,
        last_login=datetime.utcnow()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    logger.info(f"Profile created for user: {user_id}")
    return new_user

from fastapi import Request

@router.put("/profile", response_model=User)
async def update_profile(request: Request, user: UserUpdate, user_id: str = Depends(verify_token), db: Session = Depends(get_db)):
    logger.info(f"Updating profile for user_id: {user_id}")
    logger.info(f"Incoming request data: {await request.json()}")
    db_user = db.query(UserModel).filter(UserModel.google_id == user_id).first()
    if db_user is None:
        logger.error(f"User not found for user_id: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    for key, value in user.dict(exclude_unset=True).items():
        if value == "":
            value = None
        if hasattr(db_user, key):
            setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    logger.info(f"Profile updated for user_id: {user_id}")
    return db_user

@router.delete("/profile", response_model=User)
def delete_profile(user_id: str = Depends(verify_token), db: Session = Depends(get_db)):
    logger.info(f"Deleting profile for user_id: {user_id}")
    db_user = db.query(UserModel).filter(UserModel.google_id == user_id).first()
    if db_user is None:
        logger.error(f"User not found for user_id: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    logger.info(f"Profile deleted for user_id: {user_id}")
    return db_user