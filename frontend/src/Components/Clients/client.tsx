import axios, { AxiosInstance } from "axios"
import { BASE_URL } from "@/Config/config"
import { HTTPClientType } from "@/Types/networkTypes"

export default function HTTPClient({ customHeaders }: HTTPClientType = null): AxiosInstance {
  const axiosRequest: AxiosInstance = customHeaders ?
    axios.create({
      baseURL: BASE_URL,
      timeout: 5000,
      headers: customHeaders
    }) : axios.create({
      baseURL: BASE_URL,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
  return axiosRequest
}