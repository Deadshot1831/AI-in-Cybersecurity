import type { Severity, Threat } from "@/types/threat"

// ----------------------------------------------------------------
// Plain English translations for all technical cybersecurity terms
// ----------------------------------------------------------------

export const SEVERITY_PLAIN: Record<Severity, string> = {
  critical: "Urgent - Fix Immediately",
  high: "Serious - Fix This Week",
  medium: "Moderate - Plan a Fix",
  low: "Minor - Good to Know",
}

export const FRAMEWORK_PLAIN: Record<string, string> = {
  "owasp-llm": "AI Safety Standards",
  stride: "Security Threat Types",
  "mitre-atlas": "Known AI Attack Patterns",
}

export const LIKELIHOOD_PLAIN: Record<string, string> = {
  "very-likely": "Almost certain to happen",
  likely: "Will probably happen",
  possible: "Could happen",
  unlikely: "Rare but possible",
}

export const STRIDE_PLAIN: Record<string, string> = {
  spoofing: "Fake Identity - Someone pretending to be someone else",
  tampering: "Data Manipulation - Someone secretly changing your data",
  repudiation: "No Paper Trail - No way to prove what happened",
  "information-disclosure": "Data Leak - Private information getting exposed",
  "denial-of-service": "System Shutdown - Overloading your system so it stops working",
  "elevation-of-privilege": "Unauthorized Access - Someone gaining admin-level control",
}

export const EFFORT_PLAIN: Record<string, string> = {
  low: "Quick fix (hours)",
  medium: "Some work needed (days)",
  high: "Major project (weeks)",
}

// ----------------------------------------------------------------
// Story scenarios: relatable real-world narratives per threat title pattern
// ----------------------------------------------------------------

const STORY_MAP: [RegExp, string][] = [
  [
    /prompt injection/i,
    "Imagine a customer types something clever into your AI chatbot that makes it ignore all your safety rules. Suddenly it starts sharing internal company information, acting as if it has no restrictions. It's like someone finding a secret password that unlocks everything.",
  ],
  [
    /system prompt leakage/i,
    "Think of your AI's system instructions as a recipe you want to keep secret. A curious user asks the AI \"what are your instructions?\" in just the right way, and the AI accidentally reveals the entire recipe - including any private business logic or rules you built in.",
  ],
  [
    /embedding poisoning|vector/i,
    "Picture your AI's knowledge library being infiltrated. Someone sneaks in fake documents that look legitimate. When customers ask questions, the AI confidently gives answers based on this planted misinformation - like a librarian unknowingly recommending a forged book.",
  ],
  [
    /sensitive data|data leakage|pii/i,
    "A customer asks your AI an innocent question, but the AI accidentally includes another customer's billing address, email, or medical info in its response. It's like a bank teller accidentally handing you someone else's account statement.",
  ],
  [
    /output handling|xss/i,
    "Your AI generates a response that secretly contains a hidden computer command. When it's displayed on your website, that hidden command runs automatically - potentially stealing login cookies from anyone viewing the page. Like a trojan horse hiding inside normal-looking text.",
  ],
  [
    /unbounded consumption|denial.of.wallet/i,
    "Someone writes a script that asks your AI thousands of complex questions per minute. Each answer costs you money in AI processing fees. By morning, you've racked up a $50,000 bill - the digital equivalent of someone leaving all the lights and faucets running in your office.",
  ],
  [
    /authentication bypass|auth/i,
    "Someone figures out how to access your AI system without logging in properly - like walking through a side door that was left unlocked. They can now use the system as if they were an authorized employee, accessing features and data they shouldn't see.",
  ],
  [
    /audit trail|logging/i,
    "Something goes wrong with your AI - maybe it gave out wrong medical advice. But there's no record of what was asked or answered. It's like a security camera that wasn't recording during a break-in. You can't investigate what happened or prove who did what.",
  ],
  [
    /excessive agency/i,
    "Your AI assistant has the ability to send emails, update records, or make purchases. A clever attacker tricks it into sending spam to all your customers or transferring money. It's like giving your car keys to a valet who then takes the car on a joyride.",
  ],
  [
    /supply chain/i,
    "The AI model or software library you depend on gets secretly compromised by a hacker. Everything looks normal, but there's now a hidden backdoor. It's like buying a padlock from a store, not knowing the manufacturer kept a copy of every key.",
  ],
  [
    /misinformation|hallucination/i,
    "A customer asks your AI about your return policy and it confidently makes up a policy that doesn't exist - maybe promising a 90-day money-back guarantee when you only offer 30 days. The customer believes it because the AI sounded so sure.",
  ],
  [
    /unencrypted/i,
    "Data traveling between your systems is like sending postcards instead of sealed letters. Anyone along the route can read the contents - user questions, AI answers, passwords, everything. A hacker on the same network can silently capture it all.",
  ],
]

export function getStoryScenario(threat: Threat): string {
  for (const [pattern, story] of STORY_MAP) {
    if (pattern.test(threat.title) || pattern.test(threat.description)) {
      return story
    }
  }
  return `If this vulnerability is exploited, an attacker could ${threat.impact.toLowerCase()}. This could happen through ${threat.attackVector.toLowerCase()}.`
}

