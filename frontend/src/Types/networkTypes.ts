import { AxiosHeaders } from "axios"

interface HTTPClientType {
  customHeaders?: Record<string, string>
}

export {
  HTTPClientType
}