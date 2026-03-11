import { QUOTA_THRESHOLD } from "@/Config/constants";
import { ProgressBarComponentType } from "@/Types/componentType"

export const ProgressBar: React.FC<ProgressBarComponentType> = ({ percentage }) => {
  const shoudlWarn = percentage > QUOTA_THRESHOLD
  let style = {
    width: `${percentage > 100 ? 100 : percentage}%`
  }
  return <main className="progress-bar">
    <section className={shoudlWarn ? "progress-bar-fill-danger" : "progress-bar-fill"} style={style}><p>{(percentage as number).toFixed(2)}%</p></section>
  </main>
}