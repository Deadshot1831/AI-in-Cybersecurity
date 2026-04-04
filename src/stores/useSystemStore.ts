import { create } from "zustand"
import type {
  SystemArchitecture,
  SystemComponent,
  DataFlow,
  TrustBoundary,
  InputMode,
} from "@/types/system"

interface SystemStore {
  architecture: SystemArchitecture | null
  inputMode: InputMode
  isParsing: boolean
  parseError: string | null
  freeformText: string

  setInputMode: (mode: InputMode) => void
  setFreeformText: (text: string) => void
  setArchitecture: (arch: SystemArchitecture) => void
  initArchitecture: (name: string, description: string) => void
  addComponent: (component: SystemComponent) => void
  updateComponent: (id: string, updates: Partial<SystemComponent>) => void
  removeComponent: (id: string) => void
  addDataFlow: (flow: DataFlow) => void
  removeDataFlow: (id: string) => void
  addTrustBoundary: (boundary: TrustBoundary) => void
  updateTrustBoundary: (id: string, updates: Partial<TrustBoundary>) => void
  removeTrustBoundary: (id: string) => void
  setIsParsing: (parsing: boolean) => void
  setParseError: (error: string | null) => void
  reset: () => void
}

const generateId = () => crypto.randomUUID()

export const useSystemStore = create<SystemStore>()((set) => ({
  architecture: null,
  inputMode: "freeform",
  isParsing: false,
  parseError: null,
  freeformText: "",

  setInputMode: (mode) => set({ inputMode: mode }),
  setFreeformText: (text) => set({ freeformText: text }),

  setArchitecture: (arch) => set({ architecture: arch }),

  initArchitecture: (name, description) =>
    set({
      architecture: {
        id: generateId(),
        name,
        description,
        components: [],
        dataFlows: [],
        trustBoundaries: [],
        createdAt: new Date().toISOString(),
      },
    }),

  addComponent: (component) =>
    set((state) => {
      if (!state.architecture) return state
      return {
        architecture: {
          ...state.architecture,
          components: [...state.architecture.components, component],
        },
      }
    }),

  updateComponent: (id, updates) =>
    set((state) => {
      if (!state.architecture) return state
      return {
        architecture: {
          ...state.architecture,
          components: state.architecture.components.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        },
      }
    }),

  removeComponent: (id) =>
    set((state) => {
      if (!state.architecture) return state
      return {
        architecture: {
          ...state.architecture,
          components: state.architecture.components.filter((c) => c.id !== id),
          dataFlows: state.architecture.dataFlows.filter(
            (f) => f.sourceId !== id && f.targetId !== id
          ),
          trustBoundaries: state.architecture.trustBoundaries.map((b) => ({
            ...b,
            componentIds: b.componentIds.filter((cid) => cid !== id),
          })),
        },
      }
    }),

  addDataFlow: (flow) =>
    set((state) => {
      if (!state.architecture) return state
      return {
        architecture: {
          ...state.architecture,
          dataFlows: [...state.architecture.dataFlows, flow],
        },
      }
    }),

  removeDataFlow: (id) =>
    set((state) => {
      if (!state.architecture) return state
      return {
        architecture: {
          ...state.architecture,
          dataFlows: state.architecture.dataFlows.filter((f) => f.id !== id),
        },
      }
    }),

  addTrustBoundary: (boundary) =>
    set((state) => {
      if (!state.architecture) return state
      return {
        architecture: {
          ...state.architecture,
          trustBoundaries: [...state.architecture.trustBoundaries, boundary],
        },
      }
    }),

  updateTrustBoundary: (id, updates) =>
    set((state) => {
      if (!state.architecture) return state
      return {
        architecture: {
          ...state.architecture,
          trustBoundaries: state.architecture.trustBoundaries.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        },
      }
    }),

  removeTrustBoundary: (id) =>
    set((state) => {
      if (!state.architecture) return state
      return {
        architecture: {
          ...state.architecture,
          trustBoundaries: state.architecture.trustBoundaries.filter(
            (b) => b.id !== id
          ),
        },
      }
    }),

  setIsParsing: (parsing) => set({ isParsing: parsing }),
  setParseError: (error) => set({ parseError: error }),

  reset: () =>
    set({
      architecture: null,
      isParsing: false,
      parseError: null,
      freeformText: "",
    }),
}))
