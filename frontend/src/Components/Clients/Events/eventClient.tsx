import { UsageEventSubmitType } from "@/Types/eventTypes";
import HTTPClient from "../client";
import { APIVersion } from "@/Config/config";

export const postEventClient = (tenant_id: string, eventData: UsageEventSubmitType) => {
  return HTTPClient().post(`${APIVersion}/${tenant_id}/usage/event`, eventData)
}