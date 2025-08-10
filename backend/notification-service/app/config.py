import os

class Settings:
    PROJECT_NAME: str = "Notification Service"
    SQLALCHEMY_DATABASE_URI: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")
    FCM_CREDENTIALS_PATH: str = os.getenv("FCM_CREDENTIALS_PATH", "path/to/your/fcm/credentials.json")

settings = Settings()