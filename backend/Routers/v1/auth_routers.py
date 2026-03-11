from fastapi import APIRouter, Request, status, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Annotated
from sqlalchemy import select
from Schemas.v1.auth_schemas import *
from database import get_db
from Models.Tenants.models import Tenants
from Services.auth_service import AuthService
from Loggers.base_logger import BaseLogger
from passlib.context import CryptContext


router = APIRouter()
logger = BaseLogger()

@router.post("", status_code=status.HTTP_200_OK, response_model=AuthTokenResponse)
def authenticate(form_data: AuthRequest, db: Annotated[Session, Depends(get_db)]):
  logger.info("Autenticating....")

  query = db.execute(select(Tenants).where(Tenants.username == form_data.username))

  tenant = query.scalars().first()

  pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

  if not tenant or not AuthService().verify_password(form_data.password, tenant.password_hash):
    logger.error("Invalid Credentials")
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
  
  user_data = {
    "role": tenant.role,
    "tenant_id": str(tenant.tenant_id)
    }

  access_token = AuthService.build_jwt_token(data=user_data)
  return {"access_token": access_token, "token_type": "bearer"}

@router.post("/refresh")
def refresh_token():
  pass