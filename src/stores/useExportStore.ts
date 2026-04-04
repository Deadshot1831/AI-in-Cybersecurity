import { create } from "zustand"
import type {
  ExportFormat,
  MermaidExportData,
  BlogExportData,
  GitHubExportData,
  LinkedInExportData,
} from "@/types/export"

interface ExportStore {
  mermaidData: MermaidExportData | null
  blogData: BlogExportData | null
  githubData: GitHubExportData | null
  linkedinData: LinkedInExportData | null
  isGenerating: Record<ExportFormat, boolean>
  errors: Record<ExportFormat, string | null>

  setMermaidData: (data: MermaidExportData | null) => void
  setBlogData: (data: BlogExportData | null) => void
  setGitHubData: (data: GitHubExportData | null) => void
  setLinkedInData: (data: LinkedInExportData | null) => void
  setIsGenerating: (format: ExportFormat, generating: boolean) => void
  setError: (format: ExportFormat, error: string | null) => void
  reset: () => void
}

export const useExportStore = create<ExportStore>()((set) => ({
  mermaidData: null,
  blogData: null,
  githubData: null,
  linkedinData: null,
  isGenerating: { mermaid: false, blog: false, github: false, linkedin: false },
  errors: { mermaid: null, blog: null, github: null, linkedin: null },

  setMermaidData: (data) => set({ mermaidData: data }),
  setBlogData: (data) => set({ blogData: data }),
  setGitHubData: (data) => set({ githubData: data }),
  setLinkedInData: (data) => set({ linkedinData: data }),
  setIsGenerating: (format, generating) =>
    set((state) => ({
      isGenerating: { ...state.isGenerating, [format]: generating },
    })),
  setError: (format, error) =>
    set((state) => ({
      errors: { ...state.errors, [format]: error },
    })),
  reset: () =>
    set({
      mermaidData: null,
      blogData: null,
      githubData: null,
      linkedinData: null,
      isGenerating: { mermaid: false, blog: false, github: false, linkedin: false },
      errors: { mermaid: null, blog: null, github: null, linkedin: null },
    }),
}))
