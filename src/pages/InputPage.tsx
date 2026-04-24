import { useNavigate } from "react-router-dom"
import { Zap, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PageContainer } from "@/components/layout/PageContainer"
import { SystemInputForm } from "@/components/input/SystemInputForm"
import { useSystemStore } from "@/stores/useSystemStore"
import { useAnalysisStore } from "@/stores/useAnalysisStore"
import { useSettingsStore } from "@/stores/useSettingsStore"
import { cn } from "@/lib/utils"

export function InputPage() {
  const navigate = useNavigate()
  const { architecture, freeformText, inputMode, reset: resetSystem } = useSystemStore()
  const { reset: resetAnalysis, requestAnalysis } = useAnalysisStore()
  const plainEnglish = useSettingsStore((s) => s.plainEnglish)

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
      <Card className="animate-fade-up">
        <CardHeader>
          <CardTitle className="text-2xl">
            {plainEnglish ? "Tell Us About Your AI System" : "System Architecture Input"}
          </CardTitle>
          <CardDescription>
            {plainEnglish
              ? "Describe your AI system so we can check it for security issues. Answer simple questions, write a description, or use the technical editor."
              : "Define your LLM/GenAI system architecture for threat modeling. Use freeform natural language or build it step-by-step with the structured editor."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SystemInputForm />

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-4">
            <Button
              size="lg"
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className={cn(
                "gap-2 w-full sm:w-auto",
                canAnalyze && "shimmer-host magnetic-glow"
              )}
            >
              <Zap className={cn("h-4 w-4", canAnalyze && "animate-pulse")} />
              {plainEnglish ? "Check for Problems" : "Analyze Threats"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleReset}
              className="gap-2 w-full sm:w-auto"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>

          {!canAnalyze && (
            <Alert>
              <AlertDescription>
                {inputMode === "freeform"
                  ? plainEnglish
                    ? "Write a short description of your AI system (at least a sentence) so we can check it."
                    : "Enter a description of your system (at least 20 characters) to start the analysis."
                  : plainEnglish
                  ? "Add at least one part of your AI system before we can check it."
                  : "Add at least one component to your system architecture to start the analysis."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  )
}
