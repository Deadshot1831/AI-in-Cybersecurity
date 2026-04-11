import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAnalysisStore } from "@/stores/useAnalysisStore"
import { useSettingsStore } from "@/stores/useSettingsStore"

function getGrade(score: number): { letter: string; label: string; color: string; bgColor: string; glowClass: string } {
  if (score <= 20) return { letter: "A", label: "Well Protected", color: "text-green-500", bgColor: "bg-green-500", glowClass: "" }
  if (score <= 40) return { letter: "B", label: "Mostly Safe", color: "text-emerald-500", bgColor: "bg-emerald-500", glowClass: "" }
  if (score <= 60) return { letter: "C", label: "Needs Attention", color: "text-yellow-500", bgColor: "bg-yellow-500", glowClass: "animate-soc-glow-yellow" }
  if (score <= 80) return { letter: "D", label: "At Risk", color: "text-orange-500", bgColor: "bg-orange-500", glowClass: "animate-soc-glow-orange" }
  return { letter: "F", label: "Danger Zone", color: "text-red-500", bgColor: "bg-red-500", glowClass: "animate-soc-glow-red" }
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

function AnimatedGaugeSVG({ score }: { score: number }) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    let frame: number
    const start = performance.now()
    const duration = 1200
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedScore(Math.round(score * eased))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [score])

  const radius = 80
  const cx = 100
  const cy = 100
  const startAngle = -210
  const endAngle = 30
  const totalArc = endAngle - startAngle
  const scoreAngle = startAngle + (animatedScore / 100) * totalArc

  const toRad = (deg: number) => (deg * Math.PI) / 180
  const arcPath = (start: number, end: number, r: number) => {
    const x1 = cx + r * Math.cos(toRad(start))
    const y1 = cy + r * Math.sin(toRad(start))
    const x2 = cx + r * Math.cos(toRad(end))
    const y2 = cy + r * Math.sin(toRad(end))
    const largeArc = end - start > 180 ? 1 : 0
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`
  }

  const needleLen = 65
  const nx = cx + needleLen * Math.cos(toRad(scoreAngle))
  const ny = cy + needleLen * Math.sin(toRad(scoreAngle))

  const grade = getGrade(animatedScore)

  // Glow filter color based on score
  const glowColor = animatedScore > 75 ? "#ef4444" : animatedScore > 50 ? "#f97316" : animatedScore > 25 ? "#eab308" : "#22c55e"

  return (
    <svg viewBox="0 0 200 145" className="w-full max-w-[280px] mx-auto drop-shadow-lg">
      <defs>
        <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feFlood floodColor={glowColor} floodOpacity="0.4" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="needle-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feFlood floodColor={glowColor} floodOpacity="0.6" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background arc */}
      <path d={arcPath(startAngle, endAngle, radius)} fill="none" stroke="currentColor" strokeWidth="14" className="text-muted/20" strokeLinecap="round" />

      {/* Colored segments with glow */}
      <g filter="url(#gauge-glow)">
        <path d={arcPath(startAngle, startAngle + totalArc * 0.2, radius)} fill="none" stroke="#22c55e" strokeWidth="14" strokeLinecap="round" opacity="0.9" />
        <path d={arcPath(startAngle + totalArc * 0.2, startAngle + totalArc * 0.5, radius)} fill="none" stroke="#eab308" strokeWidth="14" opacity="0.9" />
        <path d={arcPath(startAngle + totalArc * 0.5, startAngle + totalArc * 0.75, radius)} fill="none" stroke="#f97316" strokeWidth="14" opacity="0.9" />
        <path d={arcPath(startAngle + totalArc * 0.75, endAngle, radius)} fill="none" stroke="#ef4444" strokeWidth="14" strokeLinecap="round" opacity="0.9" />
      </g>

      {/* Active score arc overlay */}
      <path
        d={arcPath(startAngle, scoreAngle, radius)}
        fill="none"
        stroke={glowColor}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.7"
        filter="url(#gauge-glow)"
      />

      {/* Animated needle with glow */}
      <g filter="url(#needle-glow)">
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={glowColor} strokeWidth="3" strokeLinecap="round" />
      </g>
      <circle cx={cx} cy={cy} r="6" fill={glowColor} opacity="0.9" />
      <circle cx={cx} cy={cy} r="3" className="fill-background" />

      {/* Score text */}
      <text x={cx} y={cy + 30} textAnchor="middle" className={`${grade.color} fill-current`} fontSize="28" fontWeight="bold">
        {animatedScore}
      </text>

      {/* Labels — aligned to arc endpoints */}
      <text x="31" y="143" textAnchor="middle" className="fill-green-500" fontSize="9" fontWeight="600" letterSpacing="1">SAFE</text>
      <text x="169" y="143" textAnchor="middle" className="fill-red-500" fontSize="9" fontWeight="600" letterSpacing="1">RISK</text>
    </svg>
  )
}

function CategoryBar({ label, score, color, glowColor }: { label: string; score: number; color: string; glowColor: string }) {
  const [animatedWidth, setAnimatedWidth] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedWidth(score), 100)
    return () => clearTimeout(timeout)
  }, [score])

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-mono font-semibold tabular-nums">{score}<span className="text-muted-foreground/60">/100</span></span>
      </div>
      <div className="h-3 rounded-full bg-muted/30 overflow-hidden relative">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{
            width: `${animatedWidth}%`,
            boxShadow: score > 50 ? `0 0 12px ${glowColor}` : "none",
          }}
        />
        {/* Scan line effect */}
        {score > 60 && (
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div
              className="absolute w-full h-px bg-white/30"
              style={{ animation: "soc-scan-line 2s linear infinite" }}
            />
          </div>
        )}
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
    <Card className={`glass overflow-hidden relative ${grade.glowClass}`}>
      {/* Subtle animated background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-10 ${grade.bgColor}`} />
        <div className={`absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-3xl opacity-5 ${grade.bgColor}`} />
      </div>

      <CardHeader className="pb-2 relative">
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${grade.bgColor} ${score > 50 ? "animate-pulse" : ""}`} />
            {plainEnglish ? "Security Health Score" : "Overall Risk Assessment"}
          </span>
          <Badge className={`${grade.bgColor} text-white text-lg px-3 py-0.5 font-bold shadow-lg`}>
            {grade.letter}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 relative">
        <AnimatedGaugeSVG score={score} />
        <p className={`text-center text-sm font-semibold ${grade.color}`}>{grade.label}</p>

        {plainEnglish && (
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            {score <= 30
              ? "Your system looks well-configured. Keep an eye on the recommendations below."
              : score <= 60
              ? "There are some issues that need your attention. Check the action plan below."
              : "Your system has significant security gaps. We strongly recommend addressing the urgent items."}
          </p>
        )}

        <div className="space-y-3 pt-2">
          <CategoryBar
            label={plainEnglish ? "Privacy & Data Safety" : "Information Disclosure Risk"}
            score={categories.privacy}
            color="bg-blue-500"
            glowColor="rgba(59, 130, 246, 0.5)"
          />
          <CategoryBar
            label={plainEnglish ? "Protection Against Hackers" : "Attack Surface Exposure"}
            score={categories.hacking}
            color="bg-red-500"
            glowColor="rgba(239, 68, 68, 0.5)"
          />
          <CategoryBar
            label={plainEnglish ? "Rule-Following & Reliability" : "Compliance & Availability Risk"}
            score={categories.ruleBreaking}
            color="bg-amber-500"
            glowColor="rgba(245, 158, 11, 0.5)"
          />
        </div>
      </CardContent>
    </Card>
  )
}
