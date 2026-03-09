from pydantic import BaseModel, ConfigDict, Field, computed_field
from uuid import UUID
from .events_schemas import EventBase
from typing import List, Optional
from datetime import datetime

class TenantBase(BaseModal):
  tenant_id: UUID
  username: str = Field(min_length=1, max_length=20)
  monthly_quota: int = Field(default=1000)
  events: list[EventBase] = []

  @computed_field
  @property
  def month_to_date_usage(self) -> float:
    now = datetime.now()
    return sum(e.token_cost for e in self.events if e.timestamp.month == now.month and e.timestamp.year == now.year)
  
  @computed_field
  @property
  def last_active(self) -> Optional[datetime]:
    if not self.events:
      return None
    return max((e.timestamp for e in self.events), None)

  @computed_field
  @property
  def capacity_warn(self) -> bool:
    return self.month_to_date_useage >= (self.monthly_quota*0.9)

  @computed_field
  @property
  def over_capacity(self) ->bool:
    return self.month_to_date_useage >= self.monthly_quota

class TenantQuotaUpdate(BaseModel):
  reason :str = Field(min_length=10, max_length=500)
  new_quota :int = Field(ge=0)
  pass