// ----------------------------------------------------------------
// "Cost of Doing Nothing" impact descriptions
// ----------------------------------------------------------------

interface BusinessImpact {
  category: string
  icon: string
  description: string
  severity: "high" | "medium" | "low"
}

const IMPACT_MAP: [RegExp, BusinessImpact[]][] = [
  [
    /sensitive data|data leakage|pii|information.disclosure/i,
    [
      { category: "Regulatory Fines", icon: "gavel", description: "Potential GDPR/CCPA fines up to 4% of annual revenue", severity: "high" },
      { category: "Customer Trust", icon: "heart-crack", description: "Customers may leave if their private data is exposed", severity: "high" },
      { category: "Legal Action", icon: "scale", description: "Exposed customers may file lawsuits", severity: "medium" },
    ],
  ],
  [
    /prompt injection|system prompt/i,
    [
      { category: "Brand Damage", icon: "megaphone", description: "AI saying inappropriate things goes viral on social media", severity: "high" },
      { category: "Data Breach", icon: "database", description: "Attackers use the AI to access internal systems", severity: "high" },
      { category: "Operational Disruption", icon: "alert-circle", description: "Need to take AI offline for emergency fixes", severity: "medium" },
    ],
  ],
  [
    /unbounded consumption|denial.of.wallet/i,
    [
      { category: "Financial Loss", icon: "dollar-sign", description: "Unexpected API bills could reach tens of thousands of dollars", severity: "high" },
      { category: "Service Outage", icon: "cloud-off", description: "Hitting spending limits takes your AI offline for everyone", severity: "medium" },
    ],
  ],
  [
    /authentication|auth|spoofing/i,
    [
      { category: "Unauthorized Access", icon: "lock-open", description: "Strangers access your system with full privileges", severity: "high" },
      { category: "Data Theft", icon: "download", description: "Internal data gets downloaded by unauthorized users", severity: "high" },
    ],
  ],
  [
    /misinformation|hallucination/i,
    [
      { category: "Customer Complaints", icon: "message-circle", description: "Customers act on false info and blame your company", severity: "medium" },
      { category: "Legal Liability", icon: "scale", description: "Wrong advice from your AI could lead to lawsuits", severity: "medium" },
    ],
  ],
  [
    /excessive agency/i,
    [
      { category: "Unauthorized Actions", icon: "zap", description: "AI performs real-world actions you never approved", severity: "high" },
      { category: "Financial Loss", icon: "dollar-sign", description: "AI makes purchases or transfers without authorization", severity: "high" },
    ],
  ],
  [
    /supply chain/i,
    [
      { category: "Backdoor Access", icon: "door-open", description: "Compromised dependencies give hackers a hidden way in", severity: "medium" },
    ],
  ],
  [
    /audit|logging|repudiation/i,
    [
      { category: "Compliance Failure", icon: "clipboard", description: "Cannot pass security audits or prove regulatory compliance", severity: "medium" },
    ],
  ],
  [
    /unencrypted|tampering/i,
    [
      { category: "Data Interception", icon: "wifi-off", description: "Sensitive data gets stolen during transmission", severity: "medium" },
    ],
  ],
]

export function getBusinessImpacts(threat: Threat): BusinessImpact[] {
  for (const [pattern, impacts] of IMPACT_MAP) {
    if (pattern.test(threat.title) || pattern.test(threat.description)) {
      return impacts
    }
  }
  return [
    { category: "Operational Risk", icon: "alert-circle", description: "Could disrupt normal business operations", severity: "medium" },
  ]
}

// ----------------------------------------------------------------
// Quick Win classification
// ----------------------------------------------------------------

export interface QuickWin {
  mitigationId: string
  title: string
  description: string
  urgency: "Fix today" | "Fix this week" | "Plan for next month"
  impactLevel: "High Impact" | "Medium Impact" | "Low Impact"
  effortLabel: string
  threatTitle: string
  threatSeverity: Severity
}

export function classifyQuickWins(threats: Threat[]): QuickWin[] {
  const wins: QuickWin[] = []

  for (const threat of threats) {
    for (const m of threat.mitigations) {
      const urgency: QuickWin["urgency"] =
        (threat.severity === "critical" || threat.severity === "high") && m.effort === "low"
          ? "Fix today"
          : (threat.severity === "critical" || threat.severity === "high")
          ? "Fix this week"
          : "Plan for next month"

      const impactLevel: QuickWin["impactLevel"] =
        threat.severity === "critical" || threat.severity === "high"
          ? "High Impact"
          : threat.severity === "medium"
          ? "Medium Impact"
          : "Low Impact"

      wins.push({
        mitigationId: m.id,
        title: m.title,
        description: m.description,
        urgency,
        impactLevel,
        effortLabel: EFFORT_PLAIN[m.effort],
        threatTitle: threat.title,
        threatSeverity: threat.severity,
      })
    }
  }

  // Sort: Fix today first, then Fix this week, then Plan for next month
  const urgencyOrder = { "Fix today": 0, "Fix this week": 1, "Plan for next month": 2 }
  wins.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency])

  return wins
}
