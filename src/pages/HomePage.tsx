import { Link } from "react-router-dom"
import { Shield, Search, FileText, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const features = [
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

export function HomePage() {
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
        <p className="text-lg text-muted-foreground mb-8">
          Map your LLM and GenAI system architecture, identify security threats across
          OWASP, STRIDE, and MITRE ATLAS frameworks, and generate professional security artifacts.
        </p>
        <Link to="/input">
          <Button size="lg" className="gap-2">
            Get Started <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
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
    </div>
  )
}
