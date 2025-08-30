# config.py
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Loads and validates application settings from a .env file."""
    EMBEDDING_MODEL_NAME: str
    VECTOR_DB_PATH: str
    VECTOR_DB_COLLECTION: str

    model_config = SettingsConfigDict(env_file=".env", extra="allow")

# Create a single, importable instance of the settings
settings = Settings()