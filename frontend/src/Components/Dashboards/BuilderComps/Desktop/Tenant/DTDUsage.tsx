import { DTDUsageComponentType } from "@/Types/componentType"
import { UsageEventGetResponseType } from "@/Types/eventTypes"

export const DTDUsage: React.FC<DTDUsageComponentType> = ({ events }) => {

  return <main className="dtd-usage-section p-2">
    <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 font-medium text-gray-900 text-left">Type</th>
          <th className="px-4 py-2 font-medium text-gray-900 text-left">Token Cost</th>
          <th className="px-4 py-2 font-medium text-gray-900 text-left">Date Executed</th>
          <th className="px-4 py-2 font-medium text-gray-900 text-left">Prompt</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-200">
        {events?.length && events.length > 0 ?
          events.map((event: UsageEventGetResponseType, k: number) => {
            const { prompt_type, token_cost, timestamp, prompt } = event
            return <tr className="hover:bg-gray-50 transition-colors" key={k}>
              <td className="px-4 py-3 font-medium text-gray-900">{prompt_type}</td>
              <td className="px-4 py-3 text-gray-700">{token_cost}</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center rounded-md bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700 ring-1 ring-inset ring-violet-700/10">
                  {timestamp as string}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500 text-sm">{prompt}</td>
            </tr>
          }) :
          <tr>
            <td colSpan={4} className="px-4 py-8 text-center text-gray-500 italic">
              No data available
            </td>
          </tr>
        }
      </tbody>
    </table>
  </main>
}