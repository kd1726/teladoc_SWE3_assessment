import axios, { AxiosInstance } from "axios"
import { BASE_URL } from "@/Config/config"
import { HTTPClientType } from "@/Types/networkTypes"

export default function HTTPClient({ customHeaders = {} }: HTTPClientType = {}): AxiosInstance {
  const axiosRequest: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...customHeaders
    }
  })

  axiosRequest.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  return axiosRequest
}