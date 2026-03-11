import { UUID } from "crypto";
import { UsageEventGetResponseType } from "./eventTypes"

interface TenantDataResponse {
  tenant_id: string | UUID;
  monthly_quota: number;
  month_to_date_usage: number;
  remaining_quota: number
  events: Array<UsageEventGetResponseType>;
  last_active: string;
  capacity_warn: boolean;
  over_capacity: boolean
  allow_overage: boolean;
}

interface UpdateTenantType {
  tenant_id: string;
  reason: string;
  new_quota: number;
  old_quota: number;
  timestamp: Date
  allow_overage: boolean
}

export {
  TenantDataResponse,
  UpdateTenantType
}