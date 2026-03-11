import { useState, useEffect } from "react"
import { NavigationComponentType } from "@/Types/componentType"

export const Navigation: React.FC<NavigationComponentType> = ({ isAdmin = false }) => {


  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("tenantId")
    localStorage.removeItem("role")
    localStorage.removeItem("tokenType")
    window.location.replace("/")
  }

  return <nav className="desktop-nav">
    <h1>{isAdmin ? "Admin Dashboard" : "Tenant Quota Dashboard"}</h1>
    <button onClick={handleLogout}>Log Out</button>
  </nav>
}