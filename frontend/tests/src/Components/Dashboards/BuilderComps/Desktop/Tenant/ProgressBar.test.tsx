import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { ProgressBar } from "@/Components/Dashboards/BuilderComps/Desktop/Tenant/ProgressBar"

describe("ProgressBar component", () => {
  it("renders normal fill class when percentage is below threshold", () => {
    const { container } = render(<ProgressBar percentage={50} />)

    const fill = container.querySelector("section")!
    expect(fill.className).toContain("progress-bar-fill")
    expect(fill.className).not.toContain("danger")
    expect(fill.textContent).toBe("50.00%")
    expect(fill.style.width).toBe("50%")
  })

  it("renders danger fill class when percentage exceeds 90% threshold", () => {
    const { container } = render(<ProgressBar percentage={95} />)

    const fill = container.querySelector("section")!
    expect(fill.className).toContain("progress-bar-fill-danger")
    expect(fill.textContent).toBe("95.00%")
    expect(fill.style.width).toBe("95%")
  })

  it("caps visual width at 100% when percentage exceeds 100", () => {
    const { container } = render(<ProgressBar percentage={150} />)

    const fill = container.querySelector("section")!
    expect(fill.style.width).toBe("100%")
    expect(fill.textContent).toBe("150.00%")
  })

  it("uses normal fill class at exactly 90% (threshold is strictly greater-than)", () => {
    const { container } = render(<ProgressBar percentage={90} />)

    const fill = container.querySelector("section")!
    expect(fill.className).toContain("progress-bar-fill")
    expect(fill.className).not.toContain("danger")
  })

  it("uses danger fill class at 91%", () => {
    const { container } = render(<ProgressBar percentage={91} />)

    const fill = container.querySelector("section")!
    expect(fill.className).toContain("progress-bar-fill-danger")
  })
})
