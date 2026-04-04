import type { AtlasTactic } from "@/types/framework"

export const MITRE_ATLAS_TACTICS: AtlasTactic[] = [
  {
    id: "AML.TA0001",
    name: "Reconnaissance",
    description: "Gathering information about the target AI system to plan an attack.",
    techniques: [
      { id: "AML.T0000", name: "Search for Victim's Publicly Available AI Models", description: "Identifying publicly available models used by the target.", tacticId: "AML.TA0001" },
      { id: "AML.T0016", name: "Obtain Capabilities", description: "Acquiring tools, models, or infrastructure for attacking AI systems.", tacticId: "AML.TA0001" },
      { id: "AML.T0046", name: "Active Scanning of ML Model", description: "Probing the ML model to understand its behavior and boundaries.", tacticId: "AML.TA0001" },
    ],
  },
  {
    id: "AML.TA0002",
    name: "Resource Development",
    description: "Establishing resources to support AI attack operations.",
    techniques: [
      { id: "AML.T0017", name: "Develop Adversarial ML Attack Capabilities", description: "Creating tools and techniques for adversarial ML attacks.", tacticId: "AML.TA0002" },
      { id: "AML.T0018", name: "Acquire Public ML Artifacts", description: "Obtaining public ML models, datasets, and tools for attack preparation.", tacticId: "AML.TA0002" },
    ],
  },
  {
    id: "AML.TA0003",
    name: "Initial Access",
    description: "Gaining initial entry to the AI system or its supply chain.",
    techniques: [
      { id: "AML.T0019", name: "Supply Chain Compromise of ML Artifacts", description: "Compromising ML supply chain components like pre-trained models.", tacticId: "AML.TA0003" },
      { id: "AML.T0051", name: "LLM Prompt Injection", description: "Injecting malicious instructions through direct or indirect prompt manipulation.", tacticId: "AML.TA0003" },
      { id: "AML.T0049", name: "Exploit Public-Facing ML Application", description: "Exploiting vulnerabilities in deployed ML applications.", tacticId: "AML.TA0003" },
    ],
  },
  {
    id: "AML.TA0004",
    name: "ML Model Access",
    description: "Gaining access to the ML model for further exploitation.",
    techniques: [
      { id: "AML.T0034", name: "ML-Enabled Product or Service", description: "Accessing ML through a product or service that uses it.", tacticId: "AML.TA0004" },
      { id: "AML.T0035", name: "ML Model Inference API Access", description: "Gaining access to the model's inference API.", tacticId: "AML.TA0004" },
    ],
  },
  {
    id: "AML.TA0005",
    name: "Execution",
    description: "Running adversarial techniques against the ML system.",
    techniques: [
      { id: "AML.T0020", name: "Poison Training Data", description: "Injecting malicious data into model training pipelines.", tacticId: "AML.TA0005" },
      { id: "AML.T0043", name: "Adversarial ML Attack on Production Model", description: "Executing adversarial attacks against a deployed ML model.", tacticId: "AML.TA0005" },
    ],
  },
  {
    id: "AML.TA0006",
    name: "Persistence",
    description: "Maintaining presence and access within the AI system.",
    techniques: [
      { id: "AML.T0020.001", name: "Poison Training Data - Label Manipulation", description: "Altering labels in training data to create persistent backdoors.", tacticId: "AML.TA0006" },
      { id: "AML.T0039", name: "Backdoor ML Model", description: "Inserting persistent backdoors into ML models.", tacticId: "AML.TA0006" },
    ],
  },
  {
    id: "AML.TA0007",
    name: "Defense Evasion",
    description: "Avoiding detection by AI security mechanisms.",
    techniques: [
      { id: "AML.T0036", name: "Evade ML Model", description: "Crafting inputs that evade the model's detection capabilities.", tacticId: "AML.TA0007" },
      { id: "AML.T0052", name: "LLM Jailbreak", description: "Bypassing safety guardrails through jailbreak techniques.", tacticId: "AML.TA0007" },
    ],
  },
  {
    id: "AML.TA0008",
    name: "Discovery",
    description: "Understanding the AI system's architecture and capabilities.",
    techniques: [
      { id: "AML.T0044", name: "Discover ML Model Ontology", description: "Identifying the model's classification categories or capabilities.", tacticId: "AML.TA0008" },
      { id: "AML.T0042", name: "Verify ML Model Attack", description: "Confirming that an adversarial attack was successful.", tacticId: "AML.TA0008" },
    ],
  },
  {
    id: "AML.TA0009",
    name: "Collection",
    description: "Gathering data and outputs from the AI system.",
    techniques: [
      { id: "AML.T0025", name: "Exfiltration via ML Inference API", description: "Extracting information through repeated model queries.", tacticId: "AML.TA0009" },
      { id: "AML.T0024", name: "Data from Information Repositories", description: "Collecting data from connected data stores and repositories.", tacticId: "AML.TA0009" },
    ],
  },
  {
    id: "AML.TA0010",
    name: "ML Attack Staging",
    description: "Preparing and optimizing adversarial attacks before execution.",
    techniques: [
      { id: "AML.T0040", name: "ML Model Inference API Exploitation Staging", description: "Preparing attacks that exploit the inference API.", tacticId: "AML.TA0010" },
      { id: "AML.T0022", name: "Craft Adversarial Data", description: "Creating specially crafted inputs to exploit ML model weaknesses.", tacticId: "AML.TA0010" },
    ],
  },
  {
    id: "AML.TA0011",
    name: "Exfiltration",
    description: "Stealing data, models, or intellectual property from the AI system.",
    techniques: [
      { id: "AML.T0024.001", name: "Exfiltrate Training Data", description: "Extracting training data from the ML system.", tacticId: "AML.TA0011" },
      { id: "AML.T0037", name: "Model Extraction", description: "Stealing the ML model through query-based extraction.", tacticId: "AML.TA0011" },
    ],
  },
  {
    id: "AML.TA0012",
    name: "Impact",
    description: "Causing negative outcomes through AI system manipulation.",
    techniques: [
      { id: "AML.T0029", name: "Denial of ML Service", description: "Making the ML service unavailable through resource exhaustion.", tacticId: "AML.TA0012" },
      { id: "AML.T0048", name: "Erode ML Model Integrity", description: "Degrading model performance or causing unreliable outputs.", tacticId: "AML.TA0012" },
      { id: "AML.T0047", name: "ML Intellectual Property Theft", description: "Stealing proprietary ML models or training methodologies.", tacticId: "AML.TA0012" },
    ],
  },
  {
    id: "AML.TA0013",
    name: "LLM Abuse",
    description: "Misusing LLM capabilities for malicious purposes.",
    techniques: [
      { id: "AML.T0054", name: "LLM Data Leakage", description: "Exploiting LLMs to leak sensitive training or context data.", tacticId: "AML.TA0013" },
      { id: "AML.T0053", name: "LLM Malicious Output", description: "Causing LLMs to generate harmful, biased, or misleading content.", tacticId: "AML.TA0013" },
    ],
  },
  {
    id: "AML.TA0014",
    name: "Agentic Threats",
    description: "Threats specific to autonomous AI agents operating across tools and services.",
    techniques: [
      { id: "AML.T0055", name: "Agent Tool Abuse", description: "Manipulating AI agent tool-use to perform unauthorized actions.", tacticId: "AML.TA0014" },
      { id: "AML.T0056", name: "Agent Memory Manipulation", description: "Poisoning agent memory to influence future decisions.", tacticId: "AML.TA0014" },
      { id: "AML.T0057", name: "Agent Identity Spoofing", description: "Spoofing agent identities to gain unauthorized access.", tacticId: "AML.TA0014" },
    ],
  },
  {
    id: "AML.TA0015",
    name: "Supply Chain",
    description: "Compromising the AI supply chain including models, data, and infrastructure.",
    techniques: [
      { id: "AML.T0058", name: "Compromised Model Repository", description: "Distributing malicious models through public repositories.", tacticId: "AML.TA0015" },
      { id: "AML.T0059", name: "Compromised Training Pipeline", description: "Attacking the model training infrastructure.", tacticId: "AML.TA0015" },
    ],
  },
  {
    id: "AML.TA0016",
    name: "Privilege Escalation",
    description: "Gaining elevated permissions within the AI system or its supporting infrastructure.",
    techniques: [
      { id: "AML.T0060", name: "LLM Permission Escalation", description: "Using prompt techniques to escalate LLM agent permissions.", tacticId: "AML.TA0016" },
      { id: "AML.T0061", name: "Tool Permission Bypass", description: "Bypassing tool access controls through indirect manipulation.", tacticId: "AML.TA0016" },
    ],
  },
]
