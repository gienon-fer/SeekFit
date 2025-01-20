import os
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Base, User as UserModel
from app.schemas import UserCreate

SQLALCHEMY_DATABASE_URL = os.getenv("TEST_DATABASE_URL", "postgresql://user:resu@localhost:5432/profile_db")
engine = create_engine(SQLALCHEMY_DATABASE_URL)
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
def test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_create_profile(test_db):
    response = client.post(
        "/profile",
        json={
            "email": "test@example.com",
            "height": 180.5,
            "shoe_size": 42,
            "chest": 100.0,
            "waist": 80.0,
            "hips": 90.0
        },
        headers={"Authorization": "Bearer dummy_token"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"

def test_get_profile(test_db):
    response = client.get("/profile", headers={"Authorization": "Bearer dummy_token"})
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"

def test_update_profile(test_db):
    response = client.put(
        "/profile",
        json={"height": 185.0},
        headers={"Authorization": "Bearer dummy_token"}
    )
    assert response.status_code == 200
    assert response.json()["height"] == 185.0

def test_delete_profile(test_db):
    response = client.delete("/profile", headers={"Authorization": "Bearer dummy_token"})
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"
