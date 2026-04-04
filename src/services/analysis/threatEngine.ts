import type { SystemArchitecture } from "@/types/system"
import type { ThreatAnalysisResult, AnalysisStatus, Threat, FrameworkType, Severity, Mitigation } from "@/types/threat"
import { useAnalysisStore } from "@/stores/useAnalysisStore"
import { useSettingsStore } from "@/stores/useSettingsStore"
import { useSystemStore } from "@/stores/useSystemStore"
import { simulateDelay } from "@/services/mock/delay"
import { createClient } from "@/services/claude/client"
import { buildOwaspPrompt, buildStridePrompt, buildAtlasPrompt, buildCorrelationPrompt } from "@/services/claude/prompts"
import { streamAnalysis } from "@/services/claude/streamAnalysis"
import { parseJsonResponse } from "@/services/claude/parseResponse"

const updateStatus = (status: AnalysisStatus, progress: number) => {
  useAnalysisStore.getState().setStatus(status)
  useAnalysisStore.getState().setProgress(progress)
}

// ----------------------------------------------------------------
// Freeform text parser — infers components from natural language
// ----------------------------------------------------------------

interface KeywordRule {
  type: SystemArchitecture["components"][0]["type"]
  name: string
  keywords: RegExp[]
  description: string
  isExternalFacing: boolean
}

const KEYWORD_RULES: KeywordRule[] = [
  {
    type: "llm-endpoint",
    name: "LLM Endpoint",
    keywords: [/\bllm\b/i, /\bgpt[-\s]?\d?\b/i, /\bclaude\b/i, /\blanguage model\b/i, /\bchatbot\b/i, /\bchat\s?bot\b/i, /\bopenai\b/i, /\banthrop/i, /\bgemini\b/i, /\bcopilot\b/i, /\bcompletion\b/i, /\bfoundation model\b/i, /\bai\s+(model|service|system|agent|assistant)\b/i, /\btext generation\b/i, /\bllama\b/i, /\bmistral\b/i],
    description: "Large Language Model service for text generation",
    isExternalFacing: false,
  },
  {
    type: "rag-database",
    name: "RAG Knowledge Base",
    keywords: [/\brag\b/i, /\bretrieval[\s-]augmented\b/i, /\bknowledge base\b/i, /\bdocument\s+(store|retrieval|corpus)\b/i, /\bgrounding\b/i],
    description: "Retrieval-Augmented Generation document store",
    isExternalFacing: false,
  },
  {
    type: "vector-store",
    name: "Vector Database",
    keywords: [/\bvector\s*(db|database|store)\b/i, /\bembedding\s*(store|db|database|index)\b/i, /\bpinecone\b/i, /\bchroma\b/i, /\bweaviate\b/i, /\bqdrant\b/i, /\bfaiss\b/i, /\bmilvus\b/i, /\bsemantic\s+search\b/i],
    description: "Vector database for similarity search",
    isExternalFacing: false,
  },
  {
    type: "prompt-template",
    name: "Prompt Template Engine",
    keywords: [/\bprompt\s+(template|engineering|management)\b/i, /\bsystem\s+prompt\b/i, /\bprompt\s+chain\b/i, /\blangchain\b/i, /\bllamaindex\b/i],
    description: "Prompt template management and chaining",
    isExternalFacing: false,
  },
  {
    type: "user-interface",
    name: "Web Interface",
    keywords: [/\b(web\s*)?(ui|interface|frontend|front[\s-]?end)\b/i, /\bdashboard\b/i, /\bportal\b/i, /\bchat\s+interface\b/i, /\bweb\s*(app|application|site)\b/i, /\bmobile\s+app\b/i, /\breact\b/i, /\bnext\.?js\b/i],
    description: "User-facing web application",
    isExternalFacing: true,
  },
  {
    type: "api-gateway",
    name: "API Gateway",
    keywords: [/\bapi\s+gateway\b/i, /\bload\s+balancer\b/i, /\breverse\s+proxy\b/i, /\bnginx\b/i, /\bkong\b/i, /\brest\s*api\b/i, /\bgraphql\b/i, /\bendpoint\b/i],
    description: "API gateway for request routing and rate limiting",
    isExternalFacing: true,
  },
  {
    type: "data-pipeline",
    name: "Data Pipeline",
    keywords: [/\bdata\s+pipeline\b/i, /\betl\b/i, /\bingestion\b/i, /\bpreprocessing\b/i, /\bbatch\s+(processing|job)\b/i, /\bdata\s+flow\b/i, /\bairflow\b/i, /\bspark\b/i, /\bkafka\b/i],
    description: "Data ingestion and processing pipeline",
    isExternalFacing: false,
  },
  {
    type: "auth-service",
    name: "Authentication Service",
    keywords: [/\bauth(entication|orization)?\b/i, /\boauth\b/i, /\blogin\b/i, /\bsso\b/i, /\bidentity\b/i, /\bjwt\b/i, /\brbac\b/i, /\baccess\s+control\b/i],
    description: "Authentication and authorization service",
    isExternalFacing: false,
  },
  {
    type: "external-api",
    name: "External API",
    keywords: [/\bexternal\s+(api|service)\b/i, /\bthird[\s-]?party\b/i, /\bwebhook\b/i, /\bplugin\b/i, /\btool[\s-]?use\b/i, /\btool[\s-]?calling\b/i, /\bfunction[\s-]?calling\b/i, /\bagent\b/i, /\bintegration\b/i],
    description: "External third-party API integration",
    isExternalFacing: true,
  },
  {
    type: "storage",
    name: "Data Store",
    keywords: [/\bdatabase\b/i, /\b(sql|nosql|postgres|mysql|mongo|dynamo|redis|memcache)\b/i, /\bs3\b/i, /\bbucket\b/i, /\bcache\b/i, /\bfile\s*(system|store|storage)\b/i, /\bcloud\s+storage\b/i, /\bdata\s*store\b/i, /\bblob\b/i],
    description: "Data storage and caching layer",
    isExternalFacing: false,
  },
]

