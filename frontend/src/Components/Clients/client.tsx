import axios, { AxiosInstance } from "axios"
import { BASE_URL } from "@/Config/config"
import { HTTPClientType } from "@/Types/networkTypes"

export default function HTTPClient({ customHeaders = {} }: HTTPClientType = {}): AxiosInstance {
  const safeHeaders = customHeaders || {}
  const hasCustomHeaders = Object.keys(safeHeaders).length > 0;

  const axiosRequest: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: hasCustomHeaders ? safeHeaders : {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  })

  return axiosRequest
}