from pydantic import Field, BaseModel, ConfigDict, field_validator
from datetime import datetime, timezone, timedelta
from uuid import UUID
from enum import Enum
from typing import Optional

class StatusType(str, Enum):
  complete = "COMPLETE"
  pending = "PENDING"

class PromptType(str, Enum):
  calculate = "CALCULATE"
  mcp_request = "MCP_REQUEST"
  llm_request = "LLM_REQUEST"

class EventBase(BaseModel):
  model_config = ConfigDict(from_attributes=True)

  event_id: UUID
  tenant_id: UUID
  prompt_type: PromptType = Field(min_length=1, max_length=20)
  prompt: str = Field(min_length=1, max_length=500)
  token_cost: int = Field(gt=0)
  timestamp: datetime
  status: Optional[StatusType] = Field(min_length=1, max_length=20)
  idempotency_key: UUID

class EventStatusResponse(BaseModel):
  model_config = ConfigDict(from_attributes=True)

  event_id: str
  tenant_id: str
  status: StatusType

class EventPost(BaseModel):
  model_config = ConfigDict(from_attributes=True)

  idempotency_key: UUID
  tenant_id: UUID
  prompt: str = Field(min_length=1, max_length=500)
  prompt_type: PromptType
  token_cost: int = Field(gt=0)
  timestamp: datetime
  status: Optional[StatusType] = None

  @field_validator("timestamp")
  @classmethod
  def validate_event_time(cls, current_time: datetime):
    now = datetime.now(timezone.utc)
    
    if current_time > now + timedelta(minutes=5):
        raise ValueError("Event timestamp cannot be more than 5 minutes in the future")
        
    if current_time < now - timedelta(days=30):
        raise ValueError("Event timestamp cannot be more than 30 days in the past")
      
    return current_time


class EventResponse(EventBase):
  model_config = ConfigDict(from_attributes=True)

class EventGranularitResponse(BaseModel):
  model_config = ConfigDict(from_attributes=True)

  period: datetime
  total_token_usage: int
  
