from fastapi import FastAPI
from app.routes import profile

app = FastAPI()

app.include_router(profile.router)