function parseFreeformToArchitecture(text: string): SystemArchitecture {
  const detectedComponents: SystemArchitecture["components"] = []
  const usedTypes = new Set<string>()

  // Scan text for keyword matches
  for (const rule of KEYWORD_RULES) {
    const matched = rule.keywords.some((re) => re.test(text))
    if (matched && !usedTypes.has(rule.type)) {
      usedTypes.add(rule.type)
      detectedComponents.push({
        id: crypto.randomUUID(),
        name: rule.name,
        type: rule.type,
        description: rule.description,
        technologies: [],
        isExternalFacing: rule.isExternalFacing,
      })
    }
  }

  // Always include at least an LLM endpoint (it's an AI threat modeler after all)
  if (!usedTypes.has("llm-endpoint")) {
    detectedComponents.push({
      id: crypto.randomUUID(),
      name: "AI/LLM Service",
      type: "llm-endpoint",
      description: "Inferred AI/LLM service",
      technologies: [],
      isExternalFacing: false,
    })
  }

  // If we only detected 1 component, add a user interface (something must interact with it)
  if (detectedComponents.length === 1) {
    detectedComponents.push({
      id: crypto.randomUUID(),
      name: "Application Interface",
      type: "user-interface",
      description: "Application interface interacting with the AI service",
      technologies: [],
      isExternalFacing: true,
    })
  }

  // Infer data flows between detected components
  const dataFlows: SystemArchitecture["dataFlows"] = []
  const byType = (t: string) => detectedComponents.find((c) => c.type === t)

  const ui = byType("user-interface")
  const gateway = byType("api-gateway")
  const llm = byType("llm-endpoint")
  const rag = byType("rag-database")
  const vector = byType("vector-store")
  const pipeline = byType("data-pipeline")
  const storage = byType("storage")
  const ext = byType("external-api")
  const auth = byType("auth-service")

  const addFlow = (source: SystemArchitecture["components"][0] | undefined, target: SystemArchitecture["components"][0] | undefined, label: string) => {
    if (source && target) {
      dataFlows.push({
        id: crypto.randomUUID(),
        sourceId: source.id,
        targetId: target.id,
        label,
        dataType: "application/json",
        isEncrypted: true,
      })
    }
  }

  // Build logical flow chain
  if (ui && gateway) {
    addFlow(ui, gateway, "User requests")
  } else if (ui && llm) {
    addFlow(ui, llm, "User queries")
  }
  if (gateway && llm) addFlow(gateway, llm, "Forwarded requests")
  if (gateway && auth) addFlow(gateway, auth, "Auth verification")
  if (llm && rag) addFlow(llm, rag, "Context retrieval")
  if (rag && vector) addFlow(rag, vector, "Vector search")
  if (llm && ext) addFlow(llm, ext, "Tool calls")
  if (pipeline && vector) addFlow(pipeline, vector, "Embedding ingestion")
  if (pipeline && storage) addFlow(pipeline, storage, "Data read")
  if (llm && storage) addFlow(llm, storage, "Data access")

  // Extract a system name from the first sentence or use generic
  const firstSentence = text.split(/[.\n!?]/)[0].trim()
  const systemName = firstSentence.length > 5 && firstSentence.length < 80
    ? firstSentence
    : "User-Described AI System"

  return {
    id: crypto.randomUUID(),
    name: systemName,
    description: text.trim(),
    components: detectedComponents,
    dataFlows,
    trustBoundaries: [],
    createdAt: new Date().toISOString(),
  }
}

