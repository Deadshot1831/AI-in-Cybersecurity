import { Shield } from "lucide-react"
import { useSettingsStore } from "@/stores/useSettingsStore"

export function Footer() {
  const plainEnglish = useSettingsStore((s) => s.plainEnglish)

  return (
    <footer className="border-t border-border bg-background/95 py-6 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>AI Threat Modeler</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {plainEnglish
              ? "Checks your AI system against 3 industry security standards"
              : "Powered by OWASP LLM Top 10, STRIDE, and MITRE ATLAS frameworks"}
          </p>
        </div>
      </div>
    </footer>
  )
}
