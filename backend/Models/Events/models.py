from sqlalchemy import String, Integer, DateTime, ForeignKey, UniqueConstraint, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from database import Base
from datetime import datetime, UTC
from sqlalchemy.orm import relationship, mapped_column, Mapped
import uuid


class Events(Base):
  __tablename__ = "Useage_Events"

  event_id: Mapped[UUID]= mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
  tenant_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("Tenants.tenant_id"), nullable=False)
  prompt_type: Mapped[str] = mapped_column(String, nullable=False)
  token_cost: Mapped[float] = mapped_column(Integer, nullable=False, default=1)
  idempotency_key: Mapped[UUID] = mapped_column(String, nullable=False, unique=True)
  timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.now(UTC))
  tenant: Mapped["Tenants"] = relationship("Tenants", back_populates="events")
  prompt: Mapped[str] = mapped_column(String, nullable=False, default="")
  status: Mapped[str | None] = mapped_column(String, nullable=True, default="PENDING")
  __table_args__ = (
          UniqueConstraint('tenant_id', 'idempotency_key', name='_tenant_idempotency_uc'),
          CheckConstraint('token_cost > 0', name='check_positive_cost'),
      )