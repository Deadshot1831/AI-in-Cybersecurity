import { useState } from "react"
import { CheckCircle2, Circle, Clock, CalendarDays, Zap, Printer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useAnalysisStore } from "@/stores/useAnalysisStore"
import { classifyQuickWins, type QuickWin } from "@/lib/plainEnglish"
import { SEVERITY_COLORS } from "@/types/threat"

const URGENCY_CONFIG = {
  "Fix today": { icon: Zap, color: "text-red-500", bg: "bg-red-500/10 border-red-500/20", emoji: "🔴" },
  "Fix this week": { icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20", emoji: "🟡" },
  "Plan for next month": { icon: CalendarDays, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20", emoji: "🔵" },
} as const

export function QuickWinsChecklist() {
  const result = useAnalysisStore((s) => s.result)
  const [checked, setChecked] = useState<Set<string>>(new Set())

  if (!result) return null

  const wins = classifyQuickWins(result.threats)
  const totalWins = wins.length
  const completedCount = checked.size
  const progressPct = totalWins > 0 ? Math.round((completedCount / totalWins) * 100) : 0

  const toggleCheck = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const grouped: Record<QuickWin["urgency"], QuickWin[]> = {
    "Fix today": [],
    "Fix this week": [],
    "Plan for next month": [],
  }
  for (const w of wins) grouped[w.urgency].push(w)

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return
    const html = `
      <html><head><title>Security Action Plan</title>
      <style>
        body { font-family: system-ui, sans-serif; max-width: 700px; margin: 40px auto; color: #1a1a1a; }
        h1 { font-size: 24px; }
        h2 { font-size: 18px; margin-top: 24px; }
        .item { padding: 8px 0; border-bottom: 1px solid #eee; }
        .item-title { font-weight: 600; }
        .item-desc { color: #666; font-size: 14px; }
        .checkbox { display: inline-block; width: 16px; height: 16px; border: 2px solid #999; border-radius: 3px; margin-right: 8px; vertical-align: middle; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; }
        .red { background: #fef2f2; color: #dc2626; }
        .orange { background: #fff7ed; color: #ea580c; }
        .blue { background: #eff6ff; color: #2563eb; }
        @media print { body { margin: 20px; } }
      </style></head><body>
      <h1>Security Action Plan</h1>
      <p>Generated ${new Date().toLocaleDateString()} | ${completedCount}/${totalWins} items addressed</p>
      ${(["Fix today", "Fix this week", "Plan for next month"] as const).map((urgency) => {
        const items = grouped[urgency]
        if (items.length === 0) return ""
        const badgeClass = urgency === "Fix today" ? "red" : urgency === "Fix this week" ? "orange" : "blue"
        return `<h2><span class="badge ${badgeClass}">${urgency}</span> (${items.length} items)</h2>
        ${items.map((w) => `<div class="item"><span class="checkbox"></span><span class="item-title">${w.title}</span> <span style="color:#888;font-size:13px">— ${w.threatTitle}</span><br><span class="item-desc">${w.description}</span></div>`).join("")}`
      }).join("")}
      </body></html>`
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Action Plan</CardTitle>
            <CardDescription>Prioritized fixes sorted by urgency and impact</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
            <Printer className="h-3.5 w-3.5" /> Print
          </Button>
        </div>
        <div className="space-y-1 pt-2">
          <div className="flex justify-between text-sm">
            <span>{completedCount} of {totalWins} completed</span>
            <span className="font-medium">{progressPct}%</span>
          </div>
          <Progress value={progressPct} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {(["Fix today", "Fix this week", "Plan for next month"] as const).map((urgency) => {
          const items = grouped[urgency]
          if (items.length === 0) return null
          const config = URGENCY_CONFIG[urgency]
          const Icon = config.icon

          return (
            <div key={urgency}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`h-4 w-4 ${config.color}`} />
                <span className={`text-sm font-semibold ${config.color}`}>
                  {config.emoji} {urgency}
                </span>
                <Badge variant="secondary" className="text-xs ml-auto">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </Badge>
              </div>
              <div className="space-y-2">
                {items.map((w) => {
                  const isDone = checked.has(w.mitigationId)
                  return (
                    <button
                      key={w.mitigationId}
                      onClick={() => toggleCheck(w.mitigationId)}
                      className={`w-full text-left rounded-lg border p-3 transition-colors ${
                        isDone
                          ? "bg-green-500/5 border-green-500/20 opacity-70"
                          : config.bg
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {isDone ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-sm font-medium ${isDone ? "line-through" : ""}`}>
                              {w.title}
                            </span>
                            <Badge variant="outline" className={`text-[11px] ${SEVERITY_COLORS[w.threatSeverity]}`}>
                              {w.impactLevel}
                            </Badge>
                            <Badge variant="secondary" className="text-[11px]">
                              {w.effortLabel}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{w.description}</p>
                          <p className="text-xs text-muted-foreground/60 mt-0.5 italic">
                            For: {w.threatTitle}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
              <Separator className="mt-4" />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
