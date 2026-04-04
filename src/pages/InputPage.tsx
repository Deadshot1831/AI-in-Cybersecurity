import { useNavigate } from "react-router-dom"
import { Zap, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PageContainer } from "@/components/layout/PageContainer"
import { SystemInputForm } from "@/components/input/SystemInputForm"
import { useSystemStore } from "@/stores/useSystemStore"
import { useAnalysisStore } from "@/stores/useAnalysisStore"

export function InputPage() {
  const navigate = useNavigate()
  const { architecture, freeformText, inputMode, reset: resetSystem } = useSystemStore()
  const { reset: resetAnalysis, requestAnalysis } = useAnalysisStore()

  const canAnalyze =
    inputMode === "freeform"
      ? freeformText.trim().length > 20
      : architecture !== null && architecture.components.length > 0

  const handleAnalyze = () => {
    resetAnalysis()
    requestAnalysis()
    navigate("/analysis")
  }

  const handleReset = () => {
    resetSystem()
    resetAnalysis()
  }

  return (
    <PageContainer>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">System Architecture Input</CardTitle>
          <CardDescription>
            Define your LLM/GenAI system architecture for threat modeling. Use freeform
            natural language or build it step-by-step with the structured editor.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SystemInputForm />

          <div className="flex items-center gap-3 pt-4">
            <Button
              size="lg"
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className="gap-2"
            >
              <Zap className="h-4 w-4" /> Analyze Threats
            </Button>
            <Button variant="outline" size="lg" onClick={handleReset} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>

          {!canAnalyze && (
            <Alert>
              <AlertDescription>
                {inputMode === "freeform"
                  ? "Enter a description of your system (at least 20 characters) to start the analysis."
                  : "Add at least one component to your system architecture to start the analysis."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  )
}
