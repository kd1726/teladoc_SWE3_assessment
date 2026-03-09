import { JSX } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Components/Login/Mobile/Login";
import TenantDashboard from "./Components/Dashboards/Mobile/TenantDashboard";
import AdminDashboard from "./Components/Dashboards/Mobile/AdminDashboard";

export default function Mobile(): JSX.Element {
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