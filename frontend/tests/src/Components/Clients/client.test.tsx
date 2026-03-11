import { describe, it, expect, vi } from "vitest"
import HTTPClient from "@/Components/Clients/client"

describe("HTTPClient", () => {
  it("returns an axios instance with expected defaults", () => {
    const client = HTTPClient()

    expect(client).toBeDefined()
    expect(client.defaults.headers["Content-Type"]).toBe("application/json")
    expect(client.defaults.headers["Accept"]).toBe("application/json")
    expect(client.defaults.timeout).toBe(5000)
  })

  it("attaches Authorization header from localStorage when token exists", async () => {
    const fakeToken = "test-jwt-token"
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(fakeToken)

    const client = HTTPClient()
    const interceptors = (client.interceptors.request as any).handlers

    expect(interceptors.length).toBeGreaterThan(0)

    const config = { headers: {} as Record<string, string> }
    const result = interceptors[0].fulfilled(config)

    expect(result.headers.Authorization).toBe(`Bearer ${fakeToken}`)

    vi.restoreAllMocks()
  })

  it("does not attach Authorization header when no token exists", () => {
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null)

    const client = HTTPClient()
    const interceptors = (client.interceptors.request as any).handlers

    const config = { headers: {} as Record<string, string> }
    const result = interceptors[0].fulfilled(config)

    expect(result.headers.Authorization).toBeUndefined()

    vi.restoreAllMocks()
  })

  it("merges custom headers with defaults", () => {
    const client = HTTPClient({ customHeaders: { "X-Custom": "value" } })

    expect(client.defaults.headers["X-Custom"]).toBe("value")
    expect(client.defaults.headers["Content-Type"]).toBe("application/json")
  })
})
