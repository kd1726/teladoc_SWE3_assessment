import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Desktop from "@/Desktop"

describe("Desktop component", () => {
  it("renders the base container", () => {
    const { container } = render(<Desktop />)

    expect(container.querySelector(".base-container")).not.toBeNull()
  })

  it("renders the login page at the default route", () => {
    render(<Desktop />)

    expect(screen.getByText("Tenant Quota Dashboard")).toBeDefined()
  })
})
