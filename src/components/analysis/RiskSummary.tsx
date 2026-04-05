import { useEffect, useState } from "react"
import { AlertTriangle, Shield, TrendingUp, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

function AnimatedNumber({ value, duration = 800 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let frame: number
    const start = performance.now()
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(value * eased))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [value, duration])
  return <>{display}</>
}

const SEVERITY_CONFIG: Record<Severity, { bg: string; glow: string; ring: string }> = {
  critical: { bg: "bg-red-500", glow: "shadow-red-500/50", ring: "ring-red-500/30" },
  high: { bg: "bg-orange-500", glow: "shadow-orange-500/50", ring: "ring-orange-500/30" },
  medium: { bg: "bg-yellow-500", glow: "shadow-yellow-500/50", ring: "ring-yellow-500/30" },
  low: { bg: "bg-green-500", glow: "shadow-green-500/50", ring: "ring-green-500/30" },
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

  const riskGlowClass =
    riskScore.overall >= 75 ? "animate-soc-glow-red" :
    riskScore.overall >= 50 ? "animate-soc-glow-orange" :
    riskScore.overall >= 25 ? "animate-soc-glow-yellow" : ""

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Overall Risk Score Card */}
      <Card className={`glass overflow-hidden relative ${riskGlowClass}`}>
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-10 ${
            riskScore.overall >= 50 ? "bg-red-500" : "bg-green-500"
          }`} />
        </div>
        <CardHeader className="pb-2 relative">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {plainEnglish ? "Safety Score" : "Overall Risk Score"}
            <Activity className={`h-3 w-3 ml-auto ${riskColor} ${riskScore.overall > 50 ? "animate-pulse" : ""}`} />
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-bold tabular-nums ${riskColor} animate-soc-count-up`}>
              <AnimatedNumber value={riskScore.overall} />
            </span>
            <span className="text-sm text-muted-foreground/60">/ 100</span>
          </div>
          <Badge variant="outline" className={`mt-2 ${riskColor} font-semibold`}>
            {plainEnglish ? riskLevelPlain : riskLevel}
          </Badge>
          {/* Mini bar */}
          <div className="mt-3 h-2 rounded-full bg-muted/30 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                riskScore.overall >= 75 ? "bg-red-500" :
                riskScore.overall >= 50 ? "bg-orange-500" :
                riskScore.overall >= 25 ? "bg-yellow-500" : "bg-green-500"
              }`}
              style={{
                width: `${riskScore.overall}%`,
                boxShadow: riskScore.overall > 50
                  ? `0 0 10px ${riskScore.overall >= 75 ? "rgba(239,68,68,0.5)" : "rgba(249,115,22,0.5)"}`
                  : "none",
              }}
            />
          </div>
          {plainEnglish && (
            <p className="text-xs text-muted-foreground mt-2">
              Higher score = more issues found. Under 30 is good.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Threats by Severity Card */}
      <Card className="glass overflow-hidden relative">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> {plainEnglish ? "Issues Found" : "Threats by Severity"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {(["critical", "high", "medium", "low"] as const).map((sev) => {
              const config = SEVERITY_CONFIG[sev]
              const count = riskScore.bySeverity[sev]
              const isCritical = sev === "critical" && count > 0
              return (
                <div
                  key={sev}
                  className={`rounded-lg border p-2.5 transition-all ${
                    count > 0 ? `ring-1 ${config.ring}` : "opacity-60"
                  } ${isCritical ? "animate-soc-glow-red" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${config.bg} ${
                      isCritical ? "animate-pulse shadow-lg " + config.glow : ""
                    }`} />
                    <span className="text-xs font-medium capitalize">
                      {plainEnglish ? SEVERITY_LABELS_PLAIN[sev] : sev}
                    </span>
                  </div>
                  <span className="text-2xl font-bold tabular-nums block mt-1 animate-soc-count-up">
                    <AnimatedNumber value={count} duration={600} />
                  </span>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
            <Activity className="h-3 w-3" />
            {threats.length} total {plainEnglish ? "issues" : "threats"} identified
          </p>
        </CardContent>
      </Card>

      {/* Framework Scores Card */}
      <Card className="glass overflow-hidden relative">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> {plainEnglish ? "Areas Checked" : "Framework Scores"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(Object.entries(riskScore.byFramework) as [string, number][]).map(
              ([key, score]) => {
                const fwKey = key === "owasp" ? "owasp-llm" : key === "atlas" ? "mitre-atlas" : key
                const barColor =
                  score >= 75 ? "bg-red-500" :
                  score >= 50 ? "bg-orange-500" :
                  score >= 25 ? "bg-yellow-500" : "bg-green-500"
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {plainEnglish ? FRAMEWORK_PLAIN[fwKey] ?? fwKey : FRAMEWORK_LABELS[fwKey as FrameworkType]}
                      </span>
                      <span className="text-sm font-mono font-bold tabular-nums">
                        <AnimatedNumber value={score} duration={900} /><span className="text-muted-foreground/60">/100</span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                )
              }
            )}
          </div>
          {plainEnglish && (
            <p className="text-xs text-muted-foreground mt-3">
              We checked your system against 3 different security standards.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
