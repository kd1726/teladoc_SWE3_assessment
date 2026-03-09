import HTTPClient from "../client";
import { AuthTokenRefreshType, AuthType } from "@/Types/authTypes";

export const AuthClient = (authData: AuthType, customerHeaders = null) => {
  return HTTPClient(customerHeaders).post("/Authenticate", authData)
}

export const RefreshAuthClient = (refreshAuthData: AuthTokenRefreshType, customerHeaders = null) => {
  return HTTPClient(customerHeaders).post("/Autenticate-Refresh", refreshAuthData)
}