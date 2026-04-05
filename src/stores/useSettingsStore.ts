import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SettingsStore {
  apiKey: string | null
  isLiveMode: boolean
  plainEnglish: boolean
  theme: "dark" | "light" | "system"
  setApiKey: (key: string | null) => void
  setLiveMode: (live: boolean) => void
  setPlainEnglish: (on: boolean) => void
  setTheme: (theme: "dark" | "light" | "system") => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      apiKey: null,
      isLiveMode: false,
      plainEnglish: false,
      theme: "dark",
      setApiKey: (key) => set({ apiKey: key }),
      setLiveMode: (live) => set({ isLiveMode: live }),
      setPlainEnglish: (on) => set({ plainEnglish: on }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "ai-threat-modeler-settings",
      partialize: (state) => ({
        apiKey: state.apiKey,
        theme: state.theme,
        isLiveMode: state.isLiveMode,
        plainEnglish: state.plainEnglish,
      }),
    }
  )
)
