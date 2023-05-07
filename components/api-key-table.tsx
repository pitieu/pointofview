"use client"
import { trpc } from "@/lib/trpc"

export function ApiKeyTable() {
  const apiKeys = trpc.apiKey.getAPIKeys.useQuery({ name: "abc" })
  console.log(apiKeys.data)

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="border-b-2 border-slate-100 pb-2 text-left">Name</th>
          <th className="w-[100px] border-b-2 border-slate-100 pb-2 text-left">
            Key
          </th>
          <th className="w-[100px] border-b-2 border-slate-100 pb-2 text-left">
            Created
          </th>
          <th className="w-[100px] border-b-2 border-slate-100 pb-2 text-left"></th>
        </tr>
      </thead>
      {/* <tbody>
              {apiKeys.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center">
                    No API keys found.
                  </td>
                </tr>
              )}
              {apiKeys.map((key, index) => (
                <tr key={`key-${index}`}>
                  <td>{key.name}</td>
                  <td>{key.key}</td>
                  <td>{moment(key.createdAt).format("DD MMM YYYY")}</td>
                </tr>
              ))}
            </tbody> */}
    </table>
  )
}
