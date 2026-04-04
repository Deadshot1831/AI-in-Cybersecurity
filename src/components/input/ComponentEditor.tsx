import { useState } from "react"
import { Plus, Trash2, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSystemStore } from "@/stores/useSystemStore"
import { COMPONENT_TYPE_LABELS } from "@/types/system"
import type { ComponentType } from "@/types/system"

export function ComponentEditor() {
  const { architecture, addComponent, removeComponent } = useSystemStore()
  const [name, setName] = useState("")
  const [type, setType] = useState<ComponentType>("llm-endpoint")
  const [description, setDescription] = useState("")
  const [technologies, setTechnologies] = useState("")
  const [isExternalFacing, setIsExternalFacing] = useState(false)

  const handleAdd = () => {
    if (!name.trim()) return
    addComponent({
      id: crypto.randomUUID(),
      name: name.trim(),
      type,
      description: description.trim(),
      technologies: technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      isExternalFacing,
    })
    setName("")
    setDescription("")
    setTechnologies("")
    setIsExternalFacing(false)
  }

  const components = architecture?.components ?? []

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Component Name</Label>
          <Input
            placeholder="e.g., GPT-4 Endpoint"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as ComponentType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(COMPONENT_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <Textarea
            placeholder="Brief description of this component's role"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label>Technologies (comma-separated)</Label>
          <Input
            placeholder="e.g., OpenAI, Python, FastAPI"
            value={technologies}
            onChange={(e) => setTechnologies(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 pt-6">
          <Switch
            checked={isExternalFacing}
            onCheckedChange={setIsExternalFacing}
          />
          <Label>External-facing (internet accessible)</Label>
        </div>
      </div>
      <Button onClick={handleAdd} disabled={!name.trim()} className="gap-2">
        <Plus className="h-4 w-4" /> Add Component
      </Button>

      {components.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {components.map((c) => (
            <Card key={c.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-sm">{c.name}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => removeComponent(c.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-xs">
                    {COMPONENT_TYPE_LABELS[c.type]}
                  </Badge>
                  {c.isExternalFacing && (
                    <Badge variant="destructive" className="text-xs">
                      External
                    </Badge>
                  )}
                  {c.technologies.map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
                {c.description && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {c.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
