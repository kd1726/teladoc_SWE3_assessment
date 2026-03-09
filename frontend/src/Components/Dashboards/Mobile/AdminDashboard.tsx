import { JSX, useEffect, useState } from "react"

export default function AdminDashboard(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    console.log("Check if token is valid and authentication. If not redirect back to homepage is so render this compoentn")
  })
  return <></>
}

