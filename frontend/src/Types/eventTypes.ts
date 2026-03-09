interface UsageEventResponseType {
  event_id: string;
  tenant_id: string;
  type: EventType;
  amountOfTokens: number;
  prompt: string;
  timestamp: Date | string
}

enum StatusEnum {
  complete = "COMPLETE",
  pending = "PENIDNG",
  started = "STARTING"
}

enum EventType {
  calculate = "CALCULATE",
  mcp_request = "MCP_REQUEST",
  llm_request = "LLM_REQUEST"
}
interface UsageEventStatusResponseType {
  event_id: string;
  tenant_id: string;
  status: keyof typeof StatusEnum;
}

interface UsageEventSubmitType {
  event_id: string;
  tenant_id: string;
  type: EventType;
  idempotency_key: string;
  amountOftokens: number;
  prompt: string;
  timestamp: Date | string
}

export {
  UsageEventResponseType,
  UsageEventStatusResponseType,
  UsageEventSubmitType,
  EventType
}