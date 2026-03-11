import unittest
import uuid
from datetime import datetime, timezone

from Schemas.v1.events_schemas import EventPost, PromptType
from Services.event_service import EventService


class DummyUser:
  def __init__(self, monthly_quota: int, month_to_date_usage: int, allow_overage: bool, role: str = "tenant"):
    self.monthly_quota = monthly_quota
    self.month_to_date_usage = month_to_date_usage
    self.allow_overage = allow_overage
    self.role = role


class EventServiceNoMoreQuotaTests(unittest.TestCase):
  def _make_event(self, token_cost: int) -> dict:
    event = EventPost(
      idempotency_key=uuid.uuid4(),
      tenant_id=uuid.uuid4(),
      prompt="test",
      prompt_type=PromptType.calculate,
      token_cost=token_cost,
      timestamp=datetime.now(timezone.utc),
    )
    data = event.model_dump(mode="json")
    return data

  def test_normal_tenant_blocked_when_quota_exceeded(self) -> None:
    user = DummyUser(monthly_quota=100, month_to_date_usage=90, allow_overage=False, role="tenant")
    event_data = self._make_event(token_cost=20)

    service = EventService(user, event_data)

    self.assertTrue(service.no_more_quota())

  def test_overage_tenant_not_blocked_even_when_over_quota(self) -> None:
    user = DummyUser(monthly_quota=100, month_to_date_usage=110, allow_overage=True, role="tenant")
    event_data = self._make_event(token_cost=50)

    service = EventService(user, event_data)

    self.assertFalse(service.no_more_quota())

  def test_admin_not_blocked_even_when_over_quota(self) -> None:
    user = DummyUser(monthly_quota=100, month_to_date_usage=110, allow_overage=False, role="admin")
    event_data = self._make_event(token_cost=50)

    service = EventService(user, event_data)

    self.assertFalse(service.no_more_quota())