// ----------------------------------------------------------------
// Dynamic mock threat generation based on actual user-provided system
// ----------------------------------------------------------------

interface ThreatTemplate {
  titleTemplate: string
  descriptionTemplate: string
  severity: Severity
  attackVector: string
  impact: string
  likelihood: Threat["likelihood"]
  owaspIds: string[]
  strideCategories: Threat["strideMappings"][0]["category"][]
  atlasTactics: { tacticId: string; tacticName: string; techniqueId?: string; techniqueName?: string }[]
  mitigations: { title: string; description: string; priority: Severity; effort: "low" | "medium" | "high" }[]
  appliesTo: (system: SystemArchitecture) => string[]  // returns affected component IDs
}

const THREAT_TEMPLATES: ThreatTemplate[] = [
  // --- Prompt injection (applies when LLM endpoint exists) ---
  {
    titleTemplate: "Prompt Injection via {component}",
    descriptionTemplate: "Attackers can manipulate inputs to {component} to override system instructions, extract sensitive data, or cause unintended LLM behavior. This is especially dangerous for external-facing entry points.",
    severity: "critical",
    attackVector: "Crafted user inputs containing malicious instructions injected through the application's input channels",
    impact: "Complete control over LLM output, potential data exfiltration, bypassing safety guardrails",
    likelihood: "likely",
    owaspIds: ["LLM01"],
    strideCategories: ["tampering", "elevation-of-privilege"],
    atlasTactics: [{ tacticId: "AML.TA0003", tacticName: "Initial Access", techniqueId: "AML.T0051", techniqueName: "LLM Prompt Injection" }],
    mitigations: [
      { title: "Input validation and sanitization", description: "Filter and sanitize all user inputs before they reach the LLM.", priority: "critical", effort: "medium" },
      { title: "Separate system and user prompts", description: "Use clear delimiters and instruction hierarchy to prevent user input from overriding system behavior.", priority: "critical", effort: "low" },
    ],
    appliesTo: (sys) => {
      const llms = sys.components.filter((c) => c.type === "llm-endpoint")
      const externals = sys.components.filter((c) => c.isExternalFacing)
      return [...llms, ...externals].map((c) => c.id)
    },
  },
  // --- System prompt leakage (applies when LLM exists) ---
  {
    titleTemplate: "System Prompt Leakage from {component}",
    descriptionTemplate: "The system prompt for {component} can be extracted through carefully crafted queries, revealing business logic, guardrails, and potentially sensitive configuration.",
    severity: "high",
    attackVector: "Direct user queries designed to trick the LLM into revealing its system prompt via role-play or instruction override",
    impact: "Exposure of proprietary business logic, safety guardrails, and potential credential leakage",
    likelihood: "very-likely",
    owaspIds: ["LLM07"],
    strideCategories: ["information-disclosure"],
    atlasTactics: [{ tacticId: "AML.TA0009", tacticName: "Collection", techniqueId: "AML.T0025", techniqueName: "Exfiltration via ML Inference API" }],
    mitigations: [
      { title: "Avoid secrets in system prompts", description: "Never put API keys, credentials, or sensitive logic directly in system prompts.", priority: "high", effort: "low" },
      { title: "Prompt protection instructions", description: "Add meta-instructions telling the model to refuse revealing its system prompt.", priority: "high", effort: "low" },
    ],
    appliesTo: (sys) => sys.components.filter((c) => c.type === "llm-endpoint").map((c) => c.id),
  },
  // --- RAG / vector store poisoning ---
  {
    titleTemplate: "Embedding Poisoning in {component}",
    descriptionTemplate: "An attacker with access to the document pipeline could inject adversarial documents into {component}, manipulating retrieval results to surface attacker-controlled content.",
    severity: "high",
    attackVector: "Submitting adversarial documents optimized to occupy key positions in the embedding space",
    impact: "Manipulation of retrieval results, serving attacker-controlled context to the LLM",
    likelihood: "possible",
    owaspIds: ["LLM08"],
    strideCategories: ["tampering"],
    atlasTactics: [{ tacticId: "AML.TA0005", tacticName: "Execution", techniqueId: "AML.T0020", techniqueName: "Poison Training Data" }],
    mitigations: [
      { title: "Access controls on document ingestion", description: "Restrict who can submit documents and implement approval workflows.", priority: "high", effort: "medium" },
      { title: "Anomaly detection on embeddings", description: "Monitor for embedding vectors that are statistical outliers.", priority: "medium", effort: "high" },
    ],
    appliesTo: (sys) => sys.components.filter((c) => c.type === "vector-store" || c.type === "rag-database").map((c) => c.id),
  },
  // --- PII leakage ---
  {
    titleTemplate: "Sensitive Data Leakage via {component}",
    descriptionTemplate: "Documents or data accessible to {component} may contain PII or confidential information that gets included in LLM responses, exposing it to unauthorized users.",
    severity: "high",
    attackVector: "Crafting queries that trigger retrieval or generation of PII-containing data",
    impact: "Unauthorized disclosure of customer PII, regulatory compliance violations (GDPR, CCPA)",
    likelihood: "likely",
    owaspIds: ["LLM02"],
    strideCategories: ["information-disclosure"],
    atlasTactics: [{ tacticId: "AML.TA0013", tacticName: "LLM Abuse", techniqueId: "AML.T0054", techniqueName: "LLM Data Leakage" }],
    mitigations: [
      { title: "PII redaction in data pipeline", description: "Automatically detect and redact PII before data reaches the LLM or vector store.", priority: "high", effort: "medium" },
      { title: "Output filtering for PII patterns", description: "Scan LLM outputs for PII patterns (emails, SSNs, etc.) before returning to users.", priority: "high", effort: "medium" },
    ],
    appliesTo: (sys) => sys.components.filter((c) =>
      ["llm-endpoint", "rag-database", "vector-store", "data-pipeline", "storage"].includes(c.type)
    ).map((c) => c.id),
  },
  // --- XSS via output ---
  {
    titleTemplate: "Improper Output Handling in {component}",
    descriptionTemplate: "LLM-generated responses rendered in {component} without sanitization could execute malicious scripts (XSS) or trigger downstream injection attacks.",
    severity: "high",
    attackVector: "Indirect injection causing the LLM to output malicious HTML/JS/SQL, rendered or executed by downstream components",
    impact: "Cross-site scripting, session hijacking, SQL injection, or command injection in downstream systems",
    likelihood: "possible",
    owaspIds: ["LLM05"],
    strideCategories: ["tampering", "elevation-of-privilege"],
    atlasTactics: [{ tacticId: "AML.TA0012", tacticName: "Impact", techniqueId: "AML.T0048", techniqueName: "Erode ML Model Integrity" }],
    mitigations: [
      { title: "Treat LLM output as untrusted", description: "HTML-encode all LLM outputs before rendering in any frontend or passing to downstream systems.", priority: "high", effort: "low" },
      { title: "Content Security Policy", description: "Implement strict CSP headers to prevent inline script execution.", priority: "medium", effort: "low" },
    ],
    appliesTo: (sys) => sys.components.filter((c) => c.type === "user-interface").map((c) => c.id),
  },
  // --- Denial of wallet ---
  {
    titleTemplate: "Unbounded Consumption via {component}",
    descriptionTemplate: "Attackers can craft requests through {component} that cause excessive token consumption at the LLM endpoint, leading to unexpectedly high API costs (denial-of-wallet).",
    severity: "medium",
    attackVector: "Automated requests with prompts designed to maximize output token generation or trigger expensive operations",
    impact: "Significant financial cost, potential service disruption if spending limits are hit",
    likelihood: "likely",
    owaspIds: ["LLM10"],
    strideCategories: ["denial-of-service"],
    atlasTactics: [{ tacticId: "AML.TA0012", tacticName: "Impact", techniqueId: "AML.T0029", techniqueName: "Denial of ML Service" }],
    mitigations: [
      { title: "Per-user rate limiting and token budgets", description: "Limit tokens per request and total usage per user per time period.", priority: "high", effort: "medium" },
      { title: "Cost monitoring and alerts", description: "Set up real-time cost monitoring with automated alerts for anomalous usage.", priority: "medium", effort: "low" },
    ],
    appliesTo: (sys) => {
      const gateways = sys.components.filter((c) => c.type === "api-gateway")
      const llms = sys.components.filter((c) => c.type === "llm-endpoint")
      return [...gateways, ...llms].map((c) => c.id)
    },
  },
  // --- Spoofing / auth weakness ---
  {
    titleTemplate: "Authentication Bypass at {component}",
    descriptionTemplate: "Weak or missing authentication on {component} could allow unauthorized users to access the system, impersonate legitimate users, or bypass access controls.",
    severity: "medium",
    attackVector: "Forging authentication tokens, exploiting weak session management, or accessing unprotected endpoints",
    impact: "Unauthorized access, impersonation of legitimate users, data theft",
    likelihood: "possible",
    owaspIds: [],
    strideCategories: ["spoofing"],
    atlasTactics: [{ tacticId: "AML.TA0003", tacticName: "Initial Access", techniqueId: "AML.T0049", techniqueName: "Exploit Public-Facing ML Application" }],
    mitigations: [
      { title: "Strong authentication enforcement", description: "Enforce strong auth (OAuth 2.0, JWT with RS256) on all external-facing endpoints.", priority: "medium", effort: "medium" },
    ],
    appliesTo: (sys) => sys.components.filter((c) =>
      c.isExternalFacing || c.type === "api-gateway" || c.type === "auth-service"
    ).map((c) => c.id),
  },
  // --- Missing audit trail ---
  {
    titleTemplate: "Missing Audit Trail for {component}",
    descriptionTemplate: "Without comprehensive logging of interactions with {component}, it is impossible to trace incidents, detect ongoing attacks, or meet compliance requirements.",
    severity: "medium",
    attackVector: "Exploiting lack of logging to perform attacks without detection or accountability",
    impact: "Inability to detect attacks, perform forensics, or satisfy audit/compliance requirements",
    likelihood: "likely",
    owaspIds: [],
    strideCategories: ["repudiation"],
    atlasTactics: [{ tacticId: "AML.TA0007", tacticName: "Defense Evasion", techniqueId: "AML.T0036", techniqueName: "Evade ML Model" }],
    mitigations: [
      { title: "Comprehensive interaction logging", description: "Log all prompts, retrievals, and LLM responses with timestamps and user IDs.", priority: "medium", effort: "medium" },
    ],
    appliesTo: (sys) => sys.components.filter((c) =>
      ["llm-endpoint", "api-gateway", "data-pipeline", "rag-database"].includes(c.type)
    ).map((c) => c.id),
  },
  // --- Excessive agency ---
  {
    titleTemplate: "Excessive Agency via {component}",
    descriptionTemplate: "If {component} grants the LLM broad tool-use or action capabilities, it could be manipulated through prompt injection to perform unintended write operations, API calls, or data modifications.",
    severity: "high",
    attackVector: "Prompt injection exploiting tool-use to execute unauthorized operations via the LLM agent",
    impact: "Unauthorized data access, system modification, or external API abuse",
    likelihood: "possible",
    owaspIds: ["LLM06"],
    strideCategories: ["elevation-of-privilege"],
    atlasTactics: [{ tacticId: "AML.TA0014", tacticName: "Agentic Threats", techniqueId: "AML.T0055", techniqueName: "Agent Tool Abuse" }],
    mitigations: [
      { title: "Least-privilege tool access", description: "Only grant the LLM access to tools it strictly needs. Use read-only where possible.", priority: "high", effort: "low" },
      { title: "Human approval for sensitive actions", description: "Require human confirmation before executing write operations or external calls.", priority: "medium", effort: "medium" },
    ],
    appliesTo: (sys) => sys.components.filter((c) =>
      c.type === "llm-endpoint" || c.type === "external-api"
    ).map((c) => c.id),
  },
  // --- Supply chain ---
  {
    titleTemplate: "Supply Chain Risk in {component}",
    descriptionTemplate: "Third-party dependencies used by {component} (models, libraries, APIs) introduce supply chain risk. Compromised dependencies could degrade performance or introduce vulnerabilities.",
    severity: "low",
    attackVector: "Compromised third-party model, library, or API introducing backdoors or vulnerabilities",
    impact: "Degraded quality, potential backdoor, dependency on external service stability",
    likelihood: "unlikely",
    owaspIds: ["LLM03"],
    strideCategories: ["tampering"],
    atlasTactics: [{ tacticId: "AML.TA0015", tacticName: "Supply Chain", techniqueId: "AML.T0058", techniqueName: "Compromised Model Repository" }],
    mitigations: [
      { title: "Pin dependency versions", description: "Use specific model/library versions and test thoroughly before upgrading.", priority: "low", effort: "low" },
    ],
    appliesTo: (sys) => sys.components.filter((c) =>
      c.type === "llm-endpoint" || c.type === "vector-store" || c.type === "data-pipeline"
    ).map((c) => c.id),
  },
  // --- Hallucination / misinformation ---
  {
    titleTemplate: "Misinformation from {component}",
    descriptionTemplate: "{component} may generate fabricated information (hallucinations) that users could trust and act upon, especially for queries where grounding data is sparse.",
    severity: "medium",
    attackVector: "Queries on topics with sparse context causing the model to generate plausible but false information",
    impact: "Customer misinformation, incorrect actions, potential legal liability",
    likelihood: "likely",
    owaspIds: ["LLM09"],
    strideCategories: [],
    atlasTactics: [{ tacticId: "AML.TA0013", tacticName: "LLM Abuse", techniqueId: "AML.T0053", techniqueName: "LLM Malicious Output" }],
    mitigations: [
      { title: "Source attribution in responses", description: "Include references to source documents so users can verify claims.", priority: "medium", effort: "medium" },
    ],
    appliesTo: (sys) => sys.components.filter((c) => c.type === "llm-endpoint").map((c) => c.id),
  },
  // --- Unencrypted data flow ---
  {
    titleTemplate: "Unencrypted Data in Transit",
    descriptionTemplate: "One or more data flows in the system lack encryption, allowing attackers to intercept sensitive data including user queries, model responses, or credentials.",
    severity: "high",
    attackVector: "Network sniffing or man-in-the-middle attacks on unencrypted communication channels",
    impact: "Interception of sensitive data, credential theft, data manipulation in transit",
    likelihood: "possible",
    owaspIds: [],
    strideCategories: ["information-disclosure", "tampering"],
    atlasTactics: [],
    mitigations: [
      { title: "Enforce TLS on all data flows", description: "Ensure all communication channels use TLS 1.2+ encryption.", priority: "high", effort: "low" },
    ],
    appliesTo: (sys) => {
      const unencryptedFlows = sys.dataFlows.filter((f) => !f.isEncrypted)
      if (unencryptedFlows.length === 0) return []
      const compIds = new Set<string>()
      for (const f of unencryptedFlows) {
        compIds.add(f.sourceId)
        compIds.add(f.targetId)
      }
      return Array.from(compIds)
    },
  },
]

