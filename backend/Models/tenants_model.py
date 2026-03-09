from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, UniqueConstraint, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from database import Base
from sqlalchemy.orm import relationship
from .events_model import EventsDB
import uuid


class TenantsDB(Base):
  __tablename__ = "Tenants"

  tenant_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
  username = Column(String(20), unique=True, nullable=False)
  password_hash = Column(String, nullable=False)
  role = Column(String, default="tenant")
  monthly_quota = Column(Integer, default=1000)
  events = relationship("EventsDB", back_populates="tenant")