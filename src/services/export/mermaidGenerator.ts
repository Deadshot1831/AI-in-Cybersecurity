import type { SystemArchitecture } from "@/types/system"
import type { ThreatAnalysisResult } from "@/types/threat"
import type { MermaidExportData } from "@/types/export"

function sanitizeId(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 30)
}

function sanitizeLabel(text: string): string {
  return text.replace(/"/g, "'").replace(/[[\]]/g, "")
}

export function generateMermaidDiagram(
  system: SystemArchitecture,
  analysis: ThreatAnalysisResult
): MermaidExportData {
  const lines: string[] = ["flowchart TD"]

  // Create subgraphs for trust boundaries
  for (const boundary of system.trustBoundaries) {
    const trustEmoji =
      boundary.trustLevel === "high" ? "🟢" :
      boundary.trustLevel === "medium" ? "🟡" : "🔴"

    lines.push(`  subgraph ${sanitizeId(boundary.name)}["${trustEmoji} ${sanitizeLabel(boundary.name)} (${boundary.trustLevel} trust)"]`)

    for (const compId of boundary.componentIds) {
      const comp = system.components.find((c) => c.id === compId)
      if (comp) {
        const id = sanitizeId(comp.name)
        if (comp.isExternalFacing) {
          lines.push(`    ${id}[/"${sanitizeLabel(comp.name)}"/]`)
        } else {
          lines.push(`    ${id}["${sanitizeLabel(comp.name)}"]`)
        }
      }
    }
    lines.push("  end")
  }

  // Add components not in any boundary
  const boundaryCompIds = new Set(
    system.trustBoundaries.flatMap((b) => b.componentIds)
  )
  for (const comp of system.components) {
    if (!boundaryCompIds.has(comp.id)) {
      const id = sanitizeId(comp.name)
      lines.push(`  ${id}["${sanitizeLabel(comp.name)}"]`)
    }
  }

  lines.push("")

  // Add data flows
  for (const flow of system.dataFlows) {
    const src = system.components.find((c) => c.id === flow.sourceId)
    const tgt = system.components.find((c) => c.id === flow.targetId)
    if (src && tgt) {
      const srcId = sanitizeId(src.name)
      const tgtId = sanitizeId(tgt.name)
      const encLabel = flow.isEncrypted ? "" : " ⚠️"
      lines.push(`  ${srcId} -->|"${sanitizeLabel(flow.label)}${encLabel}"| ${tgtId}`)
    }
  }

  lines.push("")

  // Add threat annotations (top threats only to avoid clutter)
  const topThreats = analysis.threats
    .filter((t) => t.severity === "critical" || t.severity === "high")
    .slice(0, 5)

  for (const threat of topThreats) {
    const severityEmoji =
      threat.severity === "critical" ? "🔴" : "🟠"

    if (threat.affectedComponentIds.length >= 2) {
      const comp1 = system.components.find((c) => c.id === threat.affectedComponentIds[0])
      const comp2 = system.components.find((c) => c.id === threat.affectedComponentIds[1])
      if (comp1 && comp2) {
        lines.push(
          `  ${sanitizeId(comp1.name)} -.-|"${severityEmoji} ${sanitizeLabel(threat.title)}"| ${sanitizeId(comp2.name)}`
        )
      }
    } else if (threat.affectedComponentIds.length === 1) {
      const comp = system.components.find((c) => c.id === threat.affectedComponentIds[0])
      if (comp) {
        lines.push(
          `  ${sanitizeId(comp.name)} -.-|"${severityEmoji} ${sanitizeLabel(threat.title)}"| ${sanitizeId(comp.name)}`
        )
      }
    }
  }

  // Style nodes
  lines.push("")
  lines.push("  classDef external fill:#dc2626,stroke:#991b1b,color:#fff")
  lines.push("  classDef internal fill:#1e40af,stroke:#1e3a5f,color:#fff")

  for (const comp of system.components) {
    const id = sanitizeId(comp.name)
    lines.push(`  class ${id} ${comp.isExternalFacing ? "external" : "internal"}`)
  }

  return {
    diagramSyntax: lines.join("\n"),
    diagramType: "flowchart",
  }
}