function generateMockThreats(system: SystemArchitecture): Threat[] {
  const threats: Threat[] = []
  let threatIndex = 0

  const owaspNames: Record<string, string> = {
    LLM01: "Prompt Injection",
    LLM02: "Sensitive Information Disclosure",
    LLM03: "Supply Chain Vulnerabilities",
    LLM04: "Data and Model Poisoning",
    LLM05: "Improper Output Handling",
    LLM06: "Excessive Agency",
    LLM07: "System Prompt Leakage",
    LLM08: "Vector and Embedding Weaknesses",
    LLM09: "Misinformation",
    LLM10: "Unbounded Consumption",
  }

  for (const template of THREAT_TEMPLATES) {
    const affectedIds = template.appliesTo(system)
    if (affectedIds.length === 0) continue

    threatIndex++
    // Pick a representative component name for the title
    const primaryComp = system.components.find((c) => c.id === affectedIds[0])
    const compName = primaryComp?.name ?? "System"

    const mitigations: Mitigation[] = template.mitigations.map((m, j) => ({
      id: `m-${threatIndex}-${j}`,
      title: m.title,
      description: m.description,
      priority: m.priority,
      effort: m.effort,
      frameworks: [
        ...(template.owaspIds.length > 0 ? ["owasp-llm" as FrameworkType] : []),
        ...(template.strideCategories.length > 0 ? ["stride" as FrameworkType] : []),
        ...(template.atlasTactics.length > 0 ? ["mitre-atlas" as FrameworkType] : []),
      ],
    }))

    threats.push({
      id: `t-${String(threatIndex).padStart(3, "0")}`,
      title: template.titleTemplate.replace("{component}", compName),
      description: template.descriptionTemplate.replace(/\{component\}/g, compName),
      severity: template.severity,
      affectedComponentIds: [...new Set(affectedIds)],
      attackVector: template.attackVector,
      impact: template.impact,
      likelihood: template.likelihood,
      owaspMappings: template.owaspIds.map((id) => ({
        id,
        name: owaspNames[id] ?? id,
        relevance: 80 + Math.floor(Math.random() * 15),
      })),
      strideMappings: template.strideCategories.map((cat) => ({
        category: cat,
        relevance: 70 + Math.floor(Math.random() * 20),
      })),
      atlasMappings: template.atlasTactics.map((t) => ({
        tacticId: t.tacticId,
        tacticName: t.tacticName,
        techniqueId: t.techniqueId,
        techniqueName: t.techniqueName,
        relevance: 70 + Math.floor(Math.random() * 20),
      })),
      mitigations,
    })
  }

  return threats
}

