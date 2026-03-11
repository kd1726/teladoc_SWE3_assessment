import { describe, it, expect } from "vitest"
import { StrictMode, act } from "react"
import { createRoot } from "react-dom/client"
import App from "@/App"

describe("main module dependencies", () => {
  it("can import all required dependencies for mounting", () => {
    expect(StrictMode).toBeDefined()
    expect(createRoot).toBeDefined()
    expect(App).toBeDefined()
  })

  it("renders App into a root container element", async () => {
    const container = document.createElement("div")
    container.id = "root"
    document.body.appendChild(container)

    const root = createRoot(container)
    await act(async () => {
      root.render(<StrictMode><App /></StrictMode>)
    })

    expect(container.innerHTML).not.toBe("")

    root.unmount()
    document.body.removeChild(container)
  })
})
