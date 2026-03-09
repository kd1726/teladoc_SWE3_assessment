from fastapi import APIRouter, Request, status, Depends, HTTPException
from sqlalchemy.orm import Session
from Schemas.v1.auth_schemas import *
from database import get_db
from Models.tenants_model import TenantsDB
from Services.auth_service import *
from Loggers.base_logger import BaseLogger
from passlib.context import CryptContext


router = APIRouter()
logger = BaseLogger()

@router.post("")
async def authenticate(form_data: AuthRequest, db: Session = Depends(get_db)):
  logger.info("Autenticating....")

  tenant = db.query(TenantsDB).filter(TenantsDB.username == form_data.username).first()
  pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

  if not tenant or not pwd_context.verify(form_data.password, tenant.password_hash):
    logger.error("Invalid Credentials")
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
  
  user_data = {
    "sub": str(tenant.tenant_id),
    "role": tenant.role,
    "tenant_id": str(tenant.tenant_id)
    }

  access_token = build_jwt_token(data=user_data)
    
  return {"access_token": access_token, "token_type": "bearer"}

@router.post("/refresh_token")
async def refresh_token(request: Request):
  pass