import { UpdateTenantQuotaComponentType } from "@/Types/componentType";
import { useState } from "react";

export const UpdateTenantQuota: React.FC<UpdateTenantQuotaComponentType> = ({ tenant_id }) => {
  const [requestInProgress, setRequestInProgress] = useState<boolean>(false);
  const [reason, setReason] = useState<string>()

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRequestInProgress(true)
    console.log("Handle!")
    let body = {
      reason: reason,
      allow_overage: e.currentTarget?.overage?.checked || false,
      tenant_id: tenant_id
    }

    console.log("Make request")
    console.log(body)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = e.currentTarget.value
    setReason(value)
  }

  return <form className="update-tenant-quota-section" onSubmit={handleSubmit}>
    <article className="quota-select-section">
      <label>
        New Monthly Quota Limit:
      </label>
      <input type="number" name="quota-amount" />
    </article>
    <article className="reason-section">
      <label>Change Reason:</label>
      <textarea name="reason" onChange={handleChange} maxLength={500} required />
    </article>
    <article className="submit-section">
      <section className="checkbox-section">
        <label>Allow Overage:</label>
        <input type="checkbox" name="overage" />
      </section>
      <input type="submit" role="button" value="Update" disabled={requestInProgress} />
    </article>
  </form>
}