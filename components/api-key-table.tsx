"use client"
import { trpc } from "@/lib/trpc"
import moment from "moment"
import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"

import { CreateApiKeyModal } from "./create-api-key-modal"
import { UpdateApiKeyModal } from "./update-api-key-modal"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "./ui/skeleton"

export function ApiKeyTable() {
  const {
    data: apiKeys = [],
    isLoading,
    refetch,
  } = trpc.apiKey.getAPIKeys.useQuery()
  const { toast } = useToast()

  const deleteApiKey = trpc.apiKey.deleteAPIKey.useMutation({
    onSuccess: () => {
      toast({
        title: "API key deleted",
      })
    },
    onError(error) {
      toast({
        variant: "destructive",
        title: "Failed to delete API key",
        // description: error.message,
      })
    },
    onSettled: async () => {
      refetch()
    },
  })

  return (
    <>
      <table className="min-w-[500px]">
        <thead>
          <tr>
            <th className="border-b-2 border-slate-100 pb-2 text-left text-sm">
              Name
            </th>
            <th className="w-[100px] border-b-2 border-slate-100 px-2 pb-2 text-left text-sm">
              Key
            </th>
            <th className="w-[150px] border-b-2 border-slate-100 px-2 pb-2 text-left text-sm">
              Created
            </th>
            <th className="w-[100px] border-b-2 border-slate-100 px-2 pb-2 text-left text-sm"></th>
          </tr>
        </thead>
        <tbody>
          {apiKeys.length === 0 && (
            <tr>
              {isLoading ? (
                <>
                  <td className="px-1">
                    <Skeleton className="m-2 h-3 w-full" />
                  </td>
                  <td className="px-1">
                    <Skeleton className="m-2 h-3 w-full" />
                  </td>
                  <td className="px-1">
                    <Skeleton className="m-2 h-3 w-full" />
                  </td>
                  <td className="px-1">
                    <Skeleton className="m-2 h-3 w-full" />
                  </td>
                </>
              ) : (
                <td colSpan={3} className="p-8 text-center">
                  No API keys found.
                </td>
              )}
            </tr>
          )}
          {apiKeys.map((key, index) => (
            <tr key={`key-${index}`}>
              <td className="px-2 text-sm">{key.name}</td>
              <td className="px-2 text-sm">{key.key}</td>
              <td className="px-2 text-sm">
                {moment(key.createdAt).format("DD MMM YYYY")}
              </td>
              <td>
                <UpdateApiKeyModal
                  defaultName={key.name}
                  apiKeyId={key.id}
                  refetch={refetch}
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-2"
                      disabled={deleteApiKey.isLoading}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogTitle>Revoke API key</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. Any applications using this
                      key will no longer be able to access the API.
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel asChild>
                        <Button variant="secondary">Cancel</Button>
                      </AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <Button
                          variant="destructive"
                          className="bg-red-500 hover:bg-red-700"
                          onClick={() =>
                            deleteApiKey.mutate({ apiKeyId: key.id })
                          }
                        >
                          Revoke key
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <CreateApiKeyModal refetch={refetch} />
    </>
  )
}
