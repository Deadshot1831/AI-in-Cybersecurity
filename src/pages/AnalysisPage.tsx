import { useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, FileDown, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PageContainer } from "@/components/layout/PageContainer"
import { AnalysisPanel } from "@/components/analysis/AnalysisPanel"
import { RiskSummary } from "@/components/analysis/RiskSummary"
import { HealthScoreGauge } from "@/components/analysis/HealthScoreGauge"
import { QuickWinsChecklist } from "@/components/analysis/QuickWinsChecklist"
import { ThreatCard } from "@/components/analysis/ThreatCard"
import { ThreatFilters } from "@/components/analysis/ThreatFilters"
import { useAnalysisStore } from "@/stores/useAnalysisStore"
import { useSystemStore } from "@/stores/useSystemStore"
import { useSettingsStore } from "@/stores/useSettingsStore"
import { runThreatAnalysis } from "@/services/analysis/threatEngine"

export function AnalysisPage() {
  const navigate = useNavigate()
  const { status, result, getFilteredThreats, analysisRequested } = useAnalysisStore()
  const { architecture, freeformText, inputMode } = useSystemStore()
  const plainEnglish = useSettingsStore((s) => s.plainEnglish)

  const filteredThreats = getFilteredThreats()

  // Check if user has provided valid input
  const hasInput =
    inputMode === "freeform"
      ? freeformText.trim().length > 20
      : architecture !== null && architecture.components.length > 0

  const componentNames = useMemo(() => {
    const names: Record<string, string> = {}
    if (architecture) {
      architecture.components.forEach((c) => {
        names[c.id] = c.name
      })
    }
    return names
  }, [architecture])

  // Only run analysis if explicitly requested via the Input page AND there's valid input
  useEffect(() => {
    if (analysisRequested && hasInput && status === "idle") {
      runThreatAnalysis()
    }
  }, [analysisRequested, hasInput, status])

  // No input provided — show a prompt to go back
  if (!hasInput && !result) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20 gap-6">
          <ShieldAlert className="h-16 w-16 text-muted-foreground" />
          <div className="text-center max-w-md">
            <h2 className="text-xl font-semibold mb-2">
              {plainEnglish ? "Let's Get Started" : "No System Input Provided"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {plainEnglish
                ? "Tell us about your AI system first, and we'll check it for security issues. It only takes a few minutes!"
                : "You need to describe your LLM/GenAI system architecture before running a threat analysis. Go to the Input page to define your system."}
            </p>
          </div>
          <Button onClick={() => navigate("/input")} size="lg">
            {plainEnglish ? "Describe My System" : "Go to Input Page"}
          </Button>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {plainEnglish ? "Security Report" : "Threat Analysis"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {result
              ? plainEnglish
                ? `We found ${result.threats.length} potential issues to review`
                : `${result.threats.length} threats identified across ${result.frameworksCovered.length} frameworks`
              : plainEnglish
              ? "Checking your system..."
              : "Running analysis..."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/input")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> {plainEnglish ? "Edit System" : "Back to Input"}
          </Button>
          {status === "complete" && (
            <Button onClick={() => navigate("/export")} className="gap-2">
              <FileDown className="h-4 w-4" /> {plainEnglish ? "Download Report" : "Export Results"}
            </Button>
          )}
        </div>
      </div>

      <AnalysisPanel />

      {status === "complete" && result && (
        <div className="space-y-6">
          {/* Health Score Gauge + Risk Summary layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
            <HealthScoreGauge />
            <RiskSummary />
          </div>

          {result.executiveSummary && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {plainEnglish ? "Summary" : "Executive Summary"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {result.executiveSummary}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Quick Wins checklist (visible in both modes but especially useful in plain English) */}
          {plainEnglish && <QuickWinsChecklist />}

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-base">
                  {plainEnglish ? "Filter Issues" : "Filters"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ThreatFilters />
              </CardContent>
            </Card>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {plainEnglish
                    ? `Issues Found (${filteredThreats.length})`
                    : `Identified Threats (${filteredThreats.length})`}
                </h2>
                {!plainEnglish && result.threats.length > 0 && (
                  <QuickWinsButton />
                )}
              </div>
              <ScrollArea className="h-[calc(100vh-500px)] min-h-[400px]">
                <div className="space-y-3 pr-4">
                  {filteredThreats.map((threat) => (
                    <ThreatCard
                      key={threat.id}
                      threat={threat}
                      componentNames={componentNames}
                    />
                  ))}
                  {filteredThreats.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      {plainEnglish
                        ? "No issues match your current filters. Try changing the filters above."
                        : "No threats match the current filters. Try adjusting your filter criteria."}
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Quick Wins at the bottom in technical mode */}
          {!plainEnglish && <QuickWinsChecklist />}
        </div>
      )}
    </PageContainer>
  )
}

function QuickWinsButton() {
  return (
    <a href="#quick-wins" className="text-xs text-primary hover:underline">
      Jump to Action Plan
    </a>
  )
}
