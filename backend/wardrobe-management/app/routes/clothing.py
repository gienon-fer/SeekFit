from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from app.schemas import ClothingCreate, ClothingUpdate, Clothing
from app.models import Clothing as ClothingModel
from app.db.session import get_db
from app.utils import verify_token

router = APIRouter()

@router.post("/clothing", response_model=Clothing)
def create_clothing(clothing: ClothingCreate, db: Session = Depends(get_db), user_id: str = Depends(verify_token)):
    # db_clothing = ClothingModel(**clothing.dict(), user_id=user_id)
    # db.add(db_clothing)
    # db.commit()
    # db.refresh(db_clothing)
    #return db_clothing
    return {
        "id": 1,
        "name": "Dummy Clothing",
        "size": "M",
        "color": "Red",
        "brand": "Dummy Brand",
        "user_id": user_id
    }

@router.get("/clothing", response_model=List[Clothing])
def list_clothing(skip: int = 0, limit: int = 10, db: Session = Depends(get_db), user_id: str = Depends(verify_token)):
    # clothing_items = db.query(ClothingModel).filter(ClothingModel.user_id == user_id).offset(skip).limit(limit).all()
    # return clothing_items
    return [
        {
            "id": 1,
            "name": "Dummy Clothing 1",
            "size": "M",
            "color": "Red",
            "brand": "Dummy Brand",
            "user_id": user_id
        },
        {
            "id": 2,
            "name": "Dummy Clothing 2",
            "size": "L",
            "color": "Blue",
            "brand": "Another Dummy Brand",
            "user_id": user_id
        }
    ]

@router.get("/clothing/{id}", response_model=Clothing)
def get_clothing(id: int, db: Session = Depends(get_db), user_id: str = Depends(verify_token)):
    # db_clothing = db.query(ClothingModel).filter(ClothingModel.id == id, ClothingModel.user_id == user_id).first()
    # if db_clothing is None:
    #     raise HTTPException(status_code=404, detail="Clothing item not found")
    # return db_clothing
    return {
        "id": id,
        "name": f"Dummy Clothing {id}",
        "size": "M",
        "color": "Red",
        "brand": "Dummy Brand",
        "user_id": user_id
    }

@router.put("/clothing/{id}", response_model=Clothing)
def update_clothing(id: int, clothing: ClothingUpdate, db: Session = Depends(get_db), user_id: str = Depends(verify_token)):
    # db_clothing = db.query(ClothingModel).filter(ClothingModel.id == id, ClothingModel.user_id == user_id).first()
    # if db_clothing is None:
    #     raise HTTPException(status_code=404, detail="Clothing item not found")
    # for key, value in clothing.dict().items():
    #     setattr(db_clothing, key, value)
    # db.commit()
    # db.refresh(db_clothing)
    # return db_clothing
    return {
        "id": id,
        "name": f"Updated Dummy Clothing {id}",
        "size": clothing.size,
        "color": clothing.color,
        "brand": clothing.brand,
        "user_id": user_id
    }

@router.delete("/clothing/{id}")
def delete_clothing(id: int, db: Session = Depends(get_db), user_id: str = Depends(verify_token)):
    # db_clothing = db.query(ClothingModel).filter(ClothingModel.id == id, ClothingModel.user_id == user_id).first()
    # if db_clothing is None:
    #     raise HTTPException(status_code=404, detail="Clothing item not found")
    # db.delete(db_clothing)
    # db.commit()
    return {"message": "Clothing item deleted successfully"}, 200
