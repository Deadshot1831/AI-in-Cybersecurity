import { Link } from "react-router-dom"
import { Shield, Search, FileText, ArrowRight, Languages, HelpCircle, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSettingsStore } from "@/stores/useSettingsStore"

export function HomePage() {
  const plainEnglish = useSettingsStore((s) => s.plainEnglish)

  const features = plainEnglish
    ? [
        {
          icon: HelpCircle,
          title: "Answer Simple Questions",
          description: "Our guided interview asks you yes/no questions about your AI. No tech jargon required - just answer honestly!",
        },
        {
          icon: BarChart3,
          title: "Get Your Safety Score",
          description: "See a clear A-F grade and color-coded score showing how safe your AI system is, with real-world scenarios.",
        },
        {
          icon: FileText,
          title: "Get an Action Plan",
          description: "A prioritized checklist tells you what to fix first, in plain language anyone on your team can understand.",
        },
      ]
    : [
        {
          icon: Shield,
          title: "Define Your System",
          description: "Map your LLM/GenAI architecture including components, data flows, and trust boundaries.",
        },
        {
          icon: Search,
          title: "Analyze Threats",
          description: "Automated analysis against OWASP LLM Top 10, STRIDE, and MITRE ATLAS frameworks.",
        },
        {
          icon: FileText,
          title: "Export Artifacts",
          description: "Generate Mermaid diagrams, blog posts, GitHub reports, and LinkedIn carousels.",
        },
      ]

  return (
    <div className="flex flex-col items-center gap-12 py-12">
      <div className="text-center max-w-2xl">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-primary/10 p-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          AI Threat Modeler
        </h1>
        <p className="text-lg text-muted-foreground mb-4">
          {plainEnglish
            ? "Find out if your AI system is safe. Answer a few simple questions and get a clear security report with actionable steps - no cybersecurity expertise needed."
            : "Map your LLM and GenAI system architecture, identify security threats across OWASP, STRIDE, and MITRE ATLAS frameworks, and generate professional security artifacts."}
        </p>
        {plainEnglish && (
          <Badge variant="secondary" className="mb-6 gap-1.5">
            <Languages className="h-3.5 w-3.5" /> Plain English Mode Active
          </Badge>
        )}
        <div className="flex justify-center gap-3 mt-4">
          <Link to="/input">
            <Button size="lg" className="gap-2">
              {plainEnglish ? "Check My AI System" : "Get Started"} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {features.map((feature) => (
          <Card key={feature.title} className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-3">
                <feature.icon className="h-8 w-8 text-muted-foreground" />
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {!plainEnglish && (
        <div className="text-center max-w-md">
          <p className="text-sm text-muted-foreground">
            New to cybersecurity? Click the <strong>"Technical"</strong> button in the header to switch to <strong>Plain English</strong> mode for a simplified experience.
          </p>
        </div>
      )}
    </div>
  )
}
