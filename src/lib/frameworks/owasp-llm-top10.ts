import type { OwaspLlmCategory } from "@/types/framework"

export const OWASP_LLM_TOP_10: OwaspLlmCategory[] = [
  {
    id: "LLM01",
    name: "Prompt Injection",
    description:
      "Manipulating LLM inputs to override instructions, extract data, or trigger unintended behaviors through direct or indirect injection.",
    exampleAttacks: [
      "Direct prompt injection to bypass system instructions",
      "Indirect injection via poisoned RAG documents",
      "Prompt leaking to extract system prompts",
    ],
    mitigationStrategies: [
      "Input validation and sanitization",
      "Privilege separation between system and user prompts",
      "Output filtering and monitoring",
      "Human-in-the-loop for sensitive actions",
    ],
  },
  {
    id: "LLM02",
    name: "Sensitive Information Disclosure",
    description:
      "LLM inadvertently reveals confidential data including PII, proprietary information, or security credentials through its responses.",
    exampleAttacks: [
      "Extracting training data through targeted prompts",
      "Leaking PII from RAG context documents",
      "Revealing API keys or credentials in responses",
    ],
    mitigationStrategies: [
      "Data sanitization in training and RAG pipelines",
      "Output filtering for sensitive patterns",
      "Access controls on retrieval data sources",
      "Regular audits of model outputs",
    ],
  },
  {
    id: "LLM03",
    name: "Supply Chain Vulnerabilities",
    description:
      "Risks from third-party components including pre-trained models, training data, plugins, and dependencies that may be compromised.",
    exampleAttacks: [
      "Using backdoored pre-trained models from public repositories",
      "Compromised training datasets with hidden biases",
      "Malicious plugins or extensions in LLM toolchains",
    ],
    mitigationStrategies: [
      "Verify model provenance and integrity hashes",
      "Audit third-party training data sources",
      "Pin dependency versions and scan for vulnerabilities",
      "Maintain a software bill of materials (SBOM)",
    ],
  },
  {
    id: "LLM04",
    name: "Data and Model Poisoning",
    description:
      "Tampering with training data, fine-tuning data, or embeddings to introduce vulnerabilities, biases, or backdoors into the model.",
    exampleAttacks: [
      "Poisoning fine-tuning data to create model backdoors",
      "Injecting biased training examples to skew outputs",
      "Manipulating embedding vectors in vector stores",
    ],
    mitigationStrategies: [
      "Data provenance tracking and validation",
      "Anomaly detection on training data",
      "Regular model evaluation against benchmarks",
      "Adversarial testing of fine-tuned models",
    ],
  },
  {
    id: "LLM05",
    name: "Improper Output Handling",
    description:
      "Failing to validate, sanitize, or safely handle LLM outputs before passing them to downstream systems, enabling injection attacks.",
    exampleAttacks: [
      "XSS via unsanitized LLM output rendered in web UI",
      "SQL injection through LLM-generated queries",
      "Command injection via LLM output passed to shell",
    ],
    mitigationStrategies: [
      "Treat LLM output as untrusted user input",
      "Apply context-specific output encoding",
      "Parameterize database queries from LLM output",
      "Sandbox code execution from LLM-generated code",
    ],
  },
  {
    id: "LLM06",
    name: "Excessive Agency",
    description:
      "Granting LLMs too much autonomy, access, or permissions, allowing them to perform unintended or harmful actions on behalf of users.",
    exampleAttacks: [
      "LLM agent executing destructive database operations",
      "Autonomous email sending with manipulated content",
      "File system access leading to data exfiltration",
    ],
    mitigationStrategies: [
      "Principle of least privilege for LLM tool access",
      "Human approval for high-impact actions",
      "Rate limiting and action budgets",
      "Audit logging of all LLM-initiated actions",
    ],
  },
  {
    id: "LLM07",
    name: "System Prompt Leakage",
    description:
      "Exposure of system-level instructions, guardrails, or proprietary logic embedded in system prompts to unauthorized users.",
    exampleAttacks: [
      "Direct prompts asking the model to reveal instructions",
      "Iterative probing to reconstruct system prompts",
      "Using role-play scenarios to bypass prompt protection",
    ],
    mitigationStrategies: [
      "Avoid embedding sensitive logic in system prompts",
      "Implement prompt protection instructions",
      "Monitor for prompt extraction attempts",
      "Use separate privilege layers for sensitive operations",
    ],
  },
  {
    id: "LLM08",
    name: "Vector and Embedding Weaknesses",
    description:
      "Vulnerabilities in vector databases and embedding pipelines including poisoning, unauthorized access, and retrieval manipulation.",
    exampleAttacks: [
      "Injecting malicious documents into RAG knowledge base",
      "Manipulating similarity scores to surface attacker content",
      "Unauthorized access to vector store collections",
    ],
    mitigationStrategies: [
      "Access controls on vector database operations",
      "Input validation for document ingestion",
      "Monitoring retrieval patterns for anomalies",
      "Regular auditing of vector store contents",
    ],
  },
  {
    id: "LLM09",
    name: "Misinformation",
    description:
      "LLM generating false, misleading, or fabricated information (hallucinations) that users may trust and act upon.",
    exampleAttacks: [
      "Hallucinated legal citations in legal advice systems",
      "Fabricated medical information in health chatbots",
      "Invented code libraries or API calls in coding assistants",
    ],
    mitigationStrategies: [
      "Retrieval-augmented generation for factual grounding",
      "Output confidence scoring and uncertainty indicators",
      "Human review for high-stakes outputs",
      "Clear disclaimers about AI-generated content",
    ],
  },
  {
    id: "LLM10",
    name: "Unbounded Consumption",
    description:
      "Attacks that exploit LLM resource consumption through excessive token usage, repeated requests, or resource-intensive operations.",
    exampleAttacks: [
      "Denial-of-wallet attacks via massive token generation",
      "Recursive prompt loops consuming compute resources",
      "Abuse of function calling for repeated API calls",
    ],
    mitigationStrategies: [
      "Token limits per request and per user",
      "Rate limiting and usage quotas",
      "Cost monitoring and alerting",
      "Input length validation",
    ],
  },
]
