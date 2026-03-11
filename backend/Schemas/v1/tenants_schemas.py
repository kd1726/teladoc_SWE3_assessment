from pydantic import BaseModel, ConfigDict, Field, computed_field
from uuid import UUID
from .events_schemas import EventBase
from typing import List, Optional
from datetime import datetime

class TenantBase(BaseModel):
  tenant_id: UUID
  username: str = Field(min_length=1, max_length=20)
  monthly_quota: int = Field(default=1000)
  events: List[EventBase] = []
  allow_overage: bool

class TenantGet(TenantBase):
  model_config = ConfigDict(from_attributes=True)
  allow_overage: bool

  @computed_field
  @property
  def month_to_date_usage(self) -> int:
    now = datetime.now()
    return sum(e.token_cost for e in self.events if e.timestamp.month == now.month and e.timestamp.year == now.year)
  
  @computed_field
  @property
  def remaining_quota(self) -> int:
    return self.monthly_quota - self.month_to_date_usage

  @computed_field
  @property
  def last_active(self) -> Optional[datetime|str]:
    return max((e.timestamp for e in self.events), default=None)

  @computed_field
  @property
  def capacity_warn(self) -> bool:
    return self.month_to_date_usage >= (self.monthly_quota*0.9)

  @computed_field
  @property
  def over_capacity(self) ->bool:
    return self.month_to_date_usage >= self.monthly_quota

class TenantGetPrivate(TenantGet):
  model_config = ConfigDict(from_attributes=True)
  role: str

class TenantPost(TenantBase):
  model_config = ConfigDict(from_attributes=True)

  password_hash: str

class TenantQuotaUpdate(BaseModel):
  model_config = ConfigDict(from_attributes=True)

  tenant_id: UUID
  reason :str = Field(min_length=10, max_length=500)
  old_quota: int = Field(ge=0)
  new_quota :int = Field(gt=0)
  timestamp: datetime
  allow_overage :bool

