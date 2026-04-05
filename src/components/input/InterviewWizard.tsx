import { useState } from "react"
import { ChevronRight, ChevronLeft, Sparkles, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSystemStore } from "@/stores/useSystemStore"
import type { ComponentType, SystemComponent, DataFlow } from "@/types/system"

interface WizardAnswer {
  answered: boolean
  value: boolean
}

interface WizardStep {
  id: string
  question: string
  helpText: string
  emoji: string
  componentsIfYes: { type: ComponentType; name: string; description: string; isExternalFacing: boolean }[]
  flowsIfYes?: { sourceType: ComponentType; targetType: ComponentType; label: string }[]
}

const WIZARD_STEPS: WizardStep[] = [
  {
    id: "system-name",
    question: "What would you like to call your AI system?",
    helpText: "Give it a name so we can personalize the report (e.g., \"Customer Support Bot\", \"Legal Document Analyzer\")",
    emoji: "🏷️",
    componentsIfYes: [],
  },
  {
    id: "public-facing",
    question: "Can anyone on the internet talk to your AI?",
    helpText: "If customers, users, or the public can interact with your AI through a website, app, or API - answer Yes.",
    emoji: "🌐",
    componentsIfYes: [
      { type: "user-interface", name: "Public Web Interface", description: "Internet-facing interface where users interact with the AI", isExternalFacing: true },
      { type: "api-gateway", name: "API Gateway", description: "Entry point that routes and validates incoming requests", isExternalFacing: true },
    ],
    flowsIfYes: [
      { sourceType: "user-interface", targetType: "api-gateway", label: "User requests" },
    ],
  },
  {
    id: "has-llm",
    question: "Does your system use an AI language model (like ChatGPT, Claude, Gemini)?",
    helpText: "This includes any large language model that generates text, answers questions, or processes natural language.",
    emoji: "🤖",
    componentsIfYes: [
      { type: "llm-endpoint", name: "AI Language Model", description: "Large Language Model that generates responses", isExternalFacing: false },
    ],
    flowsIfYes: [
      { sourceType: "api-gateway", targetType: "llm-endpoint", label: "Forwarded queries" },
    ],
  },
  {
    id: "reads-docs",
    question: "Does your AI read or search through documents to answer questions?",
    helpText: "This is called RAG (Retrieval-Augmented Generation). If your AI looks up company docs, knowledge bases, or PDFs before answering, select Yes.",
    emoji: "📚",
    componentsIfYes: [
      { type: "rag-database", name: "Document Knowledge Base", description: "Collection of documents the AI searches for context", isExternalFacing: false },
      { type: "vector-store", name: "Search Index", description: "Index that helps the AI find relevant documents quickly", isExternalFacing: false },
    ],
    flowsIfYes: [
      { sourceType: "llm-endpoint", targetType: "rag-database", label: "Context retrieval" },
      { sourceType: "rag-database", targetType: "vector-store", label: "Vector search" },
    ],
  },
  {
    id: "private-data",
    question: "Does your AI have access to private customer data?",
    helpText: "Things like names, emails, billing info, health records, or any personally identifiable information (PII).",
    emoji: "🔒",
    componentsIfYes: [
      { type: "storage", name: "Customer Data Store", description: "Database containing private customer information", isExternalFacing: false },
    ],
    flowsIfYes: [
      { sourceType: "llm-endpoint", targetType: "storage", label: "Data access" },
    ],
  },
  {
    id: "takes-action",
    question: "Can your AI take real-world actions? (send emails, make purchases, update records)",
    helpText: "If your AI can do more than just answer questions - like booking appointments, sending notifications, or modifying databases - answer Yes.",
    emoji: "⚡",
    componentsIfYes: [
      { type: "external-api", name: "External Actions API", description: "External services the AI can trigger (email, payments, etc.)", isExternalFacing: true },
    ],
    flowsIfYes: [
      { sourceType: "llm-endpoint", targetType: "external-api", label: "Tool/action calls" },
    ],
  },
  {
    id: "has-auth",
    question: "Do users need to log in before using your AI?",
    helpText: "If there's any form of login, password, or access control protecting your AI system.",
    emoji: "🔑",
    componentsIfYes: [
      { type: "auth-service", name: "Login & Access Control", description: "Authentication service managing user identities and permissions", isExternalFacing: false },
    ],
    flowsIfYes: [
      { sourceType: "api-gateway", targetType: "auth-service", label: "Auth verification" },
    ],
  },
  {
    id: "data-pipeline",
    question: "Is there a process that regularly feeds new data into your AI?",
    helpText: "Scheduled imports, data syncs, document uploads, or any automated data ingestion pipeline.",
    emoji: "🔄",
    componentsIfYes: [
      { type: "data-pipeline", name: "Data Ingestion Pipeline", description: "Automated process that feeds new data into the AI system", isExternalFacing: false },
    ],
    flowsIfYes: [
      { sourceType: "data-pipeline", targetType: "vector-store", label: "Data ingestion" },
    ],
  },
]

