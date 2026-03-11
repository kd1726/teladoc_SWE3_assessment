import unittest
from datetime import datetime, timedelta, timezone

from Schemas.v1.events_schemas import EventPost, PromptType
from uuid import uuid4
from pydantic import ValidationError


class EventPostTimestampValidationTests(unittest.TestCase):
  def _build_base_payload(self) -> dict:
    now = datetime.now(timezone.utc)
    return {
        "idempotency_key": uuid4(),
        "tenant_id": uuid4(),
        "prompt": "test prompt",
        "prompt_type": PromptType.calculate,
        "token_cost": 10,
        "timestamp": now,
      }

  def test_accepts_timestamp_within_allowed_window(self) -> None:
    payload = self._build_base_payload()
    EventPost(**payload)

    payload_future = {**payload, "timestamp": datetime.now(timezone.utc) + timedelta(minutes=4)}
    EventPost(**payload_future)

    payload_past = {**payload, "timestamp": datetime.now(timezone.utc) - timedelta(days=29)}
    EventPost(**payload_past)

  def test_rejects_timestamp_too_far_in_future(self) -> None:
    payload = self._build_base_payload()
    payload["timestamp"] = datetime.now(timezone.utc) + timedelta(minutes=6)

    with self.assertRaises(ValidationError):
        EventPost(**payload)

  def test_rejects_timestamp_too_far_in_past(self) -> None:
    payload = self._build_base_payload()
    payload["timestamp"] = datetime.now(timezone.utc) - timedelta(days=31)

    with self.assertRaises(ValidationError):
        EventPost(**payload)
