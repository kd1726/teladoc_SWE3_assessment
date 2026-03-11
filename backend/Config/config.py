from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
  model_config = SettingsConfigDict(
    env_file=".env",
    env_file_encoding="utf-8"
  )

  containerized: bool
  secret_key: SecretStr
  debug: bool
  version: str
  access_token_expire: int = 15
  algorithm: str
  db_name: str
  db_password: str
  db_user: str
  db_port: str
  postgresql_uri: str
  redis_host: str
  redis_port: str
  redis_db: int
  default_redis_entry_expiration: int

settings = Settings()



