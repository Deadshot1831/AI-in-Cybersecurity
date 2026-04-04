import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SettingsStore {
  apiKey: string | null
  isLiveMode: boolean
  theme: "dark" | "light" | "system"
  setApiKey: (key: string | null) => void
  setLiveMode: (live: boolean) => void
  setTheme: (theme: "dark" | "light" | "system") => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      apiKey: null,
      isLiveMode: false,
      theme: "dark",
      setApiKey: (key) => set({ apiKey: key }),
      setLiveMode: (live) => set({ isLiveMode: live }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "ai-threat-modeler-settings",
      partialize: (state) => ({
        apiKey: state.apiKey,
        theme: state.theme,
        isLiveMode: state.isLiveMode,
      }),
    }
  )
)
