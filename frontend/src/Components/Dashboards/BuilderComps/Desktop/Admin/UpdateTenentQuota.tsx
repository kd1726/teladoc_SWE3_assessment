import { UpdateTenantQuotaComponentType } from "@/Types/componentType";
import { UpdateTenantType } from "@/Types/tenantTypes";
import { useState } from "react";
import { updateTenantQuoteClient } from "@/Components/Clients/Tenants/tenantClient";

export const UpdateTenantQuota: React.FC<UpdateTenantQuotaComponentType> = ({ tenant_id }) => {
  const [requestInProgress, setRequestInProgress] = useState<boolean>(false);
  const [reason, setReason] = useState<string>()
  const [successMessage, setSuccessMessage] = useState<string>()

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRequestInProgress(true)
    let body: UpdateTenantType = {
      reason: reason,
      new_quota: e.currentTarget?.quota_amount?.value,
      allow_overage: e.currentTarget?.overage?.checked || false,
      tenant_id: tenant_id
    }

    await updateTenantQuoteClient(tenant_id, body).then((res) => {
      if (res.status == 202) {
        let { status, new_quota } = res.data
        setSuccessMessage(`${status}, New Quota for tenant ${tenant_id}: ${new_quota}`)
      }
    }).catch((ers) => {
      console.error(ers)
    })
    setRequestInProgress(false)
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
      <input type="number" name="quota_amount" />
    </article>
    <article className="reason-section">
      <label>Change Reason:</label>
      <textarea name="reason" onChange={handleChange} minLength={10} maxLength={500} required />
    </article>
    <article className="submit-section">
      <section className="checkbox-section">
        <label>Allow Overage:</label>
        <input type="checkbox" name="overage" />
      </section>
      {successMessage && <p>{successMessage}</p>}
      <input type="submit" role="button" value="Update" disabled={requestInProgress} />
    </article>
  </form>
}