export function InterviewWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [systemName, setSystemName] = useState("")
  const [answers, setAnswers] = useState<Record<string, WizardAnswer>>({})
  const [isComplete, setIsComplete] = useState(false)
  const { setArchitecture, setInputMode } = useSystemStore()

  const step = WIZARD_STEPS[currentStep]
  const totalQuestions = WIZARD_STEPS.length
  const progress = ((currentStep) / totalQuestions) * 100
  const isNameStep = currentStep === 0

  const handleAnswer = (value: boolean) => {
    setAnswers((prev) => ({ ...prev, [step.id]: { answered: true, value } }))
    if (currentStep < totalQuestions - 1) {
      setCurrentStep((s) => s + 1)
    } else {
      buildArchitecture(value)
    }
  }

  const handleNameNext = () => {
    if (systemName.trim().length < 2) return
    setAnswers((prev) => ({ ...prev, "system-name": { answered: true, value: true } }))
    setCurrentStep(1)
  }

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1)
  }

  const buildArchitecture = (lastAnswer: boolean) => {
    const finalAnswers = { ...answers, [WIZARD_STEPS[totalQuestions - 1].id]: { answered: true, value: lastAnswer } }

    const components: SystemComponent[] = []
    const flows: DataFlow[] = []
    const typeToId: Record<string, string> = {}

    for (const ws of WIZARD_STEPS) {
      if (ws.id === "system-name") continue
      const ans = finalAnswers[ws.id]
      if (!ans?.value) continue

      for (const comp of ws.componentsIfYes) {
        if (!typeToId[comp.type]) {
          const id = crypto.randomUUID()
          typeToId[comp.type] = id
          components.push({
            id,
            name: comp.name,
            type: comp.type,
            description: comp.description,
            technologies: [],
            isExternalFacing: comp.isExternalFacing,
          })
        }
      }

      if (ws.flowsIfYes) {
        for (const f of ws.flowsIfYes) {
          const sourceId = typeToId[f.sourceType]
          const targetId = typeToId[f.targetType]
          if (sourceId && targetId) {
            flows.push({
              id: crypto.randomUUID(),
              sourceId,
              targetId,
              label: f.label,
              dataType: "application/json",
              isEncrypted: true,
            })
          }
        }
      }
    }

    // Always ensure at least an LLM component
    if (!typeToId["llm-endpoint"]) {
      const id = crypto.randomUUID()
      typeToId["llm-endpoint"] = id
      components.push({
        id,
        name: "AI Service",
        type: "llm-endpoint",
        description: "AI language model service",
        technologies: [],
        isExternalFacing: false,
      })
    }

    const name = systemName.trim() || "My AI System"

    setArchitecture({
      id: crypto.randomUUID(),
      name,
      description: `System built via guided interview: ${name}`,
      components,
      dataFlows: flows,
      trustBoundaries: [],
      createdAt: new Date().toISOString(),
    })

    setInputMode("structured")
    setIsComplete(true)
  }

  const answeredYesCount = Object.values(answers).filter((a) => a.value).length

  if (isComplete) {
    return (
      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
          <div className="text-center">
            <h3 className="text-lg font-semibold">System Profile Complete!</h3>
            <p className="text-sm text-muted-foreground mt-1">
              We identified <strong>{answeredYesCount} key features</strong> in your system.
              Your architecture has been built automatically.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Switch to the <strong>"Structured Input"</strong> tab to review the components, or click <strong>"Analyze Threats"</strong> below to start.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Question {currentStep + 1} of {totalQuestions}</span>
        <span>{Math.round(progress)}% complete</span>
      </div>
      <Progress value={progress} className="h-2" />

      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <span className="text-3xl">{step.emoji}</span>
            <div>
              <CardTitle className="text-lg">{step.question}</CardTitle>
              <CardDescription className="mt-1">{step.helpText}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isNameStep ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="system-name">System Name</Label>
                <Input
                  id="system-name"
                  placeholder="e.g., Customer Support Bot"
                  value={systemName}
                  onChange={(e) => setSystemName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNameNext()}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleNameNext} disabled={systemName.trim().length < 2} className="gap-2">
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1">
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
              )}
              <div className="flex gap-3 ml-auto">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleAnswer(false)}
                  className="min-w-[100px]"
                >
                  No
                </Button>
                <Button
                  size="lg"
                  onClick={() => handleAnswer(true)}
                  className="min-w-[100px] gap-2"
                >
                  <Sparkles className="h-4 w-4" /> Yes
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {Object.keys(answers).length > 1 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground mr-1 self-center">Features detected:</span>
          {WIZARD_STEPS.slice(1).map((ws) => {
            const ans = answers[ws.id]
            if (!ans?.value) return null
            return (
              <Badge key={ws.id} variant="secondary" className="text-xs">
                {ws.emoji} {ws.componentsIfYes[0]?.name ?? ws.id}
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
