import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { DTDUsage } from "@/Components/Dashboards/BuilderComps/Desktop/Tenant/DTDUsage"
import { UsageEventGetResponseType } from "@/Types/eventTypes"

const makeEvent = (overrides: Partial<UsageEventGetResponseType> = {}): UsageEventGetResponseType => ({
  event_id: "e1",
  tenant_id: "t1",
  prompt_type: "CALCULATE" as any,
  token_cost: 10,
  prompt: "test prompt",
  status: "COMPLETE",
  idempotency_key: "key-1",
  timestamp: "2026-03-01T00:00:00Z",
  ...overrides,
})

describe("DTDUsage component", () => {
  it("renders table column headers", () => {
    render(<DTDUsage events={[]} />)

    expect(screen.getByText("Type")).toBeDefined()
    expect(screen.getByText("Token Cost")).toBeDefined()
    expect(screen.getByText("Date Executed")).toBeDefined()
    expect(screen.getByText("Prompt")).toBeDefined()
  })

  it("renders 'No data available' when events list is empty", () => {
    render(<DTDUsage events={[]} />)

    expect(screen.getByText("No data available")).toBeDefined()
  })

  it("renders event rows when events are provided", () => {
    render(<DTDUsage events={[makeEvent()]} />)

    expect(screen.getByText("CALCULATE")).toBeDefined()
    expect(screen.getByText("10")).toBeDefined()
    expect(screen.getByText("test prompt")).toBeDefined()
  })

  it("renders multiple event rows", () => {
    const events = [
      makeEvent({ event_id: "e1", prompt: "first prompt" }),
      makeEvent({ event_id: "e2", prompt: "second prompt", prompt_type: "LLM_REQUEST" as any, token_cost: 5 }),
    ]

    render(<DTDUsage events={events} />)

    expect(screen.getByText("first prompt")).toBeDefined()
    expect(screen.getByText("second prompt")).toBeDefined()
    expect(screen.getByText("LLM_REQUEST")).toBeDefined()
  })
})
