import { JSX, useEffect, useState } from "react"
import { AuthClient } from "@/Components/Clients/Auth/authClient"

export default function TenantDashboard(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    console.log("Check if token is valid and authentication. If not redirect back to homepage is so render this compoentn")
    console.log("if user is admin redirect to /dashboard/admin else /dashboard")

  }, [isAuthenticated])

  useEffect(() => {

  },)
  return <div className="mobile-dashboard">

  </div>
}

