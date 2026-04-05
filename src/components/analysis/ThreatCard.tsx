import { useState } from "react"
import { Target, Zap, Shield, BookOpen, AlertCircle, DollarSign, ChevronDown, RotateCcw, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { FrameworkBadge } from "./FrameworkBadge"
import type { Threat, Severity } from "@/types/threat"
import { SEVERITY_COLORS } from "@/types/threat"
import { useSettingsStore } from "@/stores/useSettingsStore"
import {
  SEVERITY_PLAIN,
  LIKELIHOOD_PLAIN,
  STRIDE_PLAIN,
  EFFORT_PLAIN,
  getStoryScenario,
  getBusinessImpacts,
} from "@/lib/plainEnglish"

interface ThreatCardProps {
  threat: Threat
  componentNames: Record<string, string>
}

const SEVERITY_GLOW: Record<Severity, string> = {
  critical: "animate-soc-glow-red",
  high: "animate-soc-glow-orange",
  medium: "",
  low: "",
}

const SEVERITY_ACCENT: Record<Severity, { border: string; bg: string; indicator: string; stripe: string }> = {
  critical: {
    border: "border-red-500/40",
    bg: "bg-red-500/5",
    indicator: "bg-red-500",
    stripe: "from-red-500/20 via-red-500/5 to-transparent",
  },
  high: {
    border: "border-orange-500/30",
    bg: "bg-orange-500/5",
    indicator: "bg-orange-500",
    stripe: "from-orange-500/15 via-orange-500/3 to-transparent",
  },
  medium: {
    border: "border-yellow-500/20",
    bg: "bg-yellow-500/5",
    indicator: "bg-yellow-500",
    stripe: "from-yellow-500/10 via-yellow-500/2 to-transparent",
  },
  low: {
    border: "border-green-500/20",
    bg: "bg-green-500/5",
    indicator: "bg-green-500",
    stripe: "from-green-500/10 via-green-500/2 to-transparent",
  },
}

export function ThreatCard({ threat, componentNames }: ThreatCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showMitigations, setShowMitigations] = useState(false)
  const plainEnglish = useSettingsStore((s) => s.plainEnglish)

  const storyScenario = getStoryScenario(threat)
  const businessImpacts = getBusinessImpacts(threat)
  const accent = SEVERITY_ACCENT[threat.severity]
  const isCritical = threat.severity === "critical"
  const isHighSeverity = threat.severity === "critical" || threat.severity === "high"

  return (
    <Card className={`overflow-hidden relative transition-all duration-300 ${accent.border} ${accent.bg} ${SEVERITY_GLOW[threat.severity]} ${
      isOpen ? "shadow-lg" : "hover:shadow-md"
    }`}>
      {/* Severity stripe on left edge */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accent.indicator}`} />

      {/* Top gradient accent */}
      <div className={`absolute top-0 left-0 right-0 h-16 bg-gradient-to-b ${accent.stripe} pointer-events-none`} />

      {/* Card Header - Clickable */}
      <button
        className="w-full text-left relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardHeader className="pb-3 pl-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              {/* Severity indicator dot */}
              <div className="mt-1 shrink-0">
                <div className={`h-3 w-3 rounded-full ${accent.indicator} ${
                  isCritical ? "animate-pulse shadow-lg shadow-red-500/50" : ""
                }`} />
              </div>
              <div className="space-y-2 flex-1">
                <CardTitle className="text-sm font-semibold leading-snug">{threat.title}</CardTitle>
                <div className="flex flex-wrap gap-1.5">
                  <Badge
                    variant="outline"
                    className={`text-xs font-semibold capitalize ${SEVERITY_COLORS[threat.severity]} ${
                      isCritical ? "animate-severity-pulse" : ""
                    }`}
                  >
                    {plainEnglish ? SEVERITY_PLAIN[threat.severity] : threat.severity}
                  </Badge>
                  {!plainEnglish && (
                    <>
                      {threat.owaspMappings.map((m) => (
                        <FrameworkBadge key={m.id} framework="owasp-llm" className="text-xs" />
                      ))}
                      {threat.strideMappings.length > 0 && (
                        <FrameworkBadge framework="stride" className="text-xs" />
                      )}
                      {threat.atlasMappings.length > 0 && (
                        <FrameworkBadge framework="mitre-atlas" className="text-xs" />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="secondary" className="text-xs capitalize">
                {plainEnglish ? LIKELIHOOD_PLAIN[threat.likelihood] : threat.likelihood}
              </Badge>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`} />
            </div>
          </div>
        </CardHeader>
      </button>

      {/* Expandable Content with animation */}
      {isOpen && (
        <CardContent className="pt-0 space-y-4 pl-5 animate-threat-flip-in">
          {/* Plain English: Story Scenario */}
          {plainEnglish && (
            <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4 glass">
              <div className="flex items-center gap-2 font-medium mb-2 text-sm text-blue-400">
                <BookOpen className="h-4 w-4" /> What Could Go Wrong?
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{storyScenario}</p>
            </div>
          )}

          <p className="text-sm text-muted-foreground">{threat.description}</p>

          <Separator className="opacity-30" />

          {/* Attack Vector & Impact - visual grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border p-3 space-y-1.5">
              <div className="flex items-center gap-2 font-medium text-sm">
                <Target className={`h-4 w-4 ${isHighSeverity ? "text-red-400" : "text-muted-foreground"}`} />
                {plainEnglish ? "How It Happens" : "Attack Vector"}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{threat.attackVector}</p>
            </div>
            <div className="rounded-lg border p-3 space-y-1.5">
              <div className="flex items-center gap-2 font-medium text-sm">
                <Zap className={`h-4 w-4 ${isHighSeverity ? "text-orange-400" : "text-muted-foreground"}`} />
                {plainEnglish ? "What's at Stake" : "Impact"}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{threat.impact}</p>
            </div>
          </div>

          <div>
            <span className="text-sm font-medium">{plainEnglish ? "Parts Affected: " : "Affected Components: "}</span>
            <span className="text-sm text-muted-foreground">
              {threat.affectedComponentIds
                .map((id) => componentNames[id] ?? id)
                .join(", ")}
            </span>
          </div>

          {/* Cost of Doing Nothing - plain English */}
          {plainEnglish && (
            <>
              <Separator className="opacity-30" />
              <div>
                <div className="flex items-center gap-2 font-medium mb-3 text-sm">
                  <AlertCircle className="h-4 w-4 text-orange-500" /> Cost of Doing Nothing
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {businessImpacts.map((impact, i) => (
                    <div
                      key={i}
                      className={`rounded-lg border p-3 text-sm transition-all ${
                        impact.severity === "high"
                          ? "border-red-500/30 bg-red-500/5"
                          : "border-yellow-500/30 bg-yellow-500/5"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="h-3.5 w-3.5" />
                        <span className="font-medium text-xs">{impact.category}</span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ml-auto ${
                            impact.severity === "high" ? "text-red-500" : "text-yellow-500"
                          }`}
                        >
                          {impact.severity === "high" ? "High risk" : "Moderate risk"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{impact.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Framework Mappings - technical mode */}
          {!plainEnglish && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Framework Mappings:</span>
              <div className="space-y-1 text-sm">
                {threat.owaspMappings.map((m) => (
                  <div key={m.id} className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-blue-500 font-mono text-xs">{m.id}</span>
                    {m.name} ({m.relevance}% match)
                  </div>
                ))}
                {threat.strideMappings.map((m) => (
                  <div key={m.category} className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-purple-500 font-mono text-xs">STRIDE</span>
                    <span className="capitalize">{m.category.replace(/-/g, " ")}</span>
                    ({m.relevance}% match)
                  </div>
                ))}
                {threat.atlasMappings.map((m) => (
                  <div key={m.tacticId} className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-red-500 font-mono text-xs">{m.techniqueId ?? m.tacticId}</span>
                    {m.techniqueName ?? m.tacticName} ({m.relevance}% match)
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Plain English STRIDE */}
          {plainEnglish && threat.strideMappings.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Type of Threat:</span>
              <div className="space-y-1">
                {threat.strideMappings.map((m) => (
                  <div key={m.category} className="text-sm text-muted-foreground">
                    {STRIDE_PLAIN[m.category] ?? m.category}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mitigations - Flip/Reveal interaction */}
          {threat.mitigations.length > 0 && (
            <>
              <Separator className="opacity-30" />

              {!showMitigations ? (
                <Button
                  variant="outline"
                  className="w-full gap-2 h-12 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all"
                  onClick={() => setShowMitigations(true)}
                >
                  <Eye className="h-4 w-4" />
                  {plainEnglish
                    ? `Reveal ${threat.mitigations.length} Fix${threat.mitigations.length > 1 ? "es" : ""}`
                    : `Show ${threat.mitigations.length} Mitigation${threat.mitigations.length > 1 ? "s" : ""}`}
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-medium text-sm">
                      <Shield className="h-4 w-4 text-green-500" />
                      {plainEnglish ? "How to Fix It" : "Mitigations"}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1 text-muted-foreground"
                      onClick={() => setShowMitigations(false)}
                    >
                      <RotateCcw className="h-3 w-3" /> Hide
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {threat.mitigations.map((m, i) => (
                      <div
                        key={m.id}
                        className="rounded-lg border p-3 text-sm glass animate-threat-flip-in"
                        style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className={`h-1.5 w-1.5 rounded-full ${
                              m.priority === "critical" ? "bg-red-500" :
                              m.priority === "high" ? "bg-orange-500" :
                              m.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                            }`} />
                            <span className="font-semibold">{m.title}</span>
                          </div>
                          <div className="flex gap-1.5">
                            <Badge variant="outline" className={`text-xs capitalize ${SEVERITY_COLORS[m.priority]}`}>
                              {plainEnglish ? SEVERITY_PLAIN[m.priority] : m.priority}
                            </Badge>
                            <Badge variant="secondary" className="text-xs capitalize">
                              {plainEnglish ? EFFORT_PLAIN[m.effort] : `${m.effort} effort`}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{m.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      )}
    </Card>
  )
}
