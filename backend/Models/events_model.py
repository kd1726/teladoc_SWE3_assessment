from sqlalchemy import Column, String, Float, DateTime, ForeignKey, UniqueConstraint, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from database import Base
from sqlalchemy.orm import relationship, declarative_base
import uuid

class EventsDB(Base):
  __tablename__ = "Useage_Events"

  event_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
  tenant_id = Column(UUID(as_uuid=True), ForeignKey("Tenants.tenant_id"), nullable=False)
  prompt_type = Column(String, nullable=False)
  token_cost = Column(Float, nullable=False)
  idempotency_key = Column(String, nullable=False)
  timestamp = Column(DateTime(timezone=True), nullable=False)
  tenant = relationship("TenantsDB", back_populates="events")
  
  __table_args__ = (
          UniqueConstraint('tenant_id', 'idempotency_key', name='_tenant_idempotency_uc'),
          CheckConstraint('token_cost > 0', name='check_positive_cost'),
      )