import { ChevronDown, ChevronRight, Target, Zap, Shield } from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { FrameworkBadge } from "./FrameworkBadge"
import type { Threat } from "@/types/threat"
import { SEVERITY_COLORS, SEVERITY_BG_COLORS } from "@/types/threat"

interface ThreatCardProps {
  threat: Threat
  componentNames: Record<string, string>
}

export function ThreatCard({ threat, componentNames }: ThreatCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className={`border ${SEVERITY_BG_COLORS[threat.severity]}`}>
        <CollapsibleTrigger className="w-full text-left">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                {isOpen ? (
                  <ChevronDown className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronRight className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
                )}
                <div className="space-y-1.5">
                  <CardTitle className="text-sm font-medium">{threat.title}</CardTitle>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge
                      variant="outline"
                      className={`text-xs capitalize ${SEVERITY_COLORS[threat.severity]}`}
                    >
                      {threat.severity}
                    </Badge>
                    {threat.owaspMappings.map((m) => (
                      <FrameworkBadge key={m.id} framework="owasp-llm" className="text-xs" />
                    ))}
                    {threat.strideMappings.length > 0 && (
                      <FrameworkBadge framework="stride" className="text-xs" />
                    )}
                    {threat.atlasMappings.length > 0 && (
                      <FrameworkBadge framework="mitre-atlas" className="text-xs" />
                    )}
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs capitalize shrink-0">
                {threat.likelihood}
              </Badge>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            <p className="text-sm text-muted-foreground">{threat.description}</p>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex items-center gap-2 font-medium mb-1">
                  <Target className="h-4 w-4" /> Attack Vector
                </div>
                <p className="text-muted-foreground">{threat.attackVector}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 font-medium mb-1">
                  <Zap className="h-4 w-4" /> Impact
                </div>
                <p className="text-muted-foreground">{threat.impact}</p>
              </div>
            </div>

            <div>
              <span className="text-sm font-medium">Affected Components: </span>
              <span className="text-sm text-muted-foreground">
                {threat.affectedComponentIds
                  .map((id) => componentNames[id] ?? id)
                  .join(", ")}
              </span>
            </div>

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

            {threat.mitigations.length > 0 && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 font-medium mb-2 text-sm">
                    <Shield className="h-4 w-4" /> Mitigations
                  </div>
                  <div className="space-y-2">
                    {threat.mitigations.map((m) => (
                      <div key={m.id} className="rounded-md border p-3 text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{m.title}</span>
                          <div className="flex gap-1.5">
                            <Badge variant="outline" className={`text-xs capitalize ${SEVERITY_COLORS[m.priority]}`}>
                              {m.priority}
                            </Badge>
                            <Badge variant="secondary" className="text-xs capitalize">
                              {m.effort} effort
                            </Badge>
                          </div>
                        </div>
                        <p className="text-muted-foreground">{m.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
