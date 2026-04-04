import { create } from "zustand"
import type {
  ThreatAnalysisResult,
  AnalysisStatus,
  FrameworkType,
  Severity,
  Threat,
} from "@/types/threat"

interface AnalysisStore {
  result: ThreatAnalysisResult | null
  status: AnalysisStatus
  progress: number
  streamingText: string
  error: string | null

  activeFrameworks: FrameworkType[]
  activeSeverities: Severity[]
  activeComponentIds: string[]

  getFilteredThreats: () => Threat[]

  setResult: (result: ThreatAnalysisResult | null) => void
  setStatus: (status: AnalysisStatus) => void
  setProgress: (progress: number) => void
  appendStreamingText: (chunk: string) => void
  clearStreamingText: () => void
  setError: (error: string | null) => void
  setActiveFrameworks: (f: FrameworkType[]) => void
  setActiveSeverities: (s: Severity[]) => void
  setActiveComponentIds: (ids: string[]) => void
  reset: () => void
}

const severityOrder: Record<Severity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
}

export const useAnalysisStore = create<AnalysisStore>()((set, get) => ({
  result: null,
  status: "idle",
  progress: 0,
  streamingText: "",
  error: null,

  activeFrameworks: ["owasp-llm", "stride", "mitre-atlas"],
  activeSeverities: ["critical", "high", "medium", "low"],
  activeComponentIds: [],

  getFilteredThreats: () => {
    const state = get()
    if (!state.result) return []

    return state.result.threats
      .filter((threat) => {
        if (!state.activeSeverities.includes(threat.severity)) return false

        const hasOwasp =
          state.activeFrameworks.includes("owasp-llm") &&
          threat.owaspMappings.length > 0
        const hasStride =
          state.activeFrameworks.includes("stride") &&
          threat.strideMappings.length > 0
        const hasAtlas =
          state.activeFrameworks.includes("mitre-atlas") &&
          threat.atlasMappings.length > 0

        if (!hasOwasp && !hasStride && !hasAtlas) return false

        if (state.activeComponentIds.length > 0) {
          const hasComponent = threat.affectedComponentIds.some((id) =>
            state.activeComponentIds.includes(id)
          )
          if (!hasComponent) return false
        }

        return true
      })
      .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
  },

  setResult: (result) => set({ result }),
  setStatus: (status) => set({ status }),
  setProgress: (progress) => set({ progress }),
  appendStreamingText: (chunk) =>
    set((state) => ({ streamingText: state.streamingText + chunk })),
  clearStreamingText: () => set({ streamingText: "" }),
  setError: (error) => set({ error }),
  setActiveFrameworks: (f) => set({ activeFrameworks: f }),
  setActiveSeverities: (s) => set({ activeSeverities: s }),
  setActiveComponentIds: (ids) => set({ activeComponentIds: ids }),

  reset: () =>
    set({
      result: null,
      status: "idle",
      progress: 0,
      streamingText: "",
      error: null,
      activeFrameworks: ["owasp-llm", "stride", "mitre-atlas"],
      activeSeverities: ["critical", "high", "medium", "low"],
      activeComponentIds: [],
    }),
}))
