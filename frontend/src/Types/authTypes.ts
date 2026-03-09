interface AuthType {
  username: string,
  password: string
}

interface AuthTokenRefreshType {
  refresh_token: string
}

export {
  AuthType,
  AuthTokenRefreshType
}