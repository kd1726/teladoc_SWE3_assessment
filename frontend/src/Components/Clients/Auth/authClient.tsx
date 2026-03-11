import HTTPClient from "../client";
import { AuthType } from "@/Types/authTypes";
import { APIVersion } from "@/Config/config";

export const AuthClient = (authData: AuthType) => {
  return HTTPClient().post(`${APIVersion}/authenticate`, authData)
}