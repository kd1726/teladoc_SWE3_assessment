import { UsageEventGetResponseType } from "./eventTypes"
import React, { ReactNode } from "react"
import { TenantDataResponse } from "./tenantTypes"

interface NavigationComponentType {
  isAdmin?: boolean
}

interface TenantDashboardComponentType {
  adminTenantData?: TenantDataResponse | null
}

interface CreateEventComponentType {
  tenant_id: string
  mtq: number,
  mq: number
}

interface ProgressBarComponentType {
  percentage: number
}

interface QuotaComponentType {
  mq: number
  mq_used: number
  mq_remaining: number
}

interface DTDUsageComponentType {
  events: Array<UsageEventGetResponseType>
}

interface DashboardElementComponentType {
  title?: string;
  component?: ReactNode;
}

interface AdminDashboardElementComponentType extends DashboardElementComponentType {
  version?: number
}

interface ViewAllTenantsComponentType {
  tenants: Array<TenantDataResponse>;
  selectTenant: React.Dispatch<React.SetStateAction<TenantDataResponse>>;
  selectedTenant: TenantDataResponse
}

interface UpdateTenantQuotaComponentType {
  tenant_id: string;
  allow_overage: boolean;
  quota: number
}

interface ViewTenantEventsComponentType {
  tenant_id: string
}

export {
  CreateEventComponentType,
  ProgressBarComponentType,
  QuotaComponentType,
  DTDUsageComponentType,
  DashboardElementComponentType,
  AdminDashboardElementComponentType,
  ViewAllTenantsComponentType,
  TenantDashboardComponentType,
  UpdateTenantQuotaComponentType,
  NavigationComponentType,
  ViewTenantEventsComponentType
}