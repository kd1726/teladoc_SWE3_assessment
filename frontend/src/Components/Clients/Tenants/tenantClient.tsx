import HTTPClient from "../client";
import { APIVersion } from "@/Config/config";
import { UsageEventRangeTypeSubmit } from "@/Types/eventTypes";
import { UpdateTenantType } from "@/Types/tenantTypes";
import { UUID } from "crypto";

export const getOneTenent = (tenent_id: number | string) => {
  return HTTPClient().get(`/${APIVersion}/tenants/${tenent_id}`)
}

export const getAllTenants = () => {
  return HTTPClient().get(`${APIVersion}/tenants`)
}

export const getRangeofTenants = (tenant_id: string, params: UsageEventRangeTypeSubmit) => {
  return HTTPClient().get(`${APIVersion}/tenants/${tenant_id}/usage`,
    {
      params: params
    })
};

export const updateTenantQuoteClient = (tenant_id: string, data: UpdateTenantType) => {
  return HTTPClient().patch(`${APIVersion}/tenants/${tenant_id}/quota`, data)
};