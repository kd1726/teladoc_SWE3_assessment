import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Quota } from "@/Components/Dashboards/BuilderComps/Desktop/Tenant/Quota"

describe("Quota component", () => {
  it("displays total monthly quota and usage values", () => {
    render(<Quota mq={2000} mq_used={500} mq_remaining={1500} />)

    expect(screen.getByText(/Total Monthly Quota: 2000/)).toBeDefined()
    expect(screen.getByText(/Total Monthly Quota Used: 500/)).toBeDefined()
  })

  it("renders normal state with no warning color when usage is below 90% threshold", () => {
    render(<Quota mq={1000} mq_used={100} mq_remaining={900} />)

    const remaining = screen.getByText(/Total Monthly Quota Remaining/i)
    expect(remaining.textContent).toContain("900")
    expect(remaining.style.color).toBe("")
  })

  it("renders warning color when usage exceeds 90% threshold but is below quota", () => {
    render(<Quota mq={1000} mq_used={950} mq_remaining={50} />)

    const remaining = screen.getByText(/Total Monthly Quota Remaining/i)
    expect(remaining.textContent).toContain("50")
    expect(remaining.style.color).not.toBe("")
  })

  it("renders over-quota message with warning color when usage meets or exceeds quota", () => {
    render(<Quota mq={1000} mq_used={1100} mq_remaining={-100} />)

    const remaining = screen.getByText(/Total Monthly Quota Remaining/i)
    expect(remaining.textContent).toContain("Over by 100")
    expect(remaining.style.color).not.toBe("")
  })

  it("does not warn at exactly 90% usage (threshold is strictly greater-than)", () => {
    render(<Quota mq={1000} mq_used={900} mq_remaining={100} />)

    const remaining = screen.getByText(/Total Monthly Quota Remaining/i)
    expect(remaining.textContent).toContain("100")
    expect(remaining.style.color).toBe("")
  })
})
