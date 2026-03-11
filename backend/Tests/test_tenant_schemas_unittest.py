import unittest
import uuid
from datetime import datetime, timedelta, timezone

from Schemas.v1.tenants_schemas import TenantGet
from Schemas.v1.events_schemas import EventBase, PromptType, StatusType


class TenantSchemasUnitTests(unittest.TestCase):
  def _make_event(self, token_cost: int, timestamp: datetime) -> EventBase:
    return EventBase(
      event_id=uuid.uuid4(),
      tenant_id=uuid.uuid4(),
      prompt_type=PromptType.calculate,
      prompt="test",
      token_cost=token_cost,
      timestamp=timestamp,
      status=StatusType.pending,
      idempotency_key=uuid.uuid4(),
    )

  def test_remaining_quota_and_flags_normal_usage(self) -> None:
    now = datetime.now(timezone.utc)
    events = [
        self._make_event(100, now),
        self._make_event(200, now - timedelta(days=1)),
    ]

    tenant = TenantGet(
        tenant_id=uuid.uuid4(),
        username="tenant",
        monthly_quota=1000,
        events=events,
        allow_overage=False,
    )

    self.assertEqual(tenant.month_to_date_usage, 300)
    self.assertEqual(tenant.remaining_quota, 700)
    self.assertFalse(tenant.capacity_warn)
    self.assertFalse(tenant.over_capacity)

  def test_capacity_warn_and_over_capacity_flags(self) -> None:
    now = datetime.now(timezone.utc)
    events_warn = [self._make_event(900, now)]

    tenant_warn = TenantGet(
        tenant_id=uuid.uuid4(),
        username="tenant",
        monthly_quota=1000,
        events=events_warn,
        allow_overage=False,
    )

    self.assertEqual(tenant_warn.month_to_date_usage, 900)
    self.assertTrue(tenant_warn.capacity_warn)
    self.assertFalse(tenant_warn.over_capacity)

    events_over = [self._make_event(1100, now)]

    tenant_over = TenantGet(
        tenant_id=uuid.uuid4(),
        username="tenant",
        monthly_quota=1000,
        events=events_over,
        allow_overage=False,
    )

    self.assertEqual(tenant_over.month_to_date_usage, 1100)
    self.assertTrue(tenant_over.capacity_warn)
    self.assertTrue(tenant_over.over_capacity)

