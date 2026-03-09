import HTTPClient from "../client";
import { APIVersion } from "@/Config/config";

export const getOneTenent = (tenent_id: number) => {
  HTTPClient().get(`${APIVersion}/${tenent_id}`)
}

export const getAllTenants = () => {
  HTTPClient().get(`${APIVersion}/tenants`)
}

export const getRangeofTenants = (tenant_id: string, fromTime: string, toTime: string, granularity: string = "day") => {
  HTTPClient().get(`${APIVersion}/tenants/${tenant_id}usage`,
    {
      params: {
        from_time: fromTime,
        to_time: toTime,
        granularity: granularity
      }
    })
};

export const updateTenantQuote = (tenant_id: string, newQuota: number) => {
  return HTTPClient().put(`${APIVersion}/${tenant_id}/quota`, null, {
    params: { new_quota: newQuota }
  })
};