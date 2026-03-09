import { UsageEventResponseType } from "./eventTypes"

interface TenantDataResponse {
  tenantID: number;
  monthlyQuota: number;
  monthToDateUsage: number;
  events: Array<UsageEventResponseType>;
  lastActive: string;
  capacityWarn: boolean;
  overCapacity: boolean
}

export {
  TenantDataResponse
}