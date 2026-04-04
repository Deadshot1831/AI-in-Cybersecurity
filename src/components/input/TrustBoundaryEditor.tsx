import { useState } from "react"
import { Plus, Trash2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSystemStore } from "@/stores/useSystemStore"

export function TrustBoundaryEditor() {
  const { architecture, addTrustBoundary, removeTrustBoundary } = useSystemStore()
  const [name, setName] = useState("")
  const [trustLevel, setTrustLevel] = useState<"high" | "medium" | "low">("medium")
  const [selectedComponentIds, setSelectedComponentIds] = useState<string[]>([])

  const components = architecture?.components ?? []
  const trustBoundaries = architecture?.trustBoundaries ?? []

  const handleAdd = () => {
    if (!name.trim() || selectedComponentIds.length === 0) return
    addTrustBoundary({
      id: crypto.randomUUID(),
      name: name.trim(),
      componentIds: selectedComponentIds,
      trustLevel,
    })
    setName("")
    setSelectedComponentIds([])
  }

  const toggleComponent = (id: string) => {
    setSelectedComponentIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    )
  }

  const getComponentName = (id: string) =>
    components.find((c) => c.id === id)?.name ?? "Unknown"

  const trustLevelColors = {
    high: "text-green-500",
    medium: "text-yellow-500",
    low: "text-red-500",
  }

  if (components.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Add components before defining trust boundaries.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Boundary Name</Label>
          <Input
            placeholder="e.g., Internal Network, Cloud VPC"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Trust Level</Label>
          <Select value={trustLevel} onValueChange={(v) => setTrustLevel(v as "high" | "medium" | "low")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High Trust</SelectItem>
              <SelectItem value="medium">Medium Trust</SelectItem>
              <SelectItem value="low">Low Trust</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Components in this boundary (click to select)</Label>
          <div className="flex flex-wrap gap-2">
            {components.map((c) => (
              <Badge
                key={c.id}
                variant={selectedComponentIds.includes(c.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleComponent(c.id)}
              >
                {c.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <Button
        onClick={handleAdd}
        disabled={!name.trim() || selectedComponentIds.length === 0}
        className="gap-2"
      >
        <Plus className="h-4 w-4" /> Add Trust Boundary
      </Button>

      {trustBoundaries.length > 0 && (
        <div className="space-y-3 mt-4">
          {trustBoundaries.map((b) => (
            <Card key={b.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-sm">{b.name}</CardTitle>
                    <span className={`text-xs font-medium ${trustLevelColors[b.trustLevel]}`}>
                      {b.trustLevel.toUpperCase()} trust
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => removeTrustBoundary(b.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1.5">
                  {b.componentIds.map((id) => (
                    <Badge key={id} variant="secondary" className="text-xs">
                      {getComponentName(id)}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
