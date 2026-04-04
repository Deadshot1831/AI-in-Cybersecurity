import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Boxes, ArrowRightLeft, ShieldCheck } from "lucide-react"
import { useSystemStore } from "@/stores/useSystemStore"
import { ComponentEditor } from "./ComponentEditor"
import { DataFlowEditor } from "./DataFlowEditor"
import { TrustBoundaryEditor } from "./TrustBoundaryEditor"

export function StructuredInput() {
  const { architecture, initArchitecture } = useSystemStore()
  const [systemName, setSystemName] = useState(architecture?.name ?? "")
  const [systemDescription, setSystemDescription] = useState(architecture?.description ?? "")
  const [openSections, setOpenSections] = useState({
    components: true,
    dataFlows: false,
    trustBoundaries: false,
  })

  const handleNameBlur = () => {
    if (systemName.trim() && !architecture) {
      initArchitecture(systemName.trim(), systemDescription.trim())
    } else if (architecture) {
      useSystemStore.setState({
        architecture: { ...architecture, name: systemName.trim(), description: systemDescription.trim() },
      })
    }
  }

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>System Name</Label>
          <Input
            placeholder="e.g., Customer Support Chatbot"
            value={systemName}
            onChange={(e) => setSystemName(e.target.value)}
            onBlur={handleNameBlur}
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Input
            placeholder="Brief system description"
            value={systemDescription}
            onChange={(e) => setSystemDescription(e.target.value)}
            onBlur={handleNameBlur}
          />
        </div>
      </div>

      <Separator />

      <Collapsible open={openSections.components} onOpenChange={() => toggleSection("components")}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between font-medium">
            <span className="flex items-center gap-2">
              <Boxes className="h-4 w-4" /> Components
              {architecture && (
                <span className="text-xs text-muted-foreground">
                  ({architecture.components.length})
                </span>
              )}
            </span>
            {openSections.components ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <ComponentEditor />
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      <Collapsible open={openSections.dataFlows} onOpenChange={() => toggleSection("dataFlows")}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between font-medium">
            <span className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4" /> Data Flows
              {architecture && (
                <span className="text-xs text-muted-foreground">
                  ({architecture.dataFlows.length})
                </span>
              )}
            </span>
            {openSections.dataFlows ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <DataFlowEditor />
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      <Collapsible open={openSections.trustBoundaries} onOpenChange={() => toggleSection("trustBoundaries")}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between font-medium">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Trust Boundaries
              {architecture && (
                <span className="text-xs text-muted-foreground">
                  ({architecture.trustBoundaries.length})
                </span>
              )}
            </span>
            {openSections.trustBoundaries ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <TrustBoundaryEditor />
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
