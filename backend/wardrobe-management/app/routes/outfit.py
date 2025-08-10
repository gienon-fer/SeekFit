from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from app.schemas import OutfitCreate, OutfitUpdate, Outfit
from app.models import Outfit as OutfitModel
from app.db.session import get_db
from app.utils import verify_token

router = APIRouter()
@router.post("/outfits", response_model=dict, status_code=200)
def create_outfit(outfit: OutfitCreate, db: Session = Depends(get_db), user_id: str = Depends(verify_token)):
    db_outfit = OutfitModel(**outfit.dict(), user_id=user_id)
    db.add(db_outfit)
    db.commit()
    db.refresh(db_outfit)
    return {"message": "Outfit created successfully", "outfit": db_outfit}, 200
    # mock_outfit = {
    #     "id": 1,
    #     "name": outfit.name,
    #     "description": outfit.description,
    #     "user_id": user_id
    #     }
    # return {"message": "Outfit created successfully", "outfit": mock_outfit}

@router.get("/outfits", response_model=dict, status_code=200)
def list_outfits(skip: int = 0, limit: int = 10, db: Session = Depends(get_db), user_id: str = Depends(verify_token)):
    outfits = db.query(OutfitModel).filter(OutfitModel.user_id == user_id).offset(skip).limit(limit).all()
    return {"message": "List of outfits", "outfits": outfits}, 200
    # mock_outfits = [
    #     {"id": 1, "name": "Outfit 1", "description": "Description 1", "user_id": user_id},
    #     {"id": 2, "name": "Outfit 2", "description": "Description 2", "user_id": user_id},
    #     {"id": 3, "name": "Outfit 3", "description": "Description 3", "user_id": user_id},
    # ]
    # return {"message": "List of outfits", "outfits": mock_outfits[skip: skip + limit]}

@router.get("/outfits/{id}", response_model=dict, status_code=200)
def get_outfit(id: int, db: Session = Depends(get_db), user_id: str = Depends(verify_token)):
    outfit = db.query(OutfitModel).filter(OutfitModel.id == id, OutfitModel.user_id == user_id).first()
    if not outfit:
        raise HTTPException(status_code=404, detail="Outfit not found")
    return {"message": "Outfit retrieved successfully", "outfit": outfit}
    # mock_outfit = {"id": id, "name": f"Outfit {id}", "description": f"Description {id}", "user_id": user_id}
    # return {"message": "Outfit retrieved successfully", "outfit": mock_outfit}

@router.put("/outfits/{id}", response_model=dict, status_code=200)
def update_outfit(id: int, outfit: OutfitUpdate, db: Session = Depends(get_db), user_id: str = Depends(verify_token)):
    db_outfit = db.query(OutfitModel).filter(OutfitModel.id == id, OutfitModel.user_id == user_id).first()
    if not db_outfit:
        raise HTTPException(status_code=404, detail="Outfit not found")
    for key, value in outfit.dict().items():
        setattr(db_outfit, key, value)
    db.commit()
    db.refresh(db_outfit)
    return {"message": "Outfit updated successfully", "outfit": db_outfit}
    # mock_outfit = {"id": id, "name": outfit.name, "description": outfit.description, "user_id": user_id}
    # return {"message": "Outfit updated successfully", "outfit": mock_outfit}

@router.delete("/outfits/{id}", response_model=dict, status_code=200)
def delete_outfit(id: int, db: Session = Depends(get_db), user_id: str = Depends(verify_token)):
    db_outfit = db.query(OutfitModel).filter(OutfitModel.id == id, OutfitModel.user_id == user_id).first()
    if not db_outfit:
        raise HTTPException(status_code=404, detail="Outfit not found")
    db.delete(db_outfit)
    db.commit()
    return {"message": "Outfit deleted successfully"}
    # return {"message": "Outfit deleted successfully", "outfit_id": id}
