import { DashboardElementComponentType } from "@/Types/componentType";
import { JSX } from "react";

export default function DashBoardElement({ title = "", component = <></> }: DashboardElementComponentType): JSX.Element {
  return <main className="dashboard-element">
    <section className="title">
      <h2>{title}</h2>
    </section>
    <section className="component-container">
      {component}
    </section>
  </main>
}