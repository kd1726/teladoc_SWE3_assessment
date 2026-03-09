import { QUOTA_THRESHOLD } from "@/Config/constants"
import { QuotaComponentType } from "@/Types/componentType"

export const Quota: React.FC<QuotaComponentType> = ({ mq, mq_used, mq_remaining }) => {
  let shouldWarn = (mq_used / mq) > QUOTA_THRESHOLD / 100
  let isOver = mq_used >= mq

  return <main className="monthly-quota-section">
    <h1>Total Monthly Quota: {mq}</h1>
    <h1>Total Monthly Quota Used: {mq_used}</h1>
    <h1 style={shouldWarn ? { color: "#FFB300" } : {}}>
      Total Monthly Quota Remaining: {isOver ? `Over by ${mq_used - mq}` : mq_remaining}
    </h1>
  </main>
}