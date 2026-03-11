import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import userEvent from "@testing-library/user-event"
import { ViewAllTenants } from "@/Components/Dashboards/BuilderComps/Desktop/Admin/ViewAllTenants"
import { TenantDataResponse } from "@/Types/tenantTypes"

const makeTenant = (overrides: Partial<TenantDataResponse> = {}): TenantDataResponse => ({
  tenant_id: "tenant-1",
  monthly_quota: 1000,
  month_to_date_usage: 100,
  remaining_quota: 900,
  events: [],
  last_active: "2026-03-01",
  capacity_warn: false,
  over_capacity: false,
  allow_overage: false,
  ...overrides,
})

describe("ViewAllTenants component (admin-only)", () => {
  it("renders tenant rows with correct data", () => {
    render(
      <ViewAllTenants
        tenants={[makeTenant()]}
        selectTenant={vi.fn()}
        selectedTenant={undefined as any}
      />
    )

    expect(screen.getByText("tenant-1")).toBeDefined()
    expect(screen.getByText("100")).toBeDefined()
    expect(screen.getByText("1000")).toBeDefined()
  })

  it("renders 'No data available' when tenants list is empty", () => {
    render(
      <ViewAllTenants
        tenants={[]}
        selectTenant={vi.fn()}
        selectedTenant={undefined as any}
      />
    )

    expect(screen.getByText("No data available")).toBeDefined()
  })

  it("renders normal status indicator when tenant is within quota", () => {
    const { container } = render(
      <ViewAllTenants
        tenants={[makeTenant({ capacity_warn: false, over_capacity: false })]}
        selectTenant={vi.fn()}
        selectedTenant={undefined as any}
      />
    )

    const statusSpan = container.querySelector("td span")!
    expect(statusSpan.className).toBe("")
    expect(statusSpan.title).toBe("")
  })

  it("renders warning status indicator when tenant is approaching quota", () => {
    const { container } = render(
      <ViewAllTenants
        tenants={[makeTenant({ capacity_warn: true, over_capacity: false })]}
        selectTenant={vi.fn()}
        selectedTenant={undefined as any}
      />
    )

    const statusSpan = container.querySelector("td span")!
    expect(statusSpan.className).toBe("warn")
    expect(statusSpan.title).toBe("WARNING")
  })

  it("renders over-capacity status indicator when tenant exceeds quota", () => {
    const { container } = render(
      <ViewAllTenants
        tenants={[makeTenant({ capacity_warn: true, over_capacity: true })]}
        selectTenant={vi.fn()}
        selectedTenant={undefined as any}
      />
    )

    const statusSpan = container.querySelector("td span")!
    expect(statusSpan.className).toBe("over")
  })

  it("calls selectTenant when a tenant row is clicked", async () => {
    const selectTenant = vi.fn()
    const tenant = makeTenant()

    render(
      <ViewAllTenants
        tenants={[tenant]}
        selectTenant={selectTenant}
        selectedTenant={undefined as any}
      />
    )

    const user = userEvent.setup()
    const row = screen.getByText("tenant-1").closest("tr")!
    await user.click(row)

    expect(selectTenant).toHaveBeenCalled()
  })
})
