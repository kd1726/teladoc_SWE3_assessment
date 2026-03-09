import { JSX, useEffect, useState } from "react"
import { AuthClient } from "@/Components/Clients/Auth/authClient"
import DashBoardElement from "@/Components/General/DashboardElements/Desktop/DashboardElement"
import { TenantDataResponse } from "@/Types/tenantTypes"
import { CreateEvent } from "../BuilderComps/Desktop/Tenant/CreateEvent"
import { ProgressBar } from "../BuilderComps/Desktop/Tenant/ProgressBar"
import { Quota } from "../BuilderComps/Desktop/Tenant/Quota"
import { DTDUsage } from "../BuilderComps/Desktop/Tenant/DTDUsage"
import { UsageEventResponseType } from "@/Types/eventTypes"
import { Navigation } from "@/Components/General/Navigation/Desktop/Navigation"
import { TenantDashboardComponentType } from "@/Types/componentType"

export default function TenantDashboard({ adminTenantData = null }: TenantDashboardComponentType): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [tenantData, setTenantData] = useState<TenantDataResponse>();
  const [tenantEvents, setTenantEvents] = useState<Array<UsageEventResponseType>>()

  useEffect(() => {
    console.log("Check if token is valid and authentication. If not redirect back to homepage is so render this compoentn")
    console.log("if user is admin redirect to /dashboard/admin else /dashboard")

  }, [isAuthenticated])

  useEffect(() => {
    adminTenantData ?
      setTenantData(adminTenantData) :
      console.log("Make reqest here")

  }, [])

  useEffect(() => {
    tenantData?.events &&
      tenantData.events.length > 0 &&
      setTenantEvents(tenantData.events)
  }, [tenantData])

  return <>
    <Navigation />
    <div className="desktop-dashboard">
      <DashBoardElement title="Monthly To Date Usage" component={<ProgressBar percentage={92} />} />
      <DashBoardElement title="Total Monthly Quota" component={<Quota mq={500} mq_used={475} mq_remaining={50} />} />
      <DashBoardElement title="Day By Day Usage" component={<DTDUsage events={tenantEvents} />} />
      {!adminTenantData && <DashBoardElement title="Create Event" component={<CreateEvent tenant_id={1} />} />}
    </div>
  </>
}

