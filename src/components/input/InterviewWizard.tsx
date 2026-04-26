import { useState, useCallback } from "react"
import { ChevronRight, ChevronLeft, Sparkles, CheckCircle2, Globe, Bot, BookOpen, Lock, Zap, Key, RefreshCw, Server, X, Check, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  icon: typeof Globe
  gradient: string
  accentColor: string
  illustration: string
  componentsIfYes: { type: ComponentType; name: string; description: string; isExternalFacing: boolean }[]
  flowsIfYes?: { sourceType: ComponentType; targetType: ComponentType; label: string }[]
}

const WIZARD_STEPS: WizardStep[] = [
  {
    id: "system-name",
    question: "What would you like to call your AI system?",
    helpText: "Give it a name so we can personalize the report",
    emoji: "\uD83C\uDFF7\uFE0F",
    icon: Server,
    gradient: "from-violet-500/20 to-purple-500/20",
    accentColor: "violet",
    illustration: "Name your system to get started",
    componentsIfYes: [],
  },
  {
    id: "public-facing",
    question: "Can anyone on the internet talk to your AI?",
    helpText: "If customers, users, or the public can interact with your AI through a website, app, or API",
    emoji: "\uD83C\uDF10",
    icon: Globe,
    gradient: "from-blue-500/20 to-cyan-500/20",
    accentColor: "blue",
    illustration: "Public-facing systems have a larger attack surface",
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
    question: "Does your system use an AI language model?",
    helpText: "This includes any large language model like ChatGPT, Claude, or Gemini that generates text",
    emoji: "\uD83E\uDD16",
    icon: Bot,
    gradient: "from-emerald-500/20 to-green-500/20",
    accentColor: "emerald",
    illustration: "LLMs introduce unique risks like prompt injection",
    componentsIfYes: [
      { type: "llm-endpoint", name: "AI Language Model", description: "Large Language Model that generates responses", isExternalFacing: false },
    ],
    flowsIfYes: [
      { sourceType: "api-gateway", targetType: "llm-endpoint", label: "Forwarded queries" },
    ],
  },
  {
    id: "reads-docs",
    question: "Does your AI search documents to answer questions?",
    helpText: "Called RAG - if your AI looks up company docs, knowledge bases, or PDFs before answering",
    emoji: "\uD83D\uDCDA",
    icon: BookOpen,
    gradient: "from-amber-500/20 to-yellow-500/20",
    accentColor: "amber",
    illustration: "Document retrieval adds data exfiltration risks",
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
    question: "Does your AI access private customer data?",
    helpText: "Names, emails, billing info, health records, or any personally identifiable information (PII)",
    emoji: "\uD83D\uDD12",
    icon: Lock,
    gradient: "from-red-500/20 to-rose-500/20",
    accentColor: "red",
    illustration: "PII access requires strict data protection controls",
    componentsIfYes: [
      { type: "storage", name: "Customer Data Store", description: "Database containing private customer information", isExternalFacing: false },
    ],
    flowsIfYes: [
      { sourceType: "llm-endpoint", targetType: "storage", label: "Data access" },
    ],
  },
  {
    id: "takes-action",
    question: "Can your AI take real-world actions?",
    helpText: "Like sending emails, making purchases, updating records, booking appointments, or triggering notifications",
    emoji: "\u26A1",
    icon: Zap,
    gradient: "from-orange-500/20 to-amber-500/20",
    accentColor: "orange",
    illustration: "Action-capable AI needs authorization guardrails",
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
    helpText: "Any form of login, password, or access control protecting your AI system",
    emoji: "\uD83D\uDD11",
    icon: Key,
    gradient: "from-indigo-500/20 to-blue-500/20",
    accentColor: "indigo",
    illustration: "Authentication controls who can access your system",
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
    helpText: "Scheduled imports, data syncs, document uploads, or any automated data ingestion pipeline",
    emoji: "\uD83D\uDD04",
    icon: RefreshCw,
    gradient: "from-teal-500/20 to-cyan-500/20",
    accentColor: "teal",
    illustration: "Data pipelines can be a vector for data poisoning",
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
  const [animKey, setAnimKey] = useState(0)
  const { setArchitecture, setInputMode } = useSystemStore()

  const step = WIZARD_STEPS[currentStep]
  const totalQuestions = WIZARD_STEPS.length
  const progress = ((currentStep) / totalQuestions) * 100
  const isNameStep = currentStep === 0
  const StepIcon = step.icon

  const animateTransition = useCallback(() => {
    setAnimKey((k) => k + 1)
  }, [])

  const handleAnswer = (value: boolean) => {
    setAnswers((prev) => ({ ...prev, [step.id]: { answered: true, value } }))
    if (currentStep < totalQuestions - 1) {
      animateTransition()
      setCurrentStep((s) => s + 1)
    } else {
      buildArchitecture(value)
    }
  }

  const handleNameNext = () => {
    if (systemName.trim().length < 2) return
    setAnswers((prev) => ({ ...prev, "system-name": { answered: true, value: true } }))
    animateTransition()
    setCurrentStep(1)
  }

  const handleBack = () => {
    if (currentStep > 0) {
      animateTransition()
      setCurrentStep((s) => s - 1)
    }
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
  const detectedFeatures = WIZARD_STEPS.slice(1).filter((ws) => answers[ws.id]?.value)

  if (isComplete) {
    return (
      <div className="animate-wizard-card-pop">
        <Card className="border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/5 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />
          <CardContent className="flex flex-col items-center gap-5 py-10 relative">
            <div className="animate-wizard-check-bounce">
              <div className="rounded-full bg-green-500/20 p-4">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold">System Profile Complete!</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                We identified <strong className="text-green-500">{answeredYesCount} key features</strong> in your system.
                Your architecture has been built automatically.
              </p>
            </div>
            {detectedFeatures.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {detectedFeatures.map((ws, i) => {
                  const WsIcon = ws.icon
                  return (
                    <Badge
                      key={ws.id}
                      variant="secondary"
                      className="gap-1.5 py-1.5 px-3 text-xs animate-wizard-card-pop"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <WsIcon className="h-3 w-3" />
                      {ws.componentsIfYes[0]?.name ?? ws.id}
                    </Badge>
                  )
                })}
              </div>
            )}
            <p className="text-xs text-muted-foreground text-center max-w-sm">
              Switch to <strong>"Structured Input"</strong> to review components, or click <strong>"Analyze Threats"</strong> to start.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground"
              onClick={() => {
                setIsComplete(false)
                setCurrentStep(0)
                setAnswers({})
                setSystemName("")
              }}
            >
              <RotateCcw className="h-3.5 w-3.5" /> Start Over
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Progress Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Question {currentStep + 1} of {totalQuestions}</span>
          </div>
          <span className="font-medium text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <div className="relative">
          <Progress value={progress} className="h-2.5" />
          {/* Step indicator dots */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-0.5 pointer-events-none">
            {WIZARD_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                  i < currentStep
                    ? "bg-primary scale-100"
                    : i === currentStep
                    ? "bg-primary scale-125"
                    : "bg-muted-foreground/30 scale-75"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div key={animKey} className="animate-wizard-slide-in">
        <Card className={`overflow-hidden border-0 shadow-lg bg-gradient-to-br ${step.gradient}`}>
          {/* Illustration Header */}
          <div className="relative px-4 sm:px-6 pt-5 sm:pt-6 pb-4">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className={`rounded-2xl p-2.5 sm:p-3 bg-gradient-to-br ${step.gradient} border border-white/10 shadow-inner shrink-0`}>
                <StepIcon className="h-6 w-6 sm:h-8 sm:w-8 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base sm:text-lg font-bold leading-snug break-words">{step.question}</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{step.helpText}</p>
              </div>
            </div>
            {/* Subtle context hint */}
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground/70">
              <div className="h-px flex-1 bg-foreground/5" />
              <span className="italic">{step.illustration}</span>
              <div className="h-px flex-1 bg-foreground/5" />
            </div>
          </div>

          <CardContent className="px-4 sm:px-6 pt-2 pb-5 sm:pb-6">
            {isNameStep ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="system-name" className="text-sm font-medium">System Name</Label>
                  <Input
                    id="system-name"
                    placeholder='e.g., "Customer Support Bot", "Legal Document Analyzer"'
                    value={systemName}
                    onChange={(e) => setSystemName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleNameNext()}
                    className="h-12 text-base bg-background/50 border-foreground/10"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleNameNext}
                    disabled={systemName.trim().length < 2}
                    size="lg"
                    className="gap-2 px-6"
                  >
                    Get Started <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Large clickable Yes/No cards */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button
                    onClick={() => handleAnswer(false)}
                    className="group relative rounded-xl border-2 border-foreground/10 bg-background/40 hover:bg-background/60 hover:border-foreground/20 p-4 sm:p-5 transition-all duration-200 text-left active:scale-[0.98]"
                  >
                    <div className="text-center space-y-2">
                      <div className="flex justify-center">
                        <div className="rounded-full bg-muted p-2">
                          <X className="h-6 w-6 text-muted-foreground" />
                        </div>
                      </div>
                      <span className="text-base font-semibold block">No</span>
                      <span className="text-xs text-muted-foreground block">Skip this feature</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleAnswer(true)}
                    className="group relative rounded-xl border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 p-4 sm:p-5 transition-all duration-200 text-left active:scale-[0.98]"
                  >
                    <div className="text-center space-y-2">
                      <div className="flex justify-center">
                        <div className="rounded-full bg-green-500/20 p-2">
                          <Check className="h-6 w-6 text-green-500" />
                        </div>
                      </div>
                      <span className="text-base font-semibold block">Yes</span>
                      <span className="text-xs text-muted-foreground block">My system has this</span>
                    </div>
                  </button>
                </div>

                {/* Back button */}
                {currentStep > 0 && (
                  <div className="flex justify-start">
                    <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1 text-muted-foreground">
                      <ChevronLeft className="h-4 w-4" /> Previous question
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detected features strip */}
      {detectedFeatures.length > 0 && (
        <div className="glass rounded-xl p-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 mr-1">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Detected:</span>
            </div>
            {detectedFeatures.map((ws) => {
              const WsIcon = ws.icon
              return (
                <Badge key={ws.id} variant="secondary" className="gap-1 text-xs py-1">
                  <WsIcon className="h-3 w-3" />
                  {ws.componentsIfYes[0]?.name ?? ws.id}
                </Badge>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
