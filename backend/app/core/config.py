from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "Wealth Manager API"
    DATABASE_URL: str = "mysql+pymysql://app_user:app_password@db:3306/wealth_manager"
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"


settings = Settings()
