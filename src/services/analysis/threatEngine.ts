import type { SystemArchitecture } from "@/types/system"
import type { ThreatAnalysisResult, AnalysisStatus, Threat, FrameworkType } from "@/types/threat"
import { useAnalysisStore } from "@/stores/useAnalysisStore"
import { useSettingsStore } from "@/stores/useSettingsStore"
import { useSystemStore } from "@/stores/useSystemStore"
import { MOCK_ANALYSIS } from "@/services/mock/mockAnalysis"
import { MOCK_SYSTEM } from "@/services/mock/mockSystem"
import { simulateDelay } from "@/services/mock/delay"
import { createClient } from "@/services/claude/client"
import { buildOwaspPrompt, buildStridePrompt, buildAtlasPrompt, buildCorrelationPrompt } from "@/services/claude/prompts"
import { streamAnalysis } from "@/services/claude/streamAnalysis"
import { parseJsonResponse } from "@/services/claude/parseResponse"

const updateStatus = (status: AnalysisStatus, progress: number) => {
  useAnalysisStore.getState().setStatus(status)
  useAnalysisStore.getState().setProgress(progress)
}

async function runMockAnalysis(): Promise<ThreatAnalysisResult> {
  updateStatus("parsing-input", 10)
  await simulateDelay(1200)

  updateStatus("analyzing-owasp", 30)
  await simulateDelay(1500)

  updateStatus("analyzing-stride", 50)
  await simulateDelay(1300)

  updateStatus("analyzing-atlas", 70)
  await simulateDelay(1400)

  updateStatus("correlating", 90)
  await simulateDelay(1000)

  return MOCK_ANALYSIS
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

  // Step 1: OWASP analysis
  updateStatus("analyzing-owasp", 15)
  store.clearStreamingText()
  const owaspPrompt = buildOwaspPrompt(system)
  const owaspRaw = await callClaude(apiKey, owaspPrompt.system, owaspPrompt.user)
  updateStatus("analyzing-owasp", 30)

  // Step 2: STRIDE analysis
  updateStatus("analyzing-stride", 35)
  store.clearStreamingText()
  const stridePrompt = buildStridePrompt(system)
  const strideRaw = await callClaude(apiKey, stridePrompt.system, stridePrompt.user)
  updateStatus("analyzing-stride", 55)

  // Step 3: ATLAS analysis
  updateStatus("analyzing-atlas", 60)
  store.clearStreamingText()
  const atlasPrompt = buildAtlasPrompt(system)
  const atlasRaw = await callClaude(apiKey, atlasPrompt.system, atlasPrompt.user)
  updateStatus("analyzing-atlas", 75)

  // Step 4: Correlation
  updateStatus("correlating", 80)
  store.clearStreamingText()
  const corrPrompt = buildCorrelationPrompt(owaspRaw, strideRaw, atlasRaw, system)
  const corrRaw = await callClaude(apiKey, corrPrompt.system, corrPrompt.user)
  updateStatus("correlating", 95)

  // Parse the correlated result
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

  // Map to our types
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

  store.reset()
  store.setStatus("parsing-input")
  store.setProgress(5)
  store.setError(null)

  try {
    let system: SystemArchitecture

    if (systemStore.inputMode === "freeform") {
      system = MOCK_SYSTEM
      if (systemStore.freeformText.trim()) {
        systemStore.setArchitecture(MOCK_SYSTEM)
      }
    } else {
      system = systemStore.architecture ?? MOCK_SYSTEM
    }

    let result: ThreatAnalysisResult

    if (settings.isLiveMode && settings.apiKey) {
      result = await runLiveAnalysis(system, settings.apiKey)
    } else {
      result = await runMockAnalysis()
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
