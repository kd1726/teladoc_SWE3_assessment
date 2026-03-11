import { ViewAllTenantsComponentType } from "@/Types/componentType"
import { TenantDataResponse } from "@/Types/tenantTypes"

export const ViewAllTenants: React.FC<ViewAllTenantsComponentType> = ({ tenants = [], selectTenant, selectedTenant }) => {
  return <main className="view-all-tenants-section">
    <table className="min-w-full divide-y divide-gray-200 bg-white text-sm rounded-2xl">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 font-medium text-gray-900 text-left">Tenant Id</th>
          <th className="px-4 py-2 font-medium text-gray-900 text-left">Status</th>
          <th className="px-4 py-2 font-medium text-gray-900 text-left">MTM Usage</th>
          <th className="px-4 py-2 font-medium text-gray-900 text-left">Quota</th>
          <th className="px-4 py-2 font-medium text-gray-900 text-left">Last Active</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-200">
        {
          tenants && tenants.length > 0 ? tenants.map((tenant: TenantDataResponse) => {
            const { tenant_id, monthly_quota, month_to_date_usage, last_active, over_capacity, capacity_warn } = tenant
            return <tr className={`hover:bg-gray-50 transition-colors hover:cursor-pointer ${tenant == selectedTenant ? "bg-sky-300" : ""}`} onClick={() => selectTenant(() => tenant)}>
              <td className="px-4 py-3 font-medium text-gray-900">{tenant_id}</td>
              <td className="px-4 py-3 flex justify-center items-center"><CircleStatus over={over_capacity} warn={capacity_warn} /></td>
              <td className="px-4 py-3 font-medium text-gray-900">{month_to_date_usage}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{monthly_quota}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{last_active}</td>
            </tr>
          }) : <tr>
            <td colSpan={4} className="px-4 py-8 text-center text-gray-500 italic">
              No data available
            </td>
          </tr>
        }
      </tbody>
    </table>
  </main>
}

type CircleStatusType = {
  warn: boolean,
  over: boolean
}

const CircleStatus: React.FC<CircleStatusType> = ({ warn, over }) => {
  return <span className={over ? "over" : warn ? "warn" : ""} title={warn ? "WARNING" : over ? "EXCEEDED" : ""} />
}