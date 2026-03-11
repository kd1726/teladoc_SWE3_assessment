import { getRangeofTenants } from "@/Components/Clients/Tenants/tenantClient";
import { ViewTenantEventsComponentType } from "@/Types/componentType";
import { UsageGranularityTypeGet, UsageEventRangeTypeSubmit } from "@/Types/eventTypes";
import { JSX, useState } from "react";

export default function ViewTenantEvents({ tenant_id }: ViewTenantEventsComponentType): JSX.Element {
  const [events, setEvents] = useState<Array<UsageGranularityTypeGet>>();
  const [requestInProgress, setRequestInProgress] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>()

  const now = new Date();
  const yesterday = new Date(now.getTime() - (1 * 24 * 60 * 60 * 1000));
  const minDateTime = yesterday.toISOString().slice(0, 16);

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const minValToday = startOfToday.toISOString().slice(0, 16);

  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59);
  const maxValToday = endOfToday.toISOString().slice(0, 16);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRequestInProgress(true)
    let body: UsageEventRangeTypeSubmit = {
      from_time: new Date(e.currentTarget.from.value),
      to_time: new Date(e.currentTarget.to.value),
      granularity: "day"
    }

    getRangeofTenants(tenant_id, body).then((res) => {
      if (res.status == 200) {
        setEvents(res.data)
      }
    }).catch(ers => {
      if (ers.status === 403 || ers.status === 403) {
        setErrorMessage("Resource is resricted")
      }
      console.error(ers)
    })
    setRequestInProgress(false)
  }

  return <main className="view-all-tenant-events-section">
    <form className="inputs-section" onSubmit={handleSubmit}>
      <section className="title-section">
        <h2>Get Tenant data by range</h2>
      </section>
      <section className="inputs">
        <article>
          <label>
            From:
          </label>
          <input type="datetime-local" max={minDateTime} name="from" />
        </article>
        <article>
          <label>
            To:
          </label>
          <input type="datetime-local" min={minValToday} max={maxValToday} name="to" />
        </article>
        <article>
          <input type="submit" value="get" disabled={requestInProgress} />
        </article>
      </section>
    </form>
    <section className="tenant-events-section p-2">
      <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 font-medium text-gray-900 text-left">Period</th>
            <th className="px-4 py-2 font-medium text-gray-900 text-left">Token Usage</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {events?.length && events.length > 0 ?
            events.map((event: UsageGranularityTypeGet, k: number) => {
              const { period, total_token_usage } = event
              return <tr className="hover:bg-gray-50 transition-colors" key={k}>
                <td className="px-4 py-3 font-medium text-gray-900">{period}</td>
                <td className="px-4 py-3 text-gray-700">{total_token_usage}</td>
              </tr>
            }) :
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-gray-500 italic">
                {errorMessage ? errorMessage : "No data available"}
              </td>
            </tr>
          }
        </tbody>
      </table>
    </section>
  </main>
}

