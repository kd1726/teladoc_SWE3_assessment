import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import AdminDashBoardElement from "@/Components/General/DashboardElements/Desktop/AdminDashboardElement"

describe("AdminDashBoardElement component", () => {
  it("renders the title in a heading", () => {
    render(<AdminDashBoardElement title="Admin Section" component={<p>Admin Content</p>} />)

    expect(screen.getByText("Admin Section")).toBeDefined()
  })

  it("renders the child component inside the container", () => {
    render(<AdminDashBoardElement title="Title" component={<p>Admin Child</p>} />)

    expect(screen.getByText("Admin Child")).toBeDefined()
  })

  it("renders with default empty values without crashing", () => {
    const { container } = render(<AdminDashBoardElement />)

    expect(container.querySelector("main")).not.toBeNull()
  })
})
