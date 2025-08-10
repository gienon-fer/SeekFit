from sqlalchemy import Column, Integer, String
from app.db.base import Base
from sqlalchemy import Float, DateTime
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    google_id = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    last_login = Column(DateTime, default=datetime.utcnow)
    height = Column(Float)
    shoe_size = Column(Integer)
    chest = Column(Float)
    waist = Column(Float)
    hips = Column(Float)