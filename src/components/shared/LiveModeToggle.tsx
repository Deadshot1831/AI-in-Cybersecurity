import { Zap, Database } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSettingsStore } from "@/stores/useSettingsStore"

export function LiveModeToggle() {
  const { isLiveMode, setLiveMode, apiKey } = useSettingsStore()

  const canToggle = !!apiKey

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <Switch
              checked={isLiveMode}
              onCheckedChange={setLiveMode}
              disabled={!canToggle}
            />
            <Zap className={`h-4 w-4 ${isLiveMode ? "text-yellow-500" : "text-muted-foreground"}`} />
            <Label className="text-xs hidden sm:inline">
              {isLiveMode ? "Live" : "Mock"}
            </Label>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {canToggle
            ? isLiveMode
              ? "Using Claude API for live analysis"
              : "Using mock data for demonstration"
            : "Set an API key to enable live mode"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
