import { AdminDashboardElementComponentType } from "@/Types/componentType";
import { JSX } from "react";

export default function AdminDashBoardElement({ title = "", component = <></>, version = 1 }: AdminDashboardElementComponentType): JSX.Element {
  return <main className={`admin-dashboard-tenant-element${version ? "-2" : ""}`}>
    <section className="title">
      <h2>{title}</h2>
    </section>
    <section className="component-container">
      {component}
    </section>
  </main>
}