from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    CUPS_SERVER_URL: str
    FILE_FOLDER: str

settings = Settings()