import uuid
from datetime import datetime, timezone

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker

from main import app
from database import Base
from Models.Tenants.models import Tenants
from Models.Audits.models import Audit
from Schemas.v1.tenants_schemas import TenantQuotaUpdate
from Services.auth_service import AuthService


SQLALCHEMY_DATABASE_URL = "sqlite+pysqlite:///:memory:"


@pytest.fixture(scope="session")
def test_engine():
  engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
  Base.metadata.create_all(bind=engine)
  return engine


@pytest.fixture
def db_session(test_engine):
  TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
  session = TestingSessionLocal()
  try:
    yield session
  finally:
    session.close()


@pytest.fixture
def client(db_session):
  from database import get_db as real_get_db

  def override_get_db():
    try:
      yield db_session
    finally:
      pass

  app.dependency_overrides[real_get_db] = override_get_db

  admin_tenant = Tenants(
    tenant_id=uuid.uuid4(),
    username="admin",
    password_hash="hashed",
    role="admin",
    monthly_quota=1000,
    allow_overage=False,
  )
  db_session.add(admin_tenant)
  db_session.commit()
  db_session.refresh(admin_tenant)

  def override_get_current_user():
    return admin_tenant

  app.dependency_overrides[AuthService.get_current_user] = override_get_current_user

  return TestClient(app)


def test_quota_update_requires_reason_and_creates_audit_record(client, db_session):
    tenant = Tenants(
      tenant_id=uuid.uuid4(),
      username="tenant1",
      password_hash="hashed",
      role="tenant",
      monthly_quota=1000,
      allow_overage=False,
    )
    db_session.add(tenant)
    db_session.commit()
    db_session.refresh(tenant)

    payload = TenantQuotaUpdate(
      tenant_id=tenant.tenant_id,
      reason="Increasing quota for higher usage pattern",
      old_quota=tenant.monthly_quota,
      new_quota=2000,
      timestamp=datetime.now(timezone.utc),
      allow_overage=True,
    ).model_dump(mode="json")

    response = client.patch(f"/v1/tenants/{str(tenant.tenant_id)}/quota", json=payload)

    assert response.status_code == 202
    body = response.json()
    assert body["status"] == "success"
    assert body["new_quota"] == 2000

    updated_tenant = db_session.execute(select(Tenants).where(Tenants.tenant_id == tenant.tenant_id)).scalars().first()
    assert updated_tenant.monthly_quota == 2000
    assert updated_tenant.allow_overage is True

    audit_records = db_session.execute(select(Audit).where(Audit.change_owener_id == tenant.tenant_id)).scalars().all()
    assert len(audit_records) == 1
    audit = audit_records[0]
    assert audit.old_quota == 1000
    assert audit.new_quota == 2000
    assert audit.reason == "Increasing quota for higher usage pattern"

