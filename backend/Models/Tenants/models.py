from sqlalchemy import String, Integer, DateTime, ForeignKey, UniqueConstraint, CheckConstraint, Boolean
from sqlalchemy.dialects.postgresql import UUID
from database import Base
from datetime import datetime, UTC
from sqlalchemy.orm import relationship, mapped_column, Mapped
import uuid
from Models.Events.models import Events


class Tenants(Base):
  __tablename__ = "Tenants"

  tenant_id : Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
  username : Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
  password_hash : Mapped[str] = mapped_column(String, nullable=False)
  role : Mapped[str] = mapped_column(String, default="tenant")
  monthly_quota : Mapped[int] = mapped_column(Integer, nullable=False, default=1000)
  allow_overage: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
  events: Mapped[list[Events]] = relationship(Events, back_populates="tenant", cascade="all, delete-orphan")
