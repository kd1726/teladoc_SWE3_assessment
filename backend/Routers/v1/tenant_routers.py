from fastapi import APIRouter, Request, status, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func,select
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
from Config.config import settings
from Models.Tenants.models import Tenants
from Models.Events.models import Events
from Models.Audits.models import Audit
from Schemas.v1.tenants_schemas import *
from Schemas.v1.events_schemas import EventGranularitResponse
from Services.auth_service import AuthService
from typing import Annotated, List
from datetime import datetime,timedelta


router = APIRouter()

@router.get("", response_model=list[TenantGet], status_code=status.HTTP_200_OK)
def get_all_tenants(db: Annotated[Session, Depends(get_db)], user: Annotated[Tenants, Depends(AuthService().get_current_user)]):
  if user.role != "admin":
    raise HTTPException(status_code=403, detail="Admin access required")
  
  tenants = db.execute(select(Tenants).where(Tenants.role != "admin")).scalars().all()
  return tenants

@router.get("/{tenant_id}", response_model=TenantGet, status_code=status.HTTP_200_OK)
def get_tenant(tenant_id: str, db: Annotated[Session, Depends(get_db)], user: Annotated[Tenants, Depends(AuthService().get_current_user)]):

  if user.role != "admin" and str(user.tenant_id) != tenant_id:
    raise HTTPException(status_code=403, detail="Unauthorized access to tenant data")

  if not user:
    raise HTTPException(status_code=404, detail="Tenant not found")
  return user

@router.get("/{tenant_id}/usage", response_model=list[EventGranularitResponse], status_code=status.HTTP_200_OK)
def get_usage_events_from_date_range(
    tenant_id: str,
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[Tenants, Depends(AuthService().get_current_user)],
    from_time: datetime = datetime.now() - timedelta(days=1),
    to_time: datetime = datetime.now,
    granularity: str = "day"):

    if user.role != "admin" and user.tenant_id != tenant_id:
      raise HTTPException(status_code=403, detail="Unauthorized")
   
    statement = select(
            func.date_trunc(granularity, Events.timestamp).label("period"),
            func.sum(Events.token_cost).label("total_token_usage")).where(Events.tenant_id == tenant_id)
    
    if from_time:
      statement = statement.where(Events.timestamp >= from_time)

    if to_time:
      statement = statement.where(Events.timestamp >= from_time)

    statement = statement.group_by("period").order_by("period")

    result = db.execute(statement).all()
    return [{"period": r.period, "total_token_usage": r.total_token_usage} for r in result]

@router.patch("/{tenant_id}/quota", status_code=status.HTTP_202_ACCEPTED)
def update_tenant_quota(tenant_id: str, tenant_update_data:TenantQuotaUpdate, user: Annotated[Tenants, Depends(AuthService().get_current_user)], db: Annotated[Session, Depends(get_db)]):
  if user.role != "admin":
    raise HTTPException(status_code=403, detail="Admin access required")
  
  tenant = db.execute(select(Tenants).where(Tenants.tenant_id == tenant_id)).scalars().first()
  
  if not tenant:
    raise HTTPException(status_code=404, detail="Tenant not found")
  
  tenant.monthly_quota = tenant_update_data.new_quota
  tenant.allow_overage = tenant_update_data.allow_overage

  new_audit = Audit(
    change_owener_id = tenant_update_data.tenant_id,
    timestamp  = tenant_update_data.timestamp,
    new_quota = tenant_update_data.new_quota,
    old_quota = tenant_update_data.old_quota,
    reason = tenant_update_data.reason
  )

  db.add_all([tenant, new_audit])
  db.commit()
  db.refresh(new_audit)
  return {"status": "success", "new_quota": tenant.monthly_quota}