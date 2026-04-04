import { Loader2, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAnalysisStore } from "@/stores/useAnalysisStore"
import { ANALYSIS_STATUS_MESSAGES } from "@/lib/constants"

export function AnalysisPanel() {
  const { status, progress, error } = useAnalysisStore()

  if (status === "idle" || status === "complete") return null

  const isError = status === "error"

  return (
    <Card className="mb-6">
      <CardContent className="py-6">
        <div className="flex items-center gap-3 mb-3">
          {isError ? (
            <XCircle className="h-5 w-5 text-destructive" />
          ) : (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          )}
          <span className="text-sm font-medium">
            {ANALYSIS_STATUS_MESSAGES[status]}
          </span>
        </div>
        {!isError && <Progress value={progress} className="h-2" />}
        {isError && error && (
          <p className="text-sm text-destructive mt-2">{error}</p>
        )}
      </CardContent>
    </Card>
  )
}
