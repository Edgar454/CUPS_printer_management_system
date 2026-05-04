from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    FILE_FOLDER: str

settings = Settings()