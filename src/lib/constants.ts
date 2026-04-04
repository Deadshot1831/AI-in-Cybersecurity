import type { FrameworkType } from "@/types/threat"

export const FRAMEWORK_LABELS: Record<FrameworkType, string> = {
  "owasp-llm": "OWASP LLM Top 10",
  stride: "STRIDE",
  "mitre-atlas": "MITRE ATLAS",
}

export const FRAMEWORK_COLORS: Record<FrameworkType, string> = {
  "owasp-llm": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  stride: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  "mitre-atlas": "bg-red-500/10 text-red-500 border-red-500/20",
}

export const ANALYSIS_STATUS_MESSAGES: Record<string, string> = {
  idle: "Ready to analyze",
  "parsing-input": "Parsing system architecture...",
  "analyzing-owasp": "Analyzing against OWASP LLM Top 10...",
  "analyzing-stride": "Running STRIDE threat analysis...",
  "analyzing-atlas": "Mapping to MITRE ATLAS framework...",
  correlating: "Correlating findings across frameworks...",
  complete: "Analysis complete",
  error: "Analysis failed",
}
