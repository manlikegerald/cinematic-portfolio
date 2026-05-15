from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = "sqlite+aiosqlite:///./portfolio.db"

    @property
    def async_database_url(self) -> str:
        url = self.database_url
        # Railway sets DATABASE_URL as postgres:// — convert to asyncpg
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgresql://") and "+asyncpg" not in url:
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        return url
    allowed_origins: str = "http://localhost:5173,http://localhost:4173"

    # Admin auth
    admin_password: str = "12345"
    secret_key: str = "changeme-secret-key-please-update-in-env"

    # SMTP — all optional; contact form silently skips emailing if unset
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = ""
    smtp_to: str = ""

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    @property
    def smtp_enabled(self) -> bool:
        return bool(self.smtp_host and self.smtp_user and self.smtp_to)


settings = Settings()
