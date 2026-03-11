from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from Config.config import settings

engine = create_engine(settings.postgresql_uri)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
  pass

def get_db():
  db = SessionLocal()
  try:
      yield db
  finally:
      db.close()