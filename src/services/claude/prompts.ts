import type { SystemArchitecture } from "@/types/system"

function systemToDescription(system: SystemArchitecture): string {
  let desc = `System: ${system.name}\nDescription: ${system.description}\n\n`

  desc += "Components:\n"
  for (const c of system.components) {
    desc += `- ${c.name} (${c.type}): ${c.description}. Technologies: ${c.technologies.join(", ")}. ${c.isExternalFacing ? "EXTERNAL-FACING" : "Internal"}\n`
  }

  desc += "\nData Flows:\n"
  for (const f of system.dataFlows) {
    const src = system.components.find((c) => c.id === f.sourceId)?.name ?? f.sourceId
    const tgt = system.components.find((c) => c.id === f.targetId)?.name ?? f.targetId
    desc += `- ${src} -> ${tgt}: "${f.label}" (${f.dataType}, ${f.isEncrypted ? "encrypted" : "UNENCRYPTED"}${f.protocol ? `, ${f.protocol}` : ""})\n`
  }

  desc += "\nTrust Boundaries:\n"
  for (const b of system.trustBoundaries) {
    const names = b.componentIds
      .map((id) => system.components.find((c) => c.id === id)?.name ?? id)
      .join(", ")
    desc += `- ${b.name} [${b.trustLevel} trust]: ${names}\n`
  }

  return desc
}

export const SYSTEM_PARSER_PROMPT = `You are an AI security architect. Parse the following natural-language description of an AI/LLM system into a structured architecture.

Return ONLY valid JSON with this exact schema (no markdown, no explanation):
{
  "name": "string",
  "description": "string",
  "components": [{"name": "string", "type": "llm-endpoint"|"rag-database"|"vector-store"|"prompt-template"|"user-interface"|"api-gateway"|"data-pipeline"|"auth-service"|"external-api"|"storage"|"custom", "description": "string", "technologies": ["string"], "isExternalFacing": boolean}],
  "dataFlows": [{"sourceComponent": "string", "targetComponent": "string", "label": "string", "dataType": "string", "isEncrypted": boolean, "protocol": "string"}],
  "trustBoundaries": [{"name": "string", "componentNames": ["string"], "trustLevel": "high"|"medium"|"low"}]
}`

export function buildOwaspPrompt(system: SystemArchitecture): { system: string; user: string } {
  return {
    system: `You are a cybersecurity expert specializing in AI/LLM security. Analyze the given system against the OWASP Top 10 for LLM Applications 2025.

The OWASP LLM Top 10 2025 categories are:
LLM01: Prompt Injection
LLM02: Sensitive Information Disclosure
LLM03: Supply Chain Vulnerabilities
LLM04: Data and Model Poisoning
LLM05: Improper Output Handling
LLM06: Excessive Agency
LLM07: System Prompt Leakage
LLM08: Vector and Embedding Weaknesses
LLM09: Misinformation
LLM10: Unbounded Consumption

Return ONLY valid JSON with this schema (no markdown, no explanation):
{
  "threats": [{
    "owaspId": "string (e.g. LLM01)",
    "owaspName": "string",
    "title": "string - specific threat title for this system",
    "description": "string - detailed description",
    "severity": "critical"|"high"|"medium"|"low",
    "affectedComponents": ["string - component names"],
    "attackVector": "string",
    "impact": "string",
    "likelihood": "very-likely"|"likely"|"possible"|"unlikely",
    "mitigations": [{"title": "string", "description": "string", "priority": "critical"|"high"|"medium"|"low", "effort": "low"|"medium"|"high"}]
  }]
}`,
    user: systemToDescription(system),
  }
}

