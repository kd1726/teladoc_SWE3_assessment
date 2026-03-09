import HTTPClient from "../client";
import { AuthTokenRefreshType, AuthType } from "@/Types/authTypes";
import { APIVersion } from "@/Config/config";

export const AuthClient = (authData: AuthType) => {
  return HTTPClient().post(`${APIVersion}/authenticate`, authData)
}

export const RefreshAuthClient = (refreshAuthData: AuthTokenRefreshType, customerHeaders = null) => {
  return HTTPClient(customerHeaders).post("/autenticate-Refresh", refreshAuthData)
}