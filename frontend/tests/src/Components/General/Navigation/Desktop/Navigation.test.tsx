import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Navigation } from "@/Components/General/Navigation/Desktop/Navigation"

describe("Navigation component", () => {
  it("displays tenant title when isAdmin is false (default)", () => {
    render(<Navigation />)

    expect(screen.getByText("Tenant Quota Dashboard")).toBeDefined()
    expect(screen.queryByText("Admin Dashboard")).toBeNull()
  })

  it("displays admin title when isAdmin is true", () => {
    render(<Navigation isAdmin={true} />)

    expect(screen.getByText("Admin Dashboard")).toBeDefined()
    expect(screen.queryByText("Tenant Quota Dashboard")).toBeNull()
  })

  it("always renders a logout button regardless of role", () => {
    render(<Navigation />)
    expect(screen.getByText("Log Out")).toBeDefined()
  })
})
