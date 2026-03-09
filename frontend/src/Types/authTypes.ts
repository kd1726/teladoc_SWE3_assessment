interface AuthType {
  username: string,
  password: string
}

interface AuthTokenRefreshType {
  refresh_token: string
}

interface JWTToken {
  sub: string;
  role: string;
  tenant_id: string;
  exp: number;
}

export {
  AuthType,
  AuthTokenRefreshType,
  JWTToken
}