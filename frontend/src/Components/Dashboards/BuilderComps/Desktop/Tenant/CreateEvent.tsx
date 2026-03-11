import { useEffect, useState } from "react";
import { EventType, UsageEventSubmitType } from "@/Types/eventTypes";
import { CreateEventComponentType } from "@/Types/componentType";
import { postEventClient } from "@/Components/Clients/Events/eventClient";
import { UUID } from "crypto";

export const CreateEvent: React.FC<CreateEventComponentType> = ({ tenant_id }) => {
  const DEFAULT_TOKEN_AMOUNT = 1
  const DEFAULT_TYPE = EventType.calculate

  const [tokenAmount, setTokenAmount] = useState<number>(DEFAULT_TOKEN_AMOUNT);
  const [type, setType] = useState<EventType>(DEFAULT_TYPE)
  const [prompt, setPrompt] = useState<string>()
  const [requestInProgress, setRequestInProgress] = useState<boolean>(false);
  const [idempotencyKey, setIdempotencyKey] = useState<UUID>();
  const [eventStatus, setEventStatus] = useState()

  const eventID = crypto.randomUUID()

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRequestInProgress(true)
    let body: UsageEventSubmitType = {
      idempotency_key: idempotencyKey || eventID,
      tenant_id: tenant_id,
      prompt_type: type,
      prompt: prompt,
      token_cost: tokenAmount,
      timestamp: new Date()
    }
    postEventClient(tenant_id, body).then((res) => {
      const { status, idempotency_key } = res.data

      switch (status) {
        case "PENDING":
          setRequestInProgress(true)
          break;
        default:
          setRequestInProgress(false)
          break
      }
      setIdempotencyKey(idempotency_key)
    }).catch(ers => {
      console.log(ers)
      setRequestInProgress(false)
    })
  }

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    switch (e.currentTarget.value) {
      case EventType.calculate:
        setTokenAmount(1)
        setType(EventType.calculate)
        break
      case EventType.mcp_request:
        setTokenAmount(3)
        setType(EventType.mcp_request)
        break
      case EventType.llm_request:
        setTokenAmount(5)
        setType(EventType.llm_request)
        break
      default:
        throw new Error("Either empty or unsupported target value")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = e.currentTarget.value
    setPrompt(value)
  }

  return <form className="event-form" onSubmit={handleSubmit}>
    <article className="type-dropdown-section">
      <label>Request Type:</label>
      <select name="type_of_request" onChange={handleSelect}>
        <option value={EventType.calculate}>Calculate</option>
        <option value={EventType.mcp_request}>MCP Request</option>
        <option value={EventType.llm_request}>LLM Request</option>
      </select>
    </article>
    <article className="prompt-section">
      <label>Prompt:</label>
      <textarea name="prompt" onChange={handleChange} maxLength={500} required />
    </article>
    <article className="submit-section">
      <p>This event will require {tokenAmount} Tokens</p>
      {requestInProgress && <p>Your request is in progress</p>}
      <input type="submit" role="button" value="Generate" />
    </article>
  </form>
}