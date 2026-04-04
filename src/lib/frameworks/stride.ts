import type { StrideCategory } from "@/types/framework"

export const STRIDE_CATEGORIES: StrideCategory[] = [
  {
    id: "spoofing",
    name: "Spoofing",
    description:
      "Impersonating a user, system, or component to gain unauthorized access. In AI systems, this includes model impersonation and identity spoofing through prompt manipulation.",
    securityProperty: "Authentication",
    aiSpecificExamples: [
      "Impersonating an admin user through prompt injection",
      "Spoofing model API endpoints to intercept requests",
      "Forging authentication tokens for LLM agent tool access",
      "Impersonating a trusted data source in RAG pipelines",
    ],
  },
  {
    id: "tampering",
    name: "Tampering",
    description:
      "Unauthorized modification of data, code, or system behavior. In AI systems, this includes training data poisoning, model weight manipulation, and prompt tampering.",
    securityProperty: "Integrity",
    aiSpecificExamples: [
      "Poisoning training data to introduce backdoors",
      "Modifying embeddings in vector stores",
      "Tampering with prompt templates in transit",
      "Altering RAG retrieval results before LLM processing",
    ],
  },
  {
    id: "repudiation",
    name: "Repudiation",
    description:
      "Denying that an action was performed, making it impossible to trace or audit. In AI systems, this includes unlogged LLM interactions and untraceable model decisions.",
    securityProperty: "Non-repudiation",
    aiSpecificExamples: [
      "Unlogged prompt injection attempts",
      "Missing audit trails for LLM-initiated actions",
      "Inability to trace which RAG documents influenced a response",
      "Lack of provenance for model-generated outputs",
    ],
  },
  {
    id: "information-disclosure",
    name: "Information Disclosure",
    description:
      "Exposure of information to unauthorized parties. In AI systems, this includes training data extraction, system prompt leakage, and PII disclosure through model outputs.",
    securityProperty: "Confidentiality",
    aiSpecificExamples: [
      "Extracting training data through targeted prompts",
      "System prompt leakage via jailbreak techniques",
      "PII exposure from RAG context documents",
      "Model architecture details revealed through probing",
    ],
  },
  {
    id: "denial-of-service",
    name: "Denial of Service",
    description:
      "Making a system or service unavailable. In AI systems, this includes resource exhaustion through token abuse, model overloading, and denial-of-wallet attacks.",
    securityProperty: "Availability",
    aiSpecificExamples: [
      "Token exhaustion attacks (denial-of-wallet)",
      "Recursive prompt loops consuming GPU resources",
      "Overwhelming vector store with ingestion requests",
      "API rate limit bypass through distributed requests",
    ],
  },
  {
    id: "elevation-of-privilege",
    name: "Elevation of Privilege",
    description:
      "Gaining elevated access beyond authorized permissions. In AI systems, this includes prompt injection to bypass guardrails and escalating LLM agent permissions.",
    securityProperty: "Authorization",
    aiSpecificExamples: [
      "Prompt injection to bypass content safety filters",
      "Escalating LLM agent from read-only to write access",
      "Using jailbreaks to override model safety training",
      "Exploiting tool-use to access unauthorized APIs",
    ],
  },
]
