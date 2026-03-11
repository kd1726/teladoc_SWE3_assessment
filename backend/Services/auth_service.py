import jwt
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.orm import Session
from Config.config import settings
from typing import Annotated
from database import get_db
from Models.Tenants.models import Tenants
from ipdb import set_trace

class AuthService:
  password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
  oauth2_scheme = OAuth2PasswordBearer(tokenUrl="v1/auth/login")

  @classmethod
  def hash_password(cls, password: str) -> str:
    password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    hashed_password = password_context.hash(password)
    return hashed_password
  
  @classmethod
  def verify_password(cls, password, hashed_password_on_file) -> bool:
    password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    verify = password_context.verify(password, hashed_password_on_file)
    return verify

  @classmethod
  def build_jwt_token(cls, data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key.get_secret_value(), algorithm=settings.algorithm)

  @classmethod
  def verify_jwt_token(cls, token: Annotated[str, Depends(oauth2_scheme)]):
    payload = jwt.decode(token, settings.secret_key.get_secret_value(), algorithms=[settings.algorithm])
    return payload

  @classmethod
  def get_current_user(cls, token: Annotated[str, Depends(oauth2_scheme)], db: Annotated[Session, Depends(get_db)]) ->Tenants:
    try:
      required_attributes = ["tenant_id", "role", "exp"]
      valid_token = cls.verify_jwt_token(token)

      for i in required_attributes:
        if not valid_token.get(i):
          raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
          detail="Missing required attirubtes",
          headers={"WWW-Authenticate": "Bearer"}
          )
      
      user = db.execute(select(Tenants).where(Tenants.tenant_id==valid_token.get("tenant_id"))).scalars().first()
      
      return user
    
    except jwt.PyJWTError:
      raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Unauthorized Token",
            headers={"WWW-Authenticate": "Bearer"})
    except jwt.ExpiredSignatureError:
      raise HTTPException(
          status_code=status.HTTP_401_UNAUTHORIZED,
          detail="Token has expired",
          headers={"WWW-Authenticate": "Bearer"})
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token")
