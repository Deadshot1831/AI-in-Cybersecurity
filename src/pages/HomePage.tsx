import { Link } from "react-router-dom"
import {
  Shield,
  Search,
  FileText,
  ArrowRight,
  Languages,
  HelpCircle,
  BarChart3,
  Terminal,
  Radio,
  Cpu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSettingsStore } from "@/stores/useSettingsStore"

export function HomePage() {
  const plainEnglish = useSettingsStore((s) => s.plainEnglish)

  const features = plainEnglish
    ? [
        {
          icon: HelpCircle,
          code: "001",
          title: "Answer Simple Questions",
          description:
            "Our guided interview asks yes/no questions about your AI. No tech jargon — just answer honestly.",
        },
        {
          icon: BarChart3,
          code: "002",
          title: "Get Your Safety Score",
          description:
            "See an A–F grade and colour-coded score showing how safe your AI system is, with real-world scenarios.",
        },
        {
          icon: FileText,
          code: "003",
          title: "Get an Action Plan",
          description:
            "A prioritised checklist tells you what to fix first, in plain language anyone on the team can understand.",
        },
      ]
    : [
        {
          icon: Shield,
          code: "001",
          title: "Define System",
          description:
            "Map LLM/GenAI architecture: components, data flows, trust boundaries. Structured or freeform ingest.",
        },
        {
          icon: Search,
          code: "002",
          title: "Analyze Threats",
          description:
            "Automated sweep against OWASP LLM-10, STRIDE, and MITRE ATLAS frameworks, correlated into a unified report.",
        },
        {
          icon: FileText,
          code: "003",
          title: "Export Artifacts",
          description:
            "Generate Mermaid diagrams, blog posts, GitHub security reports, and LinkedIn carousels.",
        },
      ]

  return (
    <div className="relative flex flex-col gap-24 py-16">
      {/* ────────── HERO ────────── */}
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          {/* LEFT — HUD copy block */}
          <div className="relative">
            {/* Terminal meta line */}
            <div
              className="flex items-center gap-3 font-[family-name:var(--font-terminal)] text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6 animate-fade-up"
              style={{ animationDelay: "40ms" }}
            >
              <span className="h-px w-10 bg-accent/60" />
              <Radio className="h-3 w-3 text-accent animate-pulse" strokeWidth={1.5} />
              <span className="text-accent">[ SIGNAL ACQUIRED ]</span>
              <span>//</span>
              <span>node_07 &middot; 2026.04</span>
            </div>

            {/* Glitched headline */}
            <h1
              className="font-[family-name:var(--font-display)] font-black uppercase leading-[0.9] tracking-[0.02em] text-5xl sm:text-6xl lg:text-7xl mb-6 animate-fade-up"
              style={{ animationDelay: "120ms" }}
            >
              <span
                className="cyber-glitch block text-foreground animate-cyber-flicker"
                data-text={plainEnglish ? "AI Safety" : "Threat"}
              >
                {plainEnglish ? "AI Safety" : "Threat"}
              </span>
              <span
                className="cyber-glitch block text-accent"
                data-text={plainEnglish ? "Checker" : "Modeler"}
                style={{ textShadow: "0 0 10px rgba(0, 255, 136, 0.55)" }}
              >
                {plainEnglish ? "Checker" : "Modeler"}
              </span>
            </h1>

            {/* Terminal description */}
            <div
              className="cyber-chamfer border border-border bg-card/60 backdrop-blur-sm p-5 mb-8 font-[family-name:var(--font-mono)] text-sm leading-relaxed text-muted-foreground animate-fade-up"
              style={{ animationDelay: "200ms" }}
            >
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-accent mb-3">
                <Terminal className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span>&gt; ./intel.sh --brief</span>
              </div>
              <p className="cursor-blink">
                {plainEnglish
                  ? "Find out if your AI system is safe. Answer a few simple questions and get a clear security report with actionable steps — no cybersecurity expertise needed."
                  : "Map LLM/GenAI architecture, detect threats across OWASP LLM-10, STRIDE, and MITRE ATLAS, and generate professional security artifacts — all from a single interface."}
              </p>
            </div>

            {plainEnglish && (
              <Badge variant="secondary" className="mb-6 animate-fade-up" style={{ animationDelay: "260ms" }}>
                <Languages className="h-3 w-3" strokeWidth={1.5} /> Plain English Mode // Active
              </Badge>
            )}

            <div
              className="flex flex-wrap items-center gap-3 animate-fade-up"
              style={{ animationDelay: "300ms" }}
            >
              <Link to="/input">
                <Button variant="glitch" size="lg" className="shimmer-host magnetic-glow">
                  {plainEnglish ? "Check My AI System" : "Initiate Scan"}{" "}
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </Button>
              </Link>
              <Link to="/analysis">
                <Button variant="outline" size="lg">
                  <Terminal className="h-4 w-4" strokeWidth={1.5} /> View Console
                </Button>
              </Link>
            </div>

            {/* stat strip */}
            <div
              className="mt-10 grid grid-cols-3 divide-x divide-border border border-border cyber-chamfer-sm bg-background/60 animate-fade-up"
              style={{ animationDelay: "360ms" }}
            >
              {[
                { k: "FRAMEWORKS", v: "03" },
                { k: "THREAT VECTORS", v: "12+" },
                { k: "LATENCY", v: "< 5s" },
              ].map((s) => (
                <div key={s.k} className="px-4 py-3">
                  <div className="font-[family-name:var(--font-terminal)] text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                    {s.k}
                  </div>
                  <div className="font-[family-name:var(--font-display)] text-2xl font-bold text-accent mt-1">
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — holographic HUD panel */}
          <div
            className="hidden lg:block relative animate-fade-up"
            style={{ animationDelay: "180ms" }}
          >
            <div className="cyber-chamfer-lg cyber-corners border border-accent/30 bg-[color:var(--muted)]/30 backdrop-blur-sm p-6 shadow-[0_0_10px_#00ff88,0_0_32px_rgba(0,255,136,0.35)] cyber-scan">
              <div className="flex items-center justify-between font-[family-name:var(--font-terminal)] text-[10px] uppercase tracking-[0.3em] text-accent mb-5">
                <span>// TARGET_HUD</span>
                <span className="text-muted-foreground">status: NOMINAL</span>
              </div>

              {/* Central iconic shield */}
              <div className="relative grid place-items-center py-8">
                <div className="absolute inset-x-10 inset-y-4 border border-accent/20 cyber-chamfer-sm" />
                <div className="absolute inset-x-16 inset-y-10 border border-[color:var(--accent-tertiary)]/20 rotate-45" />
                <div className="relative grid h-24 w-24 place-items-center border-2 border-accent cyber-chamfer bg-background animate-pulse-neon">
                  <Shield className="h-10 w-10 text-accent" strokeWidth={1.5} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                {[
                  { label: "OWASP LLM", val: "10/10", color: "text-accent" },
                  { label: "STRIDE", val: "06/06", color: "text-[color:var(--accent-tertiary)]" },
                  { label: "MITRE ATLAS", val: "14 TTPs", color: "text-[color:var(--accent-secondary)]" },
                  { label: "SIGNAL", val: "LOCKED", color: "text-accent" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="border border-border bg-background/60 px-3 py-2 cyber-chamfer-sm"
                  >
                    <div className="font-[family-name:var(--font-terminal)] text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                      {row.label}
                    </div>
                    <div className={`font-[family-name:var(--font-mono)] text-sm font-bold ${row.color}`}>
                      {row.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────── FEATURES ────────── */}
      <section>
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 font-[family-name:var(--font-terminal)] text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
              <span className="h-px w-10 bg-accent" />
              <Cpu className="h-3 w-3 text-accent" strokeWidth={1.5} />
              <span className="text-accent">// PIPELINE</span>
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold uppercase tracking-[0.08em]">
              Three-Stage Sweep
            </h2>
          </div>
          <span className="hidden sm:block font-[family-name:var(--font-terminal)] text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            03 &middot; modules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="relative animate-fade-up group"
              style={{ animationDelay: `${360 + i * 90}ms` }}
            >
              <div className="relative cyber-chamfer border border-border bg-card p-6 h-full transition-[transform,box-shadow,border-color] duration-200 group-hover:border-accent group-hover:-translate-y-1 group-hover:shadow-[0_0_6px_#00ff88,0_0_20px_rgba(0,255,136,0.45)]">
                <div className="flex items-start justify-between mb-5">
                  <div className="grid h-12 w-12 place-items-center border border-border cyber-chamfer-sm text-muted-foreground transition-all group-hover:border-accent group-hover:text-accent group-hover:shadow-[0_0_5px_#00ff88,0_0_12px_rgba(0,255,136,0.5)]">
                    <feature.icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <span className="font-[family-name:var(--font-terminal)] text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    // {feature.code}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold uppercase tracking-[0.08em] text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="font-[family-name:var(--font-mono)] text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
                {/* bottom progress bar */}
                <div className="mt-6 h-px w-full bg-border relative overflow-hidden">
                  <span className="absolute inset-y-0 left-0 w-0 bg-accent transition-all duration-500 group-hover:w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {!plainEnglish && (
        <section className="relative">
          <div className="cyber-chamfer border border-border bg-card/60 backdrop-blur-sm p-6 font-[family-name:var(--font-mono)] text-sm text-muted-foreground flex flex-col sm:flex-row items-start sm:items-center gap-3 max-w-3xl mx-auto">
            <Terminal className="h-4 w-4 text-accent shrink-0" strokeWidth={1.5} />
            <p>
              <span className="text-accent">$</span> New to cybersecurity? Toggle{" "}
              <span className="text-accent uppercase tracking-[0.15em]">[Plain English]</span> in the HUD bar for a
              simplified operator mode.
            </p>
          </div>
        </section>
      )}
    </div>
  )
}
