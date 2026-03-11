import { UUID } from "crypto";

interface AuditType {
  old_quota: number;
  new_quota: number;
  reason: string;
  timestamp: Date | string;
  change_owener_id: UUID | string;
}

export { AuditType }