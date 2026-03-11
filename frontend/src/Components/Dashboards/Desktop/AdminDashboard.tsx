import { Navigation } from "@/Components/General/Navigation/Desktop/Navigation"
import { JSX, useEffect, useRef, useState } from "react"
import AdminDashBoardElement from "@/Components/General/DashboardElements/Desktop/AdminDashboardElement"
import { TenantDataResponse } from "@/Types/tenantTypes"
import { ViewAllTenants } from "../BuilderComps/Desktop/Admin/ViewAllTenants"
import TenantDashboard from "./TenantDashboard"
import { UpdateTenantQuota } from "../BuilderComps/Desktop/Admin/UpdateTenentQuota"
import { getAllTenants } from "@/Components/Clients/Tenants/tenantClient"
import ViewTenantEvents from "../BuilderComps/Desktop/Admin/ViewTenantEvents"
import { AuditView } from "../BuilderComps/Desktop/Admin/AuditView"

export default function AdminDashboard(): JSX.Element {
  const [allTenants, setAllTenants] = useState<Array<TenantDataResponse>>();
  const [selectedTenant, setSelectedTenant] = useState<TenantDataResponse>()

  let token = localStorage.getItem("accessToken")
  let id = localStorage.getItem("tenantId")
  let role = localStorage.getItem("role")

  useEffect(() => {
    let isAdmin = role == "admin"
    let isValid = (token !== null && token !== undefined) && id as string

    (isValid && isAdmin) ? getAllTenants().then((res) => {
      if (res.status == 200) {
        setAllTenants(res.data)
      }
    }).catch((ers) => {
      console.log(ers)
      if (ers.status == 401) {
        window.location.replace("/")
      }
      console.error(ers)
    }) : window.location.replace("/")
  }, [])

  return <>
    <Navigation isAdmin={true} />
    {allTenants ? <div className="admin-desktop-dashboard">
      <AdminDashBoardElement title="Tenants" component={<ViewAllTenants tenants={allTenants} selectTenant={setSelectedTenant} />} />
      <AdminDashBoardElement title="Tenant Dashboard" version={2} component={selectedTenant ? <TenantDashboard adminTenantData={selectedTenant} /> : <></>} />
      {selectedTenant && <AdminDashBoardElement title="View Tenant Bucket Usage" version={2} component={selectedTenant ? <ViewTenantEvents tenant_id={selectedTenant.tenant_id} /> : <></>} />}
      {selectedTenant && <AdminDashBoardElement title="Upgrade Tenant Quota" version={2} component={<UpdateTenantQuota tenant_id={selectedTenant.tenant_id} quota={selectedTenant.monthly_quota} allow_overage={selectedTenant.allow_overage} />} />}
      <AdminDashBoardElement title="View Audit Trail" version={2} component={<AuditView />} />
    </div> : <></>}
  </>
}

