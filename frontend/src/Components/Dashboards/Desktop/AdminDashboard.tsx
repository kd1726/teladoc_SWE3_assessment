import { Navigation } from "@/Components/General/Navigation/Desktop/Navigation"
import { JSX, useEffect, useState } from "react"
import AdminDashBoardElement from "@/Components/General/DashboardElements/Desktop/AdminDashboardElement"
import { TenantDataResponse } from "@/Types/tenantTypes"
import { UsageEventResponseType } from "@/Types/eventTypes"
import { ViewAllTenants } from "../BuilderComps/Desktop/Admin/ViewAllTenants"
import TenantDashboard from "./TenantDashboard"
import { UpdateTenantQuota } from "../BuilderComps/Desktop/Admin/UpdateTenentQuota"

export default function AdminDashboard(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [allTenants, setAllTenants] = useState<Array<TenantDataResponse>>();
  const [tenantEvents, setTenantEvents] = useState<Array<UsageEventResponseType>>()
  const [selectedTenant, setSelectedTenant] = useState<TenantDataResponse>()

  useEffect(() => {
    console.log("Check if token is valid and authentication. If not redirect back to homepage is so render this compoentn")
  })
  return <>
    <Navigation isAdmin={true} />
    <div className="admin-desktop-dashboard">
      <AdminDashBoardElement title="Tenants" component={<ViewAllTenants tenants={allTenants} selectTenant={setSelectedTenant} />} />
      <AdminDashBoardElement title="Tenant Dashboard" version={2} component={selectedTenant ? <TenantDashboard adminTenantData={selectedTenant} /> : <></>} />
      <AdminDashBoardElement title="Upgrade Tenant Quota" version={2} component={<UpdateTenantQuota tenant_id={1} />} />
    </div>
  </>
}

