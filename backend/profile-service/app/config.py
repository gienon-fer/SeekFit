import os

class Settings:
    PROJECT_NAME: str = "Profile Service"
    SQLALCHEMY_DATABASE_URI: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")

settings = Settings()