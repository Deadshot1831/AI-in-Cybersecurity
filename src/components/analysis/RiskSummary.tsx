import { AlertTriangle, Shield, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAnalysisStore } from "@/stores/useAnalysisStore"
import { FRAMEWORK_LABELS } from "@/lib/constants"
import type { FrameworkType } from "@/types/threat"

export function RiskSummary() {
  const result = useAnalysisStore((s) => s.result)
  if (!result) return null

  const { riskScore, threats } = result
  const riskLevel =
    riskScore.overall >= 75 ? "Critical" :
    riskScore.overall >= 50 ? "High" :
    riskScore.overall >= 25 ? "Medium" : "Low"

  const riskColor =
    riskScore.overall >= 75 ? "text-red-500" :
    riskScore.overall >= 50 ? "text-orange-500" :
    riskScore.overall >= 25 ? "text-yellow-500" : "text-green-500"

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Shield className="h-4 w-4" /> Overall Risk Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold ${riskColor}`}>
              {riskScore.overall}
            </span>
            <span className="text-sm text-muted-foreground">/ 100</span>
            <Badge variant="outline" className={`ml-auto ${riskColor}`}>
              {riskLevel}
            </Badge>
          </div>
          <Progress value={riskScore.overall} className="mt-3" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Threats by Severity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-sm">Critical: {riskScore.bySeverity.critical}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-orange-500" />
              <span className="text-sm">High: {riskScore.bySeverity.high}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <span className="text-sm">Medium: {riskScore.bySeverity.medium}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-sm">Low: {riskScore.bySeverity.low}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {threats.length} total threats identified
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Framework Scores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(Object.entries(riskScore.byFramework) as [string, number][]).map(
              ([key, score]) => {
                const fwKey = key === "owasp" ? "owasp-llm" : key === "atlas" ? "mitre-atlas" : key
                return (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm">{FRAMEWORK_LABELS[fwKey as FrameworkType]}</span>
                    <span className="text-sm font-mono font-medium">{score}/100</span>
                  </div>
                )
              }
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
