interface UsageEventGetResponseType {
  event_id: string;
  tenant_id: string;
  prompt_type: EventType;
  token_cost: number;
  prompt: string;
  status: string,
  idempotency_key: string;
  timestamp: Date | string
}

enum StatusEnum {
  complete = "COMPLETE",
  pending = "PENIDNG",
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
  idempotency_key: string;
  tenant_id: string;
  prompt: string;
  prompt_type: string;
  timestamp: Date | string;
  token_cost: number;
}

enum Granularity {
  day = "day"
}
interface UsageEventRangeTypeSubmit {
  from_time: Date;
  to_time: Date;
  granularity: keyof typeof Granularity,
}

interface UsageGranularityTypeGet {
  period: string,
  total_token_usage: number
}

export {
  UsageEventGetResponseType,
  UsageEventStatusResponseType,
  UsageEventSubmitType,
  EventType,
  UsageEventRangeTypeSubmit,
  UsageGranularityTypeGet
}