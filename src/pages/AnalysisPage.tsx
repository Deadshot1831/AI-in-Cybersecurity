import { useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, FileDown, ShieldAlert, Shield, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
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

  useEffect(() => {
    if (analysisRequested && hasInput && status === "idle") {
      runThreatAnalysis()
    }
  }, [analysisRequested, hasInput, status])

  if (!hasInput && !result) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20 gap-6">
          <div className="relative">
            <ShieldAlert className="h-16 w-16 text-muted-foreground" />
            <div className="absolute -inset-4 rounded-full border border-muted-foreground/10 animate-pulse" />
          </div>
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
      {/* SOC-style header bar */}
      <div className="glass rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="h-6 w-6 text-primary" />
              {status === "complete" && result && (
                <div className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${
                  result.riskScore.overall >= 75 ? "bg-red-500 animate-pulse" :
                  result.riskScore.overall >= 50 ? "bg-orange-500" :
                  "bg-green-500"
                }`} />
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                {plainEnglish ? "Security Report" : "Threat Analysis"}
                {status === "complete" && (
                  <Badge variant="outline" className="text-xs font-normal gap-1">
                    <Activity className="h-3 w-3" /> Live
                  </Badge>
                )}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {result
                  ? plainEnglish
                    ? `We found ${result.threats.length} potential issues to review`
                    : `${result.threats.length} threats identified across ${result.frameworksCovered.length} frameworks`
                  : plainEnglish
                  ? "Checking your system..."
                  : "Running analysis..."}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/input")} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> {plainEnglish ? "Edit" : "Input"}
            </Button>
            {status === "complete" && (
              <Button size="sm" onClick={() => navigate("/export")} className="gap-2">
                <FileDown className="h-4 w-4" /> {plainEnglish ? "Download" : "Export"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <AnalysisPanel />

      {status === "complete" && result && (
        <div className="space-y-6">
          {/* Health Score Gauge + Risk Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
            <HealthScoreGauge />
            <RiskSummary />
          </div>

          {result.executiveSummary && (
            <Card className="glass overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
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

          {plainEnglish && <QuickWinsChecklist />}

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            <Card className="h-fit glass">
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
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  {plainEnglish
                    ? `Issues Found`
                    : `Identified Threats`}
                  <Badge variant="secondary" className="text-xs tabular-nums">
                    {filteredThreats.length}
                  </Badge>
                </h2>
                {!plainEnglish && result.threats.length > 0 && (
                  <QuickWinsButton />
                )}
              </div>
              <ScrollArea className="h-[calc(100vh-500px)] min-h-[400px]">
                <div className="space-y-3 pr-4">
                  {filteredThreats.map((threat, i) => (
                    <div
                      key={threat.id}
                      className="animate-soc-count-up"
                      style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
                    >
                      <ThreatCard
                        threat={threat}
                        componentNames={componentNames}
                      />
                    </div>
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

          {!plainEnglish && <QuickWinsChecklist />}
        </div>
      )}
    </PageContainer>
  )
}

function QuickWinsButton() {
  return (
    <a href="#quick-wins" className="text-xs text-primary hover:underline flex items-center gap-1">
      <Activity className="h-3 w-3" />
      Jump to Action Plan
    </a>
  )
}
