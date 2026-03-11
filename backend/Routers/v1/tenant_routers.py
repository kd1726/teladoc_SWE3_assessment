from fastapi import APIRouter, Request, status, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func,select
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
from Config.config import settings
from Models.Tenants.models import Tenants
from Models.Events.models import Events
from Schemas.v1.tenants_schemas import *
from Services.auth_service import AuthService
from typing import Annotated, List

router = APIRouter()

@router.get("", response_model=list[TenantGet], status_code=status.HTTP_200_OK)
def get_all_tenants(db: Annotated[Session, Depends(get_db)], user: Annotated[Tenants, Depends(AuthService().get_current_user)]):
  if user.role != "admin":
    raise HTTPException(status_code=403, detail="Admin access required")
  
  tenants = db.execute(select(Tenants)).scalars().all()
  return tenants

@router.get("/{tenant_id}", response_model=TenantGet, status_code=status.HTTP_200_OK)
def get_tenant(tenant_id: str, db: Annotated[Session, Depends(get_db)], user: Annotated[Tenants, Depends(AuthService().get_current_user)]):

  if user.role != "admin" and str(user.tenant_id) != tenant_id:
    raise HTTPException(status_code=403, detail="Unauthorized access to tenant data")

  if not user:
    raise HTTPException(status_code=404, detail="Tenant not found")
  return user

@router.get("/{tenant_id}/usage", response_model=list[EventBase], status_code=status.HTTP_200_OK)
def get_usage_events_from_date_range(
    tenant_id: str,
    from_time: datetime,
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[Tenants, Depends(AuthService().get_current_user)],
    to_time: datetime = datetime.now,
    granularity: str = "day"):

    if user.get("role") != "admin" and user.get("tenant_id") != tenant_id:
      raise HTTPException(status_code=403, detail="Unauthorized")
   
    results = db.query(
        func.date_trunc(granularity, EventsDB.timestamp).label("period"),
        func.sum(EventsDB.token_cost).label("total_usage")
    ).filter(
        EventsDB.tenant_id == tenant_id,
        EventsDB.timestamp >= from_time,
        EventsDB.timestamp <= to_time
    ).group_by("period").order_by("period").all()

    return [{"date": r.period, "usage": r.total_usage} for r in results]

@router.patch("/{tenant_id}/quota", status_code=status.HTTP_202_ACCEPTED)
def update_tenant_quota(tenant_id: str, tenant_update_data:TenantQuotaUpdate, user: Annotated[Tenants, Depends(AuthService().get_current_user)], db: Annotated[Session, Depends(get_db)]):
  if user.role != "admin":
    raise HTTPException(status_code=403, detail="Admin access required")
  
  tenant = db.execute((Tenants).where(Tenants.tenant_id == tenant_id)).scalars().first()
  
  if not tenant:
    raise HTTPException(status_code=404, detail="Tenant not found")
  
  tenant.monthly_quota = tenant_update_data.new_quota
  tenant.allow_overage = tenant_update_data.allow_overage

  db.add(tenant)
  db.commit()
  db.refresh()
  return {"status": "success", "new_quota": tenant.monthly_quota}