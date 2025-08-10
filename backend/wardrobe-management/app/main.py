from fastapi import FastAPI
from app.routes import clothing, outfit

app = FastAPI()

app.include_router(clothing.router)
app.include_router(outfit.router)