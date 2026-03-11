import HTTPClient from "../client";
import { APIVersion } from "@/Config/config";

export const auditClient = () => {
  return HTTPClient().get(`${APIVersion}/audits`)
}