function computeRiskScore(threats: Threat[]): ThreatAnalysisResult["riskScore"] {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 }
  for (const t of threats) counts[t.severity]++

  const overall = Math.min(
    100,
    counts.critical * 20 + counts.high * 12 + counts.medium * 6 + counts.low * 2
  )

  const owaspThreats = threats.filter((t) => t.owaspMappings.length > 0)
  const strideThreats = threats.filter((t) => t.strideMappings.length > 0)
  const atlasThreats = threats.filter((t) => t.atlasMappings.length > 0)

  const fwScore = (arr: Threat[]) =>
    arr.length === 0
      ? 0
      : Math.min(100, arr.reduce((sum, t) => {
          const w = t.severity === "critical" ? 25 : t.severity === "high" ? 15 : t.severity === "medium" ? 8 : 3
          return sum + w
        }, 0))

  return {
    overall,
    byFramework: {
      owasp: fwScore(owaspThreats),
      stride: fwScore(strideThreats),
      atlas: fwScore(atlasThreats),
    },
    bySeverity: counts,
  }
}

function generateExecutiveSummary(system: SystemArchitecture, threats: Threat[], riskScore: ThreatAnalysisResult["riskScore"]): string {
  const riskLevel =
    riskScore.overall >= 75 ? "critical" :
    riskScore.overall >= 50 ? "high" :
    riskScore.overall >= 25 ? "moderate" : "low"

  const externalComps = system.components.filter((c) => c.isExternalFacing).map((c) => c.name)
  const topThreats = threats.filter((t) => t.severity === "critical" || t.severity === "high")

  return `The ${system.name} system presents a ${riskLevel} risk profile with ${threats.length} identified threats across OWASP LLM Top 10, STRIDE, and MITRE ATLAS frameworks. ` +
    `${riskScore.bySeverity.critical} critical and ${riskScore.bySeverity.high} high severity threats require immediate attention. ` +
    (externalComps.length > 0
      ? `The external-facing components (${externalComps.join(", ")}) create the primary attack surface. `
      : "") +
    (topThreats.length > 0
      ? `Key threats include: ${topThreats.slice(0, 3).map((t) => t.title).join("; ")}. `
      : "") +
    `Immediate priorities should focus on input validation, output sanitization, and access control enforcement across all components.`
}

