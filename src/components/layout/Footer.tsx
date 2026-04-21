import { Shield, Radio } from "lucide-react"
import { useSettingsStore } from "@/stores/useSettingsStore"

export function Footer() {
  const plainEnglish = useSettingsStore((s) => s.plainEnglish)

  return (
    <footer className="relative mt-auto border-t border-border bg-background/90">
      {/* top HUD strip */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 font-[family-name:var(--font-terminal)] uppercase tracking-[0.2em] text-[10px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="relative grid h-6 w-6 place-items-center border border-accent/60 cyber-chamfer-sm text-accent">
              <Shield className="h-3.5 w-3.5" strokeWidth={1.5} />
            </span>
            <span className="text-accent">[ NIGHTFALL.SEC ]</span>
            <span className="text-muted-foreground">v0.1.0</span>
          </div>
          <div className="flex items-center gap-2">
            <Radio className="h-3 w-3 text-accent animate-pulse" strokeWidth={1.5} />
            <span>
              {plainEnglish
                ? "Audits against 3 industry frameworks"
                : "OWASP LLM-10 // STRIDE // MITRE ATLAS"}
            </span>
            <span className="hidden sm:inline text-accent animate-blink">▊</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
