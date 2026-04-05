import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useSettingsStore } from "@/stores/useSettingsStore"

export function PlainEnglishToggle() {
  const { plainEnglish, setPlainEnglish } = useSettingsStore()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={plainEnglish ? "default" : "outline"}
          size="sm"
          onClick={() => setPlainEnglish(!plainEnglish)}
          className="gap-1.5 text-xs"
        >
          <Languages className="h-3.5 w-3.5" />
          {plainEnglish ? "Plain English" : "Technical"}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{plainEnglish ? "Switch to technical terminology" : "Switch to plain English (non-technical)"}</p>
      </TooltipContent>
    </Tooltip>
  )
}
