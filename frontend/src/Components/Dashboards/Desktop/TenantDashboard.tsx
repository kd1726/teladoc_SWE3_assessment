import { JSX, useEffect, useState } from "react"
import { AuthClient } from "@/Components/Clients/Auth/authClient"
import DashBoardElement from "@/Components/General/DashboardElements/Desktop/DashboardElement"
import { TenantDataResponse } from "@/Types/tenantTypes"
import { CreateEvent } from "../BuilderComps/Desktop/Tenant/CreateEvent"
import { ProgressBar } from "../BuilderComps/Desktop/Tenant/ProgressBar"
import { Quota } from "../BuilderComps/Desktop/Tenant/Quota"
import { DTDUsage } from "../BuilderComps/Desktop/Tenant/DTDUsage"
import { UsageEventGetResponseType } from "@/Types/eventTypes"
import { Navigation } from "@/Components/General/Navigation/Desktop/Navigation"
import { TenantDashboardComponentType } from "@/Types/componentType"
import { getOneTenent } from "@/Components/Clients/Tenants/tenantClient"

export default function TenantDashboard({ adminTenantData = null }: TenantDashboardComponentType): JSX.Element {
  const [tenantData, setTenantData] = useState<TenantDataResponse>();
  const [tenantEvents, setTenantEvents] = useState<Array<UsageEventGetResponseType>>()

  let token = localStorage.getItem("accessToken")
  let id = localStorage.getItem("tenantId")

  useEffect(() => {
    let isValid = token !== null && token !== undefined && id

    isValid ? adminTenantData ? setTenantData(adminTenantData) :
      getOneTenent(id as string).then((res) => {
        if (res.status == 200) {
          setTenantData(res.data)
        }
      }).catch((ers) => {
        if (ers.status == 401) {
          window.location.replace("/")
        }
        console.error(ers)
      }) :
      window.location.replace("/")
  }, [adminTenantData])

  useEffect(() => {
    tenantData?.events &&
      tenantData.events.length > 0 &&
      setTenantEvents(tenantData.events)
  }, [tenantData])

  return <>
    {!adminTenantData && <Navigation />}
    {tenantData ? <div className="desktop-dashboard">
      <DashBoardElement title="Monthly To Date Usage" component={<ProgressBar percentage={(tenantData.month_to_date_usage / tenantData.monthly_quota) * 100} />} />
      <DashBoardElement title="Total Monthly Quota" component={<Quota mq={tenantData.monthly_quota} mq_used={tenantData.month_to_date_usage} mq_remaining={tenantData.remaining_quota} />} />
      <DashBoardElement title="Day By Day Usage" component={<DTDUsage events={tenantEvents} />} />
      {!adminTenantData && <DashBoardElement title="Create Event" component={<CreateEvent tenant_id={id} mq={tenantData.monthly_quota} mtq={tenantData.month_to_date_usage} />} />}
    </div> : <></>}
  </>
}

