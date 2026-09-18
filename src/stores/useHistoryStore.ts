import { create } from "zustand"
import { supabase } from "@/lib/supabase"
import { useAuthStore } from "@/stores/useAuthStore"
import type { SystemArchitecture } from "@/types/system"
import type { ThreatAnalysisResult } from "@/types/threat"

export interface HistoryEntry {
  id: string
  system_name: string
  threat_count: number
  risk_score: number
  system: SystemArchitecture
  result: ThreatAnalysisResult
  created_at: string
}

interface HistoryStore {
  entries: HistoryEntry[]
  isLoading: boolean
  error: string | null
  load: () => Promise<void>
  save: (system: SystemArchitecture, result: ThreatAnalysisResult) => Promise<void>
  remove: (id: string) => Promise<void>
}

const TABLE = "analysis_history"
// ponytail: fixed page size, add pagination when a user exceeds it
const LIMIT = 50

export const useHistoryStore = create<HistoryStore>()((set, get) => ({
  entries: [],
  isLoading: false,
  error: null,

  load: async () => {
    if (useAuthStore.getState().isDemo) return
    set({ isLoading: true, error: null })
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(LIMIT)
    set({ entries: (data as HistoryEntry[]) ?? [], isLoading: false, error: error?.message ?? null })
  },

  save: async (system, result) => {
    const user = useAuthStore.getState().user
    if (!user) return
    const { error } = await supabase.from(TABLE).insert({
      user_id: user.id,
      system_name: system.name,
      threat_count: result.threats.length,
      risk_score: result.riskScore.overall,
      system,
      result,
    })
    if (error) throw new Error(error.message)
  },

  remove: async (id) => {
    const { error } = await supabase.from(TABLE).delete().eq("id", id)
    if (error) {
      set({ error: error.message })
      return
    }
    set({ entries: get().entries.filter((e) => e.id !== id) })
  },
}))
