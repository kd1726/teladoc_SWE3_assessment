from fastapi import APIRouter, Depends, HTTPException,status
from Services.auth_service import AuthService
from typing import Annotated
from database import get_db
from Schemas.v1.audit_schemas import BaseAudit
from Models.Tenants.models import Tenants
from Models.Audits.models import Audit
from sqlalchemy import select
from sqlalchemy.orm import Session

router = APIRouter()

@router.get("", status_code=status.HTTP_200_OK, response_model=list[BaseAudit])
def get_all_audits(db:Annotated[Session, Depends(get_db)], current_user: Annotated[Tenants, Depends(AuthService().get_current_user)]):
  if current_user.role == "admin":
    results = db.execute(select(Audit)).scalars().all()
    return results
  raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, details="Not an admin")