import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { History, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useHistoryStore, type HistoryEntry } from "@/stores/useHistoryStore"
import { useAnalysisStore } from "@/stores/useAnalysisStore"
import { useSystemStore } from "@/stores/useSystemStore"

export function HistoryPage() {
  const { entries, isLoading, error, load, remove } = useHistoryStore()
  const navigate = useNavigate()

  useEffect(() => {
    load()
  }, [load])

  const open = (entry: HistoryEntry) => {
    useSystemStore.getState().setArchitecture(entry.system)
    useSystemStore.getState().setInputMode("structured")
    useAnalysisStore.getState().setResult(entry.result)
    useAnalysisStore.getState().setStatus("complete")
    navigate("/analysis")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <History className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">History</h1>
          <p className="text-sm text-muted-foreground">Your previous threat analyses</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : entries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No analyses yet. Run one from the Input page and it will show up here.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <p className="truncate font-medium">{entry.system_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(entry.created_at).toLocaleString()} · {entry.threat_count} threats · risk {Math.round(entry.risk_score)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button size="sm" onClick={() => open(entry)}>
                    <ExternalLink className="mr-1.5 h-4 w-4" /> Open
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(entry.id)} aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
