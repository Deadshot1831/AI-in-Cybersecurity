import { AlertTriangle, Shield, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAnalysisStore } from "@/stores/useAnalysisStore"
import { useSettingsStore } from "@/stores/useSettingsStore"
import { FRAMEWORK_LABELS } from "@/lib/constants"
import { FRAMEWORK_PLAIN } from "@/lib/plainEnglish"
import type { FrameworkType, Severity } from "@/types/threat"

const SEVERITY_LABELS_PLAIN: Record<Severity, string> = {
  critical: "Urgent",
  high: "Serious",
  medium: "Moderate",
  low: "Minor",
}

export function RiskSummary() {
  const result = useAnalysisStore((s) => s.result)
  const plainEnglish = useSettingsStore((s) => s.plainEnglish)
  if (!result) return null

  const { riskScore, threats } = result
  const riskLevel =
    riskScore.overall >= 75 ? "Critical" :
    riskScore.overall >= 50 ? "High" :
    riskScore.overall >= 25 ? "Medium" : "Low"

  const riskLevelPlain =
    riskScore.overall >= 75 ? "Needs Immediate Action" :
    riskScore.overall >= 50 ? "Needs Attention" :
    riskScore.overall >= 25 ? "Could Be Better" : "Looking Good"

  const riskColor =
    riskScore.overall >= 75 ? "text-red-500" :
    riskScore.overall >= 50 ? "text-orange-500" :
    riskScore.overall >= 25 ? "text-yellow-500" : "text-green-500"

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Shield className="h-4 w-4" /> {plainEnglish ? "Safety Score" : "Overall Risk Score"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold ${riskColor}`}>
              {riskScore.overall}
            </span>
            <span className="text-sm text-muted-foreground">/ 100</span>
            <Badge variant="outline" className={`ml-auto ${riskColor}`}>
              {plainEnglish ? riskLevelPlain : riskLevel}
            </Badge>
          </div>
          <Progress value={riskScore.overall} className="mt-3" />
          {plainEnglish && (
            <p className="text-xs text-muted-foreground mt-2">
              Higher score = more issues found. A score under 30 is good.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> {plainEnglish ? "Issues Found" : "Threats by Severity"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {(["critical", "high", "medium", "low"] as const).map((sev) => {
              const colors = {
                critical: "bg-red-500",
                high: "bg-orange-500",
                medium: "bg-yellow-500",
                low: "bg-green-500",
              }
              return (
                <div key={sev} className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${colors[sev]}`} />
                  <span className="text-sm">
                    {plainEnglish ? SEVERITY_LABELS_PLAIN[sev] : <span className="capitalize">{sev}</span>}: {riskScore.bySeverity[sev]}
                  </span>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {threats.length} total {plainEnglish ? "issues" : "threats"} identified
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> {plainEnglish ? "Areas Checked" : "Framework Scores"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(Object.entries(riskScore.byFramework) as [string, number][]).map(
              ([key, score]) => {
                const fwKey = key === "owasp" ? "owasp-llm" : key === "atlas" ? "mitre-atlas" : key
                return (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm">
                      {plainEnglish ? FRAMEWORK_PLAIN[fwKey] ?? fwKey : FRAMEWORK_LABELS[fwKey as FrameworkType]}
                    </span>
                    <span className="text-sm font-mono font-medium">{score}/100</span>
                  </div>
                )
              }
            )}
          </div>
          {plainEnglish && (
            <p className="text-xs text-muted-foreground mt-2">
              We checked your system against 3 different security standards.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
