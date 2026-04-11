import { Loader2, XCircle, RotateCcw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAnalysisStore } from "@/stores/useAnalysisStore"
import { useSettingsStore } from "@/stores/useSettingsStore"
import { ANALYSIS_STATUS_MESSAGES, ANALYSIS_STATUS_MESSAGES_PLAIN } from "@/lib/constants"
import { runThreatAnalysis } from "@/services/analysis/threatEngine"

export function AnalysisPanel() {
  const { status, progress, error, reset, requestAnalysis } = useAnalysisStore()
  const plainEnglish = useSettingsStore((s) => s.plainEnglish)

  if (status === "idle" || status === "complete") return null

  const isError = status === "error"
  const messages = plainEnglish ? ANALYSIS_STATUS_MESSAGES_PLAIN : ANALYSIS_STATUS_MESSAGES

  const handleRetry = () => {
    reset()
    requestAnalysis()
    runThreatAnalysis()
  }

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
            {messages[status]}
          </span>
        </div>
        {!isError && <Progress value={progress} className="h-2" />}
        {isError && (
          <div className="mt-2 space-y-3">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button variant="outline" size="sm" onClick={handleRetry} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              {plainEnglish ? "Try Again" : "Retry Analysis"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
