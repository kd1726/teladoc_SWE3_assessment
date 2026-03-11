from pydantic import Field, ConfigDict, BaseModel
from datetime import datetime
from uuid import UUID


class BaseAudit(BaseModel):
  model_config = ConfigDict(from_attributes=True)

  old_quota: int = Field(gt=0)
  new_quota: int = Field(gt=0)
  reason: str = Field(min_length=10, max_length=500)
  timestamp :datetime
  change_owener_id: UUID
