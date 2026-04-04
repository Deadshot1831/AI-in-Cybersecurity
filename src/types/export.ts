export type ExportFormat = "mermaid" | "blog" | "github" | "linkedin"

export interface MermaidExportData {
  diagramSyntax: string
  diagramType: "flowchart" | "sequenceDiagram"
}

export interface BlogExportData {
  title: string
  markdown: string
  wordCount: number
}

export interface GitHubExportData {
  markdown: string
  filename: string
}

export interface LinkedInSlide {
  slideNumber: number
  title: string
  bullets: string[]
  footer?: string
}

export interface LinkedInExportData {
  slides: LinkedInSlide[]
  title: string
}
