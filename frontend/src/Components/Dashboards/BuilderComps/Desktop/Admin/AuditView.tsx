import { AuditType } from "@/Types/auditTypes";
import { useEffect, useState } from "react";
import { auditClient } from "@/Components/Clients/Tenants/auditClient";

export const AuditView: React.FC = () => {
  const [audits, setAudits] = useState<Array<AuditType>>();

  useEffect(() => {
    auditClient().then((res) => {
      res.status == 200 && setAudits(res.data)
    }).catch((ers) => {
      if (ers.status == 401) {
        window.location.replace("/")
      }
    })
  }, [])

  return <main className="audits-section">
    <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 font-medium text-gray-900 text-left">Change Owner</th>
          <th className="px-4 py-2 font-medium text-gray-900 text-left">Timestamp</th>
          <th className="px-4 py-2 font-medium text-gray-900 text-left">Old Quota</th>
          <th className="px-4 py-2 font-medium text-gray-900 text-left">New Quota</th>
          <th className="px-4 py-2 font-medium text-gray-900 text-left">Reason</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-200">
        {audits?.length && audits.length > 0 ?
          audits.map((event: AuditType, k: number) => {
            const { change_owener_id, old_quota, timestamp, new_quota, reason } = event
            return <tr className="hover:bg-gray-50 transition-colors" key={k}>
              <td className="px-4 py-3 font-medium text-gray-900">{change_owener_id}</td>
              <td className="px-4 py-3 text-gray-700">{timestamp as string}</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center rounded-md bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700 ring-1 ring-inset ring-violet-700/10">
                  {old_quota}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500 text-sm">{new_quota}</td>
              <td className="px-4 py-3 text-gray-500 text-sm">{reason}</td>
            </tr>
          }) :
          <tr>
            <td colSpan={4} className="px-4 py-8 text-center text-gray-500 italic">
              No data available
            </td>
          </tr>
        }
      </tbody>
    </table>
  </main>
}