export function buildStridePrompt(system: SystemArchitecture): { system: string; user: string } {
  return {
    system: `You are a cybersecurity expert. Analyze the given AI/LLM system using STRIDE threat modeling (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) with AI-specific considerations.

Return ONLY valid JSON (no markdown):
{
  "threats": [{
    "strideCategory": "spoofing"|"tampering"|"repudiation"|"information-disclosure"|"denial-of-service"|"elevation-of-privilege",
    "title": "string",
    "description": "string",
    "severity": "critical"|"high"|"medium"|"low",
    "affectedComponents": ["string"],
    "attackVector": "string",
    "impact": "string",
    "likelihood": "very-likely"|"likely"|"possible"|"unlikely",
    "mitigations": [{"title": "string", "description": "string", "priority": "critical"|"high"|"medium"|"low", "effort": "low"|"medium"|"high"}]
  }]
}`,
    user: systemToDescription(system),
  }
}

export function buildAtlasPrompt(system: SystemArchitecture): { system: string; user: string } {
  return {
    system: `You are an AI security expert specializing in adversarial ML. Analyze the given system using the MITRE ATLAS framework (Adversarial Threat Landscape for AI Systems).

Key ATLAS tactics: Reconnaissance (AML.TA0001), Resource Development (AML.TA0002), Initial Access (AML.TA0003), ML Model Access (AML.TA0004), Execution (AML.TA0005), Persistence (AML.TA0006), Defense Evasion (AML.TA0007), Discovery (AML.TA0008), Collection (AML.TA0009), ML Attack Staging (AML.TA0010), Exfiltration (AML.TA0011), Impact (AML.TA0012), LLM Abuse (AML.TA0013), Agentic Threats (AML.TA0014), Supply Chain (AML.TA0015), Privilege Escalation (AML.TA0016).

Return ONLY valid JSON (no markdown):
{
  "threats": [{
    "tacticId": "string (e.g. AML.TA0003)",
    "tacticName": "string",
    "techniqueId": "string or null",
    "techniqueName": "string or null",
    "title": "string",
    "description": "string",
    "severity": "critical"|"high"|"medium"|"low",
    "affectedComponents": ["string"],
    "attackVector": "string",
    "impact": "string",
    "likelihood": "very-likely"|"likely"|"possible"|"unlikely",
    "mitigations": [{"title": "string", "description": "string", "priority": "critical"|"high"|"medium"|"low", "effort": "low"|"medium"|"high"}]
  }]
}`,
    user: systemToDescription(system),
  }
}

export function buildCorrelationPrompt(
  owaspJson: string,
  strideJson: string,
  atlasJson: string,
  system: SystemArchitecture
): { system: string; user: string } {
  return {
    system: `You are a senior cybersecurity analyst. You have received threat analysis results from three frameworks: OWASP LLM Top 10, STRIDE, and MITRE ATLAS.

Your task: Correlate, deduplicate, and synthesize these results into a unified threat model. For threats that appear in multiple frameworks, merge them into a single entry with mappings to all relevant frameworks. Generate an executive summary and risk scores.

Return ONLY valid JSON (no markdown):
{
  "executiveSummary": "string - 2-3 paragraph executive summary",
  "riskScore": {
    "overall": number (0-100),
    "byFramework": {"owasp": number, "stride": number, "atlas": number},
    "bySeverity": {"critical": number, "high": number, "medium": number, "low": number}
  },
  "threats": [{
    "title": "string",
    "description": "string",
    "severity": "critical"|"high"|"medium"|"low",
    "affectedComponents": ["string"],
    "attackVector": "string",
    "impact": "string",
    "likelihood": "very-likely"|"likely"|"possible"|"unlikely",
    "owaspMappings": [{"id": "string", "name": "string", "relevance": number}],
    "strideMappings": [{"category": "string", "relevance": number}],
    "atlasMappings": [{"tacticId": "string", "tacticName": "string", "techniqueId": "string or null", "techniqueName": "string or null", "relevance": number}],
    "mitigations": [{"title": "string", "description": "string", "priority": "critical"|"high"|"medium"|"low", "effort": "low"|"medium"|"high", "frameworks": ["owasp-llm"|"stride"|"mitre-atlas"]}]
  }]
}`,
    user: `System Architecture:
${systemToDescription(system)}

--- OWASP Analysis Results ---
${owaspJson}

--- STRIDE Analysis Results ---
${strideJson}

--- MITRE ATLAS Analysis Results ---
${atlasJson}`,
  }
}
