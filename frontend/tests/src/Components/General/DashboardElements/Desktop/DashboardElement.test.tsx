import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import DashBoardElement from "@/Components/General/DashboardElements/Desktop/DashboardElement"

describe("DashBoardElement component", () => {
  it("renders the title in a heading", () => {
    render(<DashBoardElement title="Test Title" component={<p>Content</p>} />)

    expect(screen.getByText("Test Title")).toBeDefined()
  })

  it("renders the child component inside the container", () => {
    render(<DashBoardElement title="Title" component={<p>Child Content</p>} />)

    expect(screen.getByText("Child Content")).toBeDefined()
  })

  it("renders with default empty values without crashing", () => {
    const { container } = render(<DashBoardElement />)

    expect(container.querySelector(".dashboard-element")).not.toBeNull()
  })
})
