from decouple import config

# Docker Constants
CONTAINERIZED = config("CONTAINERIZED")

# Redis Constants
REDIS_HOST = config("REDIS_DOCKERIZED_CONNECTION_HOST" if CONTAINERIZED else "REDIS_CONNECTION_HOST")
REDIS_PORT = config("REDIS_PORT")
REDIS_DB = config("REDIS_DB")
IDENPOTENT_EXPIRATION = 300
DEFAULT_REDIS_ENTRY_EXPIRATION = 1800 # Not using as it's out of scope of this project

# Postgresql constants
DB_NAME=config("DB_NAME")
DB_PASSWORD=config("DB_PASSWORD")
DB_USER=config("DB_USER")
DB_PORT=config("DB_PORT")

POSTGRES_URI = f"postgresql://{DB_USER}:{DB_PASSWORD}@localhost:{DB_PORT}/{DB_NAME}"
# APP
SECRET_KEY=config("SECRET_KEY", False)

def is_debug() -> bool:
  return config("DEBUG_MODE", False)

def version() -> str:
  return config("VERSION", "v1")



