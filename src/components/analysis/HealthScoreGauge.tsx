import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAnalysisStore } from "@/stores/useAnalysisStore"
import { useSettingsStore } from "@/stores/useSettingsStore"

function getGrade(score: number): { letter: string; label: string; color: string; bgColor: string } {
  if (score <= 20) return { letter: "A", label: "Well Protected", color: "text-green-500", bgColor: "bg-green-500" }
  if (score <= 40) return { letter: "B", label: "Mostly Safe", color: "text-emerald-500", bgColor: "bg-emerald-500" }
  if (score <= 60) return { letter: "C", label: "Needs Attention", color: "text-yellow-500", bgColor: "bg-yellow-500" }
  if (score <= 80) return { letter: "D", label: "At Risk", color: "text-orange-500", bgColor: "bg-orange-500" }
  return { letter: "F", label: "Danger Zone", color: "text-red-500", bgColor: "bg-red-500" }
}

function getCategoryScores(threats: { severity: string; owaspMappings: unknown[]; strideMappings: { category: string }[]; atlasMappings: unknown[] }[]) {
  let privacy = 0
  let hacking = 0
  let ruleBreaking = 0
  let maxPrivacy = 0
  let maxHacking = 0
  let maxRuleBreaking = 0

  for (const t of threats) {
    const weight = t.severity === "critical" ? 25 : t.severity === "high" ? 15 : t.severity === "medium" ? 8 : 3
    const hasPrivacy = t.strideMappings.some((s) => s.category === "information-disclosure") || t.owaspMappings.length > 0
    const hasHacking = t.strideMappings.some((s) =>
      ["tampering", "spoofing", "elevation-of-privilege"].includes(s.category)
    ) || t.atlasMappings.length > 0
    const hasRuleBreaking = t.strideMappings.some((s) =>
      ["repudiation", "denial-of-service"].includes(s.category)
    )

    if (hasPrivacy) { privacy += weight; maxPrivacy += 25 }
    if (hasHacking) { hacking += weight; maxHacking += 25 }
    if (hasRuleBreaking) { ruleBreaking += weight; maxRuleBreaking += 25 }
  }

  return {
    privacy: maxPrivacy > 0 ? Math.min(100, Math.round((privacy / maxPrivacy) * 100)) : 0,
    hacking: maxHacking > 0 ? Math.min(100, Math.round((hacking / maxHacking) * 100)) : 0,
    ruleBreaking: maxRuleBreaking > 0 ? Math.min(100, Math.round((ruleBreaking / maxRuleBreaking) * 100)) : 0,
  }
}

function GaugeSVG({ score }: { score: number }) {
  const radius = 80
  const cx = 100
  const cy = 100
  const startAngle = -210
  const endAngle = 30
  const totalArc = endAngle - startAngle // 240 degrees
  const scoreAngle = startAngle + (score / 100) * totalArc

  const toRad = (deg: number) => (deg * Math.PI) / 180
  const arcPath = (start: number, end: number, r: number) => {
    const x1 = cx + r * Math.cos(toRad(start))
    const y1 = cy + r * Math.sin(toRad(start))
    const x2 = cx + r * Math.cos(toRad(end))
    const y2 = cy + r * Math.sin(toRad(end))
    const largeArc = end - start > 180 ? 1 : 0
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`
  }

  // Needle endpoint
  const needleLen = 65
  const nx = cx + needleLen * Math.cos(toRad(scoreAngle))
  const ny = cy + needleLen * Math.sin(toRad(scoreAngle))

  const grade = getGrade(score)

  return (
    <svg viewBox="0 0 200 140" className="w-full max-w-[260px] mx-auto">
      {/* Background arc */}
      <path d={arcPath(startAngle, endAngle, radius)} fill="none" stroke="currentColor" strokeWidth="12" className="text-muted/30" strokeLinecap="round" />
      {/* Green zone */}
      <path d={arcPath(startAngle, startAngle + totalArc * 0.2, radius)} fill="none" stroke="#22c55e" strokeWidth="12" strokeLinecap="round" opacity="0.8" />
      {/* Yellow zone */}
      <path d={arcPath(startAngle + totalArc * 0.2, startAngle + totalArc * 0.5, radius)} fill="none" stroke="#eab308" strokeWidth="12" opacity="0.8" />
      {/* Orange zone */}
      <path d={arcPath(startAngle + totalArc * 0.5, startAngle + totalArc * 0.75, radius)} fill="none" stroke="#f97316" strokeWidth="12" opacity="0.8" />
      {/* Red zone */}
      <path d={arcPath(startAngle + totalArc * 0.75, endAngle, radius)} fill="none" stroke="#ef4444" strokeWidth="12" strokeLinecap="round" opacity="0.8" />
      {/* Needle */}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="currentColor" strokeWidth="2.5" className="text-foreground" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="5" className="fill-foreground" />
      {/* Score text */}
      <text x={cx} y={cy + 28} textAnchor="middle" className={`${grade.color} fill-current`} fontSize="26" fontWeight="bold">
        {score}
      </text>
      {/* Labels */}
      <text x="20" y="135" textAnchor="start" className="fill-green-500" fontSize="9" fontWeight="500">Safe</text>
      <text x="180" y="135" textAnchor="end" className="fill-red-500" fontSize="9" fontWeight="500">Risky</text>
    </svg>
  )
}

function CategoryBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{score}/100</span>
      </div>
      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

export function HealthScoreGauge() {
  const result = useAnalysisStore((s) => s.result)
  const plainEnglish = useSettingsStore((s) => s.plainEnglish)
  if (!result) return null

  const score = result.riskScore.overall
  const grade = getGrade(score)
  const categories = getCategoryScores(result.threats)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          {plainEnglish ? "Security Health Score" : "Overall Risk Assessment"}
          <Badge className={`${grade.bgColor} text-white text-lg px-3 py-0.5`}>
            {grade.letter}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <GaugeSVG score={score} />
        <p className={`text-center text-sm font-medium ${grade.color}`}>{grade.label}</p>

        {plainEnglish && (
          <p className="text-xs text-muted-foreground text-center">
            {score <= 30
              ? "Your system looks well-configured. Keep an eye on the recommendations below."
              : score <= 60
              ? "There are some issues that need your attention. Check the action plan below."
              : "Your system has significant security gaps. We strongly recommend addressing the urgent items."}
          </p>
        )}

        <div className="space-y-3 pt-2">
          <CategoryBar
            label={plainEnglish ? "🔒 Privacy & Data Safety" : "Information Disclosure Risk"}
            score={categories.privacy}
            color="bg-blue-500"
          />
          <CategoryBar
            label={plainEnglish ? "🛡️ Protection Against Hackers" : "Attack Surface Exposure"}
            score={categories.hacking}
            color="bg-red-500"
          />
          <CategoryBar
            label={plainEnglish ? "📋 Rule-Following & Reliability" : "Compliance & Availability Risk"}
            score={categories.ruleBreaking}
            color="bg-amber-500"
          />
        </div>
      </CardContent>
    </Card>
  )
}
