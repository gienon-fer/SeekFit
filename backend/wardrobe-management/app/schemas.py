from pydantic import BaseModel
from typing import List, Optional

class ClothingBase(BaseModel):
    description: Optional[str] = None
    image: Optional[str] = None
    tags: Optional[dict] = None

class ClothingCreate(ClothingBase):
    pass

class ClothingUpdate(ClothingBase):
    pass

class Clothing(ClothingBase):
    id: int
    owner_id: int
    
    class Config:
        orm_mode: True

class OutfitBase(BaseModel):
    description: Optional[str] = None
    image: Optional[str] = None
    tags: Optional[dict] = None

class OutfitCreate(OutfitBase):
    pass

class OutfitUpdate(OutfitBase):
    pass

class Outfit(OutfitBase):
    id: int
    owner_id: int
    clothing: List[Clothing]

    class Config:
        orm_mode: True

class SearchResults(BaseModel):
    clothing: List[Clothing]
    outfits: List[Outfit]