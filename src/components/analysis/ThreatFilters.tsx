import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAnalysisStore } from "@/stores/useAnalysisStore"
import { useSystemStore } from "@/stores/useSystemStore"
import { useSettingsStore } from "@/stores/useSettingsStore"
import { FRAMEWORK_LABELS } from "@/lib/constants"
import { FRAMEWORK_PLAIN, SEVERITY_PLAIN } from "@/lib/plainEnglish"
import type { FrameworkType, Severity } from "@/types/threat"

const FRAMEWORKS: FrameworkType[] = ["owasp-llm", "stride", "mitre-atlas"]
const SEVERITIES: Severity[] = ["critical", "high", "medium", "low"]

const severityColors: Record<Severity, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
}

export function ThreatFilters() {
  const {
    activeFrameworks,
    activeSeverities,
    activeComponentIds,
    setActiveFrameworks,
    setActiveSeverities,
    setActiveComponentIds,
  } = useAnalysisStore()
  const architecture = useSystemStore((s) => s.architecture)
  const plainEnglish = useSettingsStore((s) => s.plainEnglish)

  const toggleFramework = (fw: FrameworkType) => {
    if (activeFrameworks.includes(fw)) {
      if (activeFrameworks.length > 1) {
        setActiveFrameworks(activeFrameworks.filter((f) => f !== fw))
      }
    } else {
      setActiveFrameworks([...activeFrameworks, fw])
    }
  }

  const toggleSeverity = (sev: Severity) => {
    if (activeSeverities.includes(sev)) {
      if (activeSeverities.length > 1) {
        setActiveSeverities(activeSeverities.filter((s) => s !== sev))
      }
    } else {
      setActiveSeverities([...activeSeverities, sev])
    }
  }

  const toggleComponent = (id: string) => {
    if (activeComponentIds.includes(id)) {
      setActiveComponentIds(activeComponentIds.filter((c) => c !== id))
    } else {
      setActiveComponentIds([...activeComponentIds, id])
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs font-semibold uppercase text-muted-foreground">
          {plainEnglish ? "Security Standards" : "Frameworks"}
        </Label>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {FRAMEWORKS.map((fw) => (
            <Badge
              key={fw}
              variant={activeFrameworks.includes(fw) ? "default" : "outline"}
              className="cursor-pointer text-xs"
              onClick={() => toggleFramework(fw)}
            >
              {plainEnglish ? FRAMEWORK_PLAIN[fw] : FRAMEWORK_LABELS[fw]}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <Label className="text-xs font-semibold uppercase text-muted-foreground">
          {plainEnglish ? "Urgency" : "Severity"}
        </Label>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {SEVERITIES.map((sev) => (
            <Badge
              key={sev}
              variant={activeSeverities.includes(sev) ? "default" : "outline"}
              className="cursor-pointer text-xs capitalize"
              onClick={() => toggleSeverity(sev)}
            >
              <div className={`h-2 w-2 rounded-full ${severityColors[sev]} mr-1.5`} />
              {plainEnglish ? SEVERITY_PLAIN[sev] : sev}
            </Badge>
          ))}
        </div>
      </div>

      {architecture && architecture.components.length > 0 && (
        <>
          <Separator />
          <div>
            <Label className="text-xs font-semibold uppercase text-muted-foreground">
              {plainEnglish ? "System Parts" : "Components"}
            </Label>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {architecture.components.map((c) => (
                <Badge
                  key={c.id}
                  variant={activeComponentIds.includes(c.id) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => toggleComponent(c.id)}
                >
                  {c.name}
                </Badge>
              ))}
            </div>
            {activeComponentIds.length > 0 && (
              <button
                className="text-xs text-muted-foreground underline mt-1"
                onClick={() => setActiveComponentIds([])}
              >
                Clear component filter
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
