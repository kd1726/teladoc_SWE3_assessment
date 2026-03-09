from fastapi import APIRouter, Request, status, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from database import get_db
from Config.config import version
from Models.tenants_model import TenantsDB
from Models.events_model import EventsDB
from Services.auth_service import *

router = APIRouter()

@router.get("")
def get_tenants(db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
  if user.get("role") != "admin":
    raise HTTPException(status_code=403, detail="Admin access required")
  
  tenants = db.query(TenantsDB).all()
  return tenants

@router.get("/{tenant_id}")
def get_tenants(tenant_id: str, db: Session = Depends(get_db), user=Depends(get_current_user)):
  if user.get("role") != "admin" and user.get("tenant_id") != tenant_id:
    raise HTTPException(status_code=403, detail="Unauthorized access to tenant data")

  tenant = db.query(TenantsDB).filter(TenantsDB.tenant_id == tenant_id).first()
  if not tenant:
    raise HTTPException(status_code=404, detail="Tenant not found")
  return tenant

@router.get("/{tenant_id}/usage")
async def get_usage_events_from_date_range(
    tenant_id: str,
    from_time: datetime = Query(...),
    to_time: datetime = Query(...),
    granularity: str = "day",
    db: Session = Depends(get_db),
    user=Depends(get_current_user)):

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

@router.put("/{tenant_id}/quota")
async def update_tenant_quota(tenant_id: str, new_quota: int, user=Depends(get_current_user), db: Session= Depends(get_db)):
  if user.get("role") != "admin":
    raise HTTPException(status_code=403, detail="Admin access required")
  
  tenant = db.query(TenantsDB).filter(TenantsDB.tenant_id == tenant_id).first()
  if not tenant:
    raise HTTPException(status_code=404, detail="Tenant not found")
  
  tenant.monthly_quota = new_quota
  db.commit()
  return {"status": "success", "new_quota": tenant.monthly_quota}