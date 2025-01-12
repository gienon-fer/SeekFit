import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.db.base import Base
from app.db.session import get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="module")
def test_client():
    Base.metadata.create_all(bind=engine)
    yield client
    Base.metadata.drop_all(bind=engine)

def test_create_notification(test_client):
    response = test_client.post(
        "/notifications",
        json={
            "title": "Test Notification",
            "message": "This is a test notification.",
            "user_ids": ["user1", "user2"]
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Notification"
    assert data["message"] == "This is a test notification."
    assert data["user_id"] == "user1,user2"

def test_list_notifications(test_client):
    response = test_client.get("/notifications")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["title"] == "Test Notification"
    assert data[0]["message"] == "This is a test notification."
    assert data[0]["user_id"] == "user1,user2"