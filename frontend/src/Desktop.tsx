import { BrowserRouter, Routes, Route } from "react-router-dom"
import { JSX } from "react"
import Login from "./Components/Login/Desktop/Login"
import TenantDashboard from "./Components/Dashboards/Desktop/TenantDashboard"
import AdminDashboard from "./Components/Dashboards/Desktop/AdminDashboard"
import { Navigation } from "./Components/General/Navigation/Desktop/Navigation"
export default function Desktop(): JSX.Element {

  return <div className="base-container">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<TenantDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  </div>
}