import { useState } from "react"
import { Plus, Trash2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSystemStore } from "@/stores/useSystemStore"

export function DataFlowEditor() {
  const { architecture, addDataFlow, removeDataFlow } = useSystemStore()
  const [sourceId, setSourceId] = useState("")
  const [targetId, setTargetId] = useState("")
  const [label, setLabel] = useState("")
  const [dataType, setDataType] = useState("")
  const [isEncrypted, setIsEncrypted] = useState(true)
  const [protocol, setProtocol] = useState("")

  const components = architecture?.components ?? []
  const dataFlows = architecture?.dataFlows ?? []

  const handleAdd = () => {
    if (!sourceId || !targetId || !label.trim()) return
    addDataFlow({
      id: crypto.randomUUID(),
      sourceId,
      targetId,
      label: label.trim(),
      dataType: dataType.trim() || "general",
      isEncrypted,
      protocol: protocol.trim() || undefined,
    })
    setLabel("")
    setDataType("")
    setProtocol("")
  }

  const getComponentName = (id: string) =>
    components.find((c) => c.id === id)?.name ?? "Unknown"

  if (components.length < 2) {
    return (
      <p className="text-sm text-muted-foreground">
        Add at least 2 components before defining data flows.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Source Component</Label>
          <Select value={sourceId} onValueChange={setSourceId}>
            <SelectTrigger>
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              {components.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Target Component</Label>
          <Select value={targetId} onValueChange={setTargetId}>
            <SelectTrigger>
              <SelectValue placeholder="Select target" />
            </SelectTrigger>
            <SelectContent>
              {components.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Flow Label</Label>
          <Input
            placeholder="e.g., User query, Embedding vector"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Data Type</Label>
          <Input
            placeholder="e.g., user-input, embeddings"
            value={dataType}
            onChange={(e) => setDataType(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Protocol</Label>
          <Input
            placeholder="e.g., HTTPS, gRPC"
            value={protocol}
            onChange={(e) => setProtocol(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 pt-6">
          <Switch checked={isEncrypted} onCheckedChange={setIsEncrypted} />
          <Label>Encrypted in transit</Label>
        </div>
      </div>
      <Button
        onClick={handleAdd}
        disabled={!sourceId || !targetId || !label.trim()}
        className="gap-2"
      >
        <Plus className="h-4 w-4" /> Add Data Flow
      </Button>

      {dataFlows.length > 0 && (
        <div className="space-y-2 mt-4">
          {dataFlows.map((f) => (
            <Card key={f.id}>
              <CardContent className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{getComponentName(f.sourceId)}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{getComponentName(f.targetId)}</span>
                  <span className="text-muted-foreground">({f.label})</span>
                  {f.isEncrypted ? (
                    <Badge variant="outline" className="text-xs text-green-500">Encrypted</Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs">Unencrypted</Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => removeDataFlow(f.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
