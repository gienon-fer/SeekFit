from fastapi import FastAPI
from app.routes import notifications

app = FastAPI()

app.include_router(notifications.router)