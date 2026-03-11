from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, UTC
from database import Base


class Audit(Base):
  __tablename__ = "audits"

  audit_id : Mapped[int] = mapped_column(Integer, primary_key=True)
  old_quota : Mapped[int] = mapped_column(Integer, nullable=False, default=0)
  new_quota : Mapped[int] = mapped_column(Integer, nullable=False, default=0)
  reason : Mapped[str] = mapped_column(String, nullable=False, default="")
  timestamp: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.now(UTC))
  change_owener_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), nullable=False)