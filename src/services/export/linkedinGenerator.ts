import type { SystemArchitecture } from "@/types/system"
import type { ThreatAnalysisResult } from "@/types/threat"
import type { LinkedInExportData, LinkedInSlide } from "@/types/export"

export function generateLinkedInSlides(
  system: SystemArchitecture,
  analysis: ThreatAnalysisResult
): LinkedInExportData {
  const slides: LinkedInSlide[] = []
  const riskLevel =
    analysis.riskScore.overall >= 75 ? "Critical" :
    analysis.riskScore.overall >= 50 ? "High" :
    analysis.riskScore.overall >= 25 ? "Medium" : "Low"

  // Slide 1: Title
  slides.push({
    slideNumber: 1,
    title: `AI Threat Model: ${system.name}`,
    bullets: [
      `${analysis.threats.length} threats identified`,
      `Risk Score: ${analysis.riskScore.overall}/100 (${riskLevel})`,
      "OWASP LLM Top 10 | STRIDE | MITRE ATLAS",
    ],
    footer: "Swipe to explore the findings →",
  })

  // Slide 2: Executive summary
  const summaryBullets = analysis.executiveSummary
    .split(". ")
    .filter((s) => s.length > 20)
    .slice(0, 3)
    .map((s) => s.trim().replace(/\.$/, ""))

  slides.push({
    slideNumber: 2,
    title: "Executive Summary",
    bullets: summaryBullets,
  })

  // Slide 3: System overview
  slides.push({
    slideNumber: 3,
    title: "System Architecture",
    bullets: [
      `${system.components.length} components`,
      `${system.dataFlows.length} data flows`,
      `${system.trustBoundaries.length} trust boundaries`,
      `External surface: ${system.components.filter((c) => c.isExternalFacing).map((c) => c.name).join(", ")}`,
    ],
  })

  // Slide 4: Risk breakdown
  slides.push({
    slideNumber: 4,
    title: "Risk Breakdown",
    bullets: [
      `🔴 Critical: ${analysis.riskScore.bySeverity.critical} threats`,
      `🟠 High: ${analysis.riskScore.bySeverity.high} threats`,
      `🟡 Medium: ${analysis.riskScore.bySeverity.medium} threats`,
      `🟢 Low: ${analysis.riskScore.bySeverity.low} threats`,
    ],
  })

  // Slides 5-8: Top threats
  const topThreats = analysis.threats
    .filter((t) => t.severity === "critical" || t.severity === "high")
    .slice(0, 4)

  for (const threat of topThreats) {
    const frameworks: string[] = []
    if (threat.owaspMappings.length > 0) frameworks.push(`OWASP: ${threat.owaspMappings[0].name}`)
    if (threat.strideMappings.length > 0) frameworks.push(`STRIDE: ${threat.strideMappings[0].category.replace(/-/g, " ")}`)
    if (threat.atlasMappings.length > 0) frameworks.push(`ATLAS: ${threat.atlasMappings[0].tacticName}`)

    slides.push({
      slideNumber: slides.length + 1,
      title: `⚠️ ${threat.title}`,
      bullets: [
        `Severity: ${threat.severity.toUpperCase()}`,
        ...frameworks,
        `Impact: ${threat.impact.slice(0, 100)}${threat.impact.length > 100 ? "..." : ""}`,
      ],
    })
  }

  // Slide: Key mitigations
  const criticalMitigations = analysis.threats
    .flatMap((t) => t.mitigations)
    .filter((m) => m.priority === "critical" || m.priority === "high")
    .slice(0, 4)

  slides.push({
    slideNumber: slides.length + 1,
    title: "Top Mitigations",
    bullets: criticalMitigations.map((m) => `✅ ${m.title}`),
  })

  // Slide: Framework scores
  slides.push({
    slideNumber: slides.length + 1,
    title: "Framework Coverage",
    bullets: [
      `OWASP LLM Top 10: ${analysis.riskScore.byFramework.owasp}/100`,
      `STRIDE: ${analysis.riskScore.byFramework.stride}/100`,
      `MITRE ATLAS: ${analysis.riskScore.byFramework.atlas}/100`,
      `Overall: ${analysis.riskScore.overall}/100`,
    ],
  })

  // Final slide: CTA
  slides.push({
    slideNumber: slides.length + 1,
    title: "Secure Your AI Systems",
    bullets: [
      "Threat model before you deploy",
      "Map risks to established frameworks",
      "Prioritize mitigations by impact",
      "Built with AI Threat Modeler",
    ],
    footer: "Like & share if this was helpful!",
  })

  return {
    slides,
    title: `AI Threat Model: ${system.name}`,
  }
}
