import { useState, useEffect } from "react"
import { NavigationComponentType } from "@/Types/componentType"

export const Navigation: React.FC<NavigationComponentType> = ({ isAdmin = false }) => {

  useEffect(() => {

  }, [])
  const handleLogout = () => {
    console.log("Expire jwt token")
  }

  return <nav className="desktop-nav">
    <h1>{isAdmin ? "Admin Dashboard" : "Tenant Quota Dashboard"}</h1>
    <button onClick={handleLogout}>Log Out</button>
  </nav>
}