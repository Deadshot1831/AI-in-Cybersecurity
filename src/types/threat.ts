export type Severity = "critical" | "high" | "medium" | "low"

export type FrameworkType = "owasp-llm" | "stride" | "mitre-atlas"

export interface OwaspMapping {
  id: string
  name: string
  relevance: number
}

export interface StrideMapping {
  category:
    | "spoofing"
    | "tampering"
    | "repudiation"
    | "information-disclosure"
    | "denial-of-service"
    | "elevation-of-privilege"
  relevance: number
}

export interface AtlasMapping {
  tacticId: string
  tacticName: string
  techniqueId?: string
  techniqueName?: string
  relevance: number
}

export interface Mitigation {
  id: string
  title: string
  description: string
  priority: Severity
  effort: "low" | "medium" | "high"
  frameworks: FrameworkType[]
}

export interface Threat {
  id: string
  title: string
  description: string
  severity: Severity
  affectedComponentIds: string[]
  attackVector: string
  impact: string
  likelihood: "very-likely" | "likely" | "possible" | "unlikely"
  owaspMappings: OwaspMapping[]
  strideMappings: StrideMapping[]
  atlasMappings: AtlasMapping[]
  mitigations: Mitigation[]
}

export interface RiskScore {
  overall: number
  byFramework: {
    owasp: number
    stride: number
    atlas: number
  }
  bySeverity: {
    critical: number
    high: number
    medium: number
    low: number
  }
}

export interface ThreatAnalysisResult {
  id: string
  systemId: string
  threats: Threat[]
  riskScore: RiskScore
  executiveSummary: string
  analyzedAt: string
  isLiveAnalysis: boolean
  frameworksCovered: FrameworkType[]
}

export type AnalysisStatus =
  | "idle"
  | "parsing-input"
  | "analyzing-owasp"
  | "analyzing-stride"
  | "analyzing-atlas"
  | "correlating"
  | "complete"
  | "error"

export const SEVERITY_ORDER: Record<Severity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
}

export const SEVERITY_COLORS: Record<Severity, string> = {
  critical: "text-red-500",
  high: "text-orange-500",
  medium: "text-yellow-500",
  low: "text-green-500",
}

export const SEVERITY_BG_COLORS: Record<Severity, string> = {
  critical: "bg-red-500/10 border-red-500/20",
  high: "bg-orange-500/10 border-orange-500/20",
  medium: "bg-yellow-500/10 border-yellow-500/20",
  low: "bg-green-500/10 border-green-500/20",
}
