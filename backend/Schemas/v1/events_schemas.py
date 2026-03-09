from pydantic import Field, BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID


class EventBase(BaseModel):
  prompt_type: str= Field(min_length=0, max_length=500)
  token_cost: int = Field(gt=0)
  timestamp: datetime
  idempotency_key: str = Field(min_length=1, max_length=100)

class EventPost(EventBase):
  allow_overage :bool = False

class EventGet(EventBase):
  event_id: UUID
  tenant_id: UUID

  model_config = ConfigDict(from_attributes=True)
