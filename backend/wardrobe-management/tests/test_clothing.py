import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.db.base import Base
from app.db.session import get_db

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:resu@localhost:5432")

engine = create_engine(SQLALCHEMY_DATABASE_URL + "/wardrobe_db")
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

def test_create_clothing(test_client):
    response = test_client.post(
        "/clothing",
        json={
            "name": "Test Clothing",
            "description": "This is a test clothing item."
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Clothing"
    assert data["description"] == "This is a test clothing item."

def test_list_clothing(test_client):
    response = test_client.get("/clothing")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["name"] == "Test Clothing"
    assert data[0]["description"] == "This is a test clothing item."

def test_get_clothing(test_client):
    response = test_client.get("/clothing/1")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Clothing"
    assert data["description"] == "This is a test clothing item."

def test_update_clothing(test_client):
    response = test_client.put(
        "/clothing/1",
        json={
            "name": "Updated Test Clothing",
            "description": "This is an updated test clothing item."
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Test Clothing"
    assert data["description"] == "This is an updated test clothing item."

def test_delete_clothing(test_client):
    response = test_client.delete("/clothing/1")
    assert response.status_code == 200
    response = test_client.get("/clothing/1")
    assert response.status_code == 404