import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { UpdateTenantQuota } from "@/Components/Dashboards/BuilderComps/Desktop/Admin/UpdateTenentQuota"

describe("UpdateTenantQuota component (admin-only)", () => {
  it("renders the quota update form with all required fields", () => {
    render(<UpdateTenantQuota tenant_id="test-id" allow_overage={false} quota={1000} />)

    expect(screen.getByText(/New Monthly Quota Limit/i)).toBeDefined()
    expect(screen.getByText(/Change Reason/i)).toBeDefined()
    expect(screen.getByText(/Allow Overage/i)).toBeDefined()
    expect(screen.getByRole("button", { name: "Update" })).toBeDefined()
  })

  it("displays current overage status as false", () => {
    render(<UpdateTenantQuota tenant_id="test-id" allow_overage={false} quota={1000} />)

    expect(screen.getByText(/Overage status is currently: false/)).toBeDefined()
  })

  it("displays current overage status as true with checkbox pre-checked", () => {
    render(<UpdateTenantQuota tenant_id="test-id" allow_overage={true} quota={1000} />)

    expect(screen.getByText(/Overage status is currently: true/)).toBeDefined()
    const checkbox = screen.getByRole("checkbox") as HTMLInputElement
    expect(checkbox.checked).toBe(true)
  })

  it("has a required reason textarea with min/max length constraints", () => {
    const { container } = render(
      <UpdateTenantQuota tenant_id="test-id" allow_overage={false} quota={1000} />
    )

    const textarea = container.querySelector("textarea[name='reason']") as HTMLTextAreaElement
    expect(textarea).not.toBeNull()
    expect(textarea.required).toBe(true)
    expect(textarea.minLength).toBe(10)
    expect(textarea.maxLength).toBe(500)
  })

  it("has a number input for the new quota amount", () => {
    const { container } = render(
      <UpdateTenantQuota tenant_id="test-id" allow_overage={false} quota={1000} />
    )

    const input = container.querySelector("input[name='quota_amount']") as HTMLInputElement
    expect(input).not.toBeNull()
    expect(input.type).toBe("number")
  })
})