async function runMockAnalysis(system: SystemArchitecture): Promise<ThreatAnalysisResult> {
  updateStatus("parsing-input", 10)
  await simulateDelay(1000)

  updateStatus("analyzing-owasp", 30)
  await simulateDelay(1200)

  updateStatus("analyzing-stride", 50)
  await simulateDelay(1100)

  updateStatus("analyzing-atlas", 70)
  await simulateDelay(1000)

  updateStatus("correlating", 90)
  await simulateDelay(800)

  const threats = generateMockThreats(system)
  const riskScore = computeRiskScore(threats)
  const executiveSummary = generateExecutiveSummary(system, threats, riskScore)

  return {
    id: `analysis-mock-${Date.now()}`,
    systemId: system.id,
    threats,
    riskScore,
    executiveSummary,
    analyzedAt: new Date().toISOString(),
    isLiveAnalysis: false,
    frameworksCovered: ["owasp-llm", "stride", "mitre-atlas"],
  }
}

async function callClaude(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const client = createClient(apiKey)
  let fullText = ""

  await streamAnalysis({
    client,
    systemPrompt,
    userPrompt,
    onChunk: (chunk) => {
      useAnalysisStore.getState().appendStreamingText(chunk)
    },
    onComplete: (text) => {
      fullText = text
    },
    onError: (error) => {
      throw error
    },
  })

  return fullText
}

