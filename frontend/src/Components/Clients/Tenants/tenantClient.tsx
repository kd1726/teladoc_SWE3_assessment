import HTTPClient from "../client";
import { APIVersion } from "@/Config/config";
import { UpdateTenantType } from "@/Types/tenantTypes";

export const getOneTenent = (tenent_id: number | string) => {
  return HTTPClient().get(`/${APIVersion}/tenants/${tenent_id}`)
}

export const getAllTenants = () => {
  return HTTPClient().get(`${APIVersion}/tenants`)
}

export const getRangeofTenants = (headers, tenant_id: string, fromTime: string, toTime: string, granularity: string = "day") => {
  return HTTPClient({ customHeaders: headers }).get(`${APIVersion}/tenants/${tenant_id}/usage`,
    {
      params: {
        from_time: fromTime,
        to_time: toTime,
        granularity: granularity
      }
    })
};

export const updateTenantQuoteClient = (tenant_id: string, data: UpdateTenantType) => {
  return HTTPClient().patch(`${APIVersion}/${tenant_id}/quota`, data)
};