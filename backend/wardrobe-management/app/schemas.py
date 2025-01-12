from pydantic import BaseModel
from typing import List, Optional

class ClothingBase(BaseModel):
    name: str
    description: Optional[str] = None

class ClothingCreate(ClothingBase):
    pass

class ClothingUpdate(ClothingBase):
    pass

class Clothing(ClothingBase):
    id: int

    class Config:
        orm_mode: True

class OutfitBase(BaseModel):
    name: str
    description: Optional[str] = None

class OutfitCreate(OutfitBase):
    pass

class OutfitUpdate(OutfitBase):
    pass

class Outfit(OutfitBase):
    id: int

    class Config:
        orm_mode: True

class SearchResults(BaseModel):
    clothing: List[Clothing]
    outfits: List[Outfit]