async function runLiveAnalysis(
  system: SystemArchitecture,
  apiKey: string
): Promise<ThreatAnalysisResult> {
  const store = useAnalysisStore.getState()

  updateStatus("analyzing-owasp", 15)
  store.clearStreamingText()
  const owaspPrompt = buildOwaspPrompt(system)
  const owaspRaw = await callClaude(apiKey, owaspPrompt.system, owaspPrompt.user)
  updateStatus("analyzing-owasp", 30)

  updateStatus("analyzing-stride", 35)
  store.clearStreamingText()
  const stridePrompt = buildStridePrompt(system)
  const strideRaw = await callClaude(apiKey, stridePrompt.system, stridePrompt.user)
  updateStatus("analyzing-stride", 55)

  updateStatus("analyzing-atlas", 60)
  store.clearStreamingText()
  const atlasPrompt = buildAtlasPrompt(system)
  const atlasRaw = await callClaude(apiKey, atlasPrompt.system, atlasPrompt.user)
  updateStatus("analyzing-atlas", 75)

  updateStatus("correlating", 80)
  store.clearStreamingText()
  const corrPrompt = buildCorrelationPrompt(owaspRaw, strideRaw, atlasRaw, system)
  const corrRaw = await callClaude(apiKey, corrPrompt.system, corrPrompt.user)
  updateStatus("correlating", 95)

  const parsed = parseJsonResponse<{
    executiveSummary: string
    riskScore: {
      overall: number
      byFramework: { owasp: number; stride: number; atlas: number }
      bySeverity: { critical: number; high: number; medium: number; low: number }
    }
    threats: Array<{
      title: string
      description: string
      severity: string
      affectedComponents: string[]
      attackVector: string
      impact: string
      likelihood: string
      owaspMappings: Array<{ id: string; name: string; relevance: number }>
      strideMappings: Array<{ category: string; relevance: number }>
      atlasMappings: Array<{
        tacticId: string
        tacticName: string
        techniqueId: string | null
        techniqueName: string | null
        relevance: number
      }>
      mitigations: Array<{
        title: string
        description: string
        priority: string
        effort: string
        frameworks: string[]
      }>
    }>
  }>(corrRaw)

  const threats: Threat[] = parsed.threats.map((t, i) => ({
    id: `live-t-${i + 1}`,
    title: t.title,
    description: t.description,
    severity: t.severity as Threat["severity"],
    affectedComponentIds: t.affectedComponents.map((name) => {
      const comp = system.components.find(
        (c) => c.name.toLowerCase() === name.toLowerCase()
      )
      return comp?.id ?? name
    }),
    attackVector: t.attackVector,
    impact: t.impact,
    likelihood: t.likelihood as Threat["likelihood"],
    owaspMappings: t.owaspMappings.map((m) => ({
      id: m.id,
      name: m.name,
      relevance: m.relevance,
    })),
    strideMappings: t.strideMappings.map((m) => ({
      category: m.category as Threat["strideMappings"][0]["category"],
      relevance: m.relevance,
    })),
    atlasMappings: t.atlasMappings.map((m) => ({
      tacticId: m.tacticId,
      tacticName: m.tacticName,
      techniqueId: m.techniqueId ?? undefined,
      techniqueName: m.techniqueName ?? undefined,
      relevance: m.relevance,
    })),
    mitigations: t.mitigations.map((m, j) => ({
      id: `live-m-${i}-${j}`,
      title: m.title,
      description: m.description,
      priority: m.priority as Threat["severity"],
      effort: m.effort as "low" | "medium" | "high",
      frameworks: m.frameworks as FrameworkType[],
    })),
  }))

  return {
    id: `analysis-live-${Date.now()}`,
    systemId: system.id,
    threats,
    riskScore: parsed.riskScore,
    executiveSummary: parsed.executiveSummary,
    analyzedAt: new Date().toISOString(),
    isLiveAnalysis: true,
    frameworksCovered: ["owasp-llm", "stride", "mitre-atlas"],
  }
}

export async function runThreatAnalysis(): Promise<void> {
  const store = useAnalysisStore.getState()
  const settings = useSettingsStore.getState()
  const systemStore = useSystemStore.getState()

  // Guard: must have valid input
  const hasInput =
    systemStore.inputMode === "freeform"
      ? systemStore.freeformText.trim().length > 20
      : systemStore.architecture !== null && systemStore.architecture.components.length > 0

  if (!hasInput) {
    store.setError("No system input provided. Please define your system architecture first.")
    store.setStatus("error")
    return
  }

  store.setStatus("parsing-input")
  store.setProgress(5)
  store.setError(null)

  try {
    let system: SystemArchitecture

    if (systemStore.inputMode === "freeform") {
      // Parse freeform text to infer architecture from keywords
      system = parseFreeformToArchitecture(systemStore.freeformText)
      systemStore.setArchitecture(system)
    } else {
      system = systemStore.architecture!
    }

    let result: ThreatAnalysisResult

    if (settings.isLiveMode && settings.apiKey) {
      result = await runLiveAnalysis(system, settings.apiKey)
    } else {
      result = await runMockAnalysis(system)
    }

    store.setResult(result)
    store.setStatus("complete")
    store.setProgress(100)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed"
    store.setError(message)
    store.setStatus("error")
    store.setProgress(0)
  }
}
