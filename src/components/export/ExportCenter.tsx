import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GitBranch, FileText, Network, Share2 } from "lucide-react"
import { MermaidExport } from "./MermaidExport"
import { MarkdownExport } from "./MarkdownExport"
import { LinkedInExport } from "./LinkedInExport"
import { useAnalysisStore } from "@/stores/useAnalysisStore"
import { useSystemStore } from "@/stores/useSystemStore"
import { useExportStore } from "@/stores/useExportStore"
import { generateBlogPost } from "@/services/export/blogGenerator"
import { generateGitHubReport } from "@/services/export/githubGenerator"
import { MOCK_SYSTEM } from "@/services/mock/mockSystem"

export function ExportCenter() {
  const result = useAnalysisStore((s) => s.result)
  const architecture = useSystemStore((s) => s.architecture)
  const { blogData, setBlogData, githubData, setGitHubData } = useExportStore()

  const system = architecture ?? MOCK_SYSTEM

  const handleGenerateBlog = () => {
    if (!result) return
    const data = generateBlogPost(system, result)
    setBlogData(data)
  }

  const handleGenerateGitHub = () => {
    if (!result) return
    const data = generateGitHubReport(system, result)
    setGitHubData(data)
  }

  return (
    <Tabs defaultValue="mermaid">
      <TabsList className="grid w-full grid-cols-4 max-w-xl">
        <TabsTrigger value="mermaid" className="gap-1.5">
          <Network className="h-4 w-4" />
          <span className="hidden sm:inline">Mermaid</span>
        </TabsTrigger>
        <TabsTrigger value="blog" className="gap-1.5">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Blog Post</span>
        </TabsTrigger>
        <TabsTrigger value="github" className="gap-1.5">
          <GitBranch className="h-4 w-4" />
          <span className="hidden sm:inline">GitHub</span>
        </TabsTrigger>
        <TabsTrigger value="linkedin" className="gap-1.5">
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">LinkedIn</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="mermaid" className="mt-6">
        <MermaidExport />
      </TabsContent>

      <TabsContent value="blog" className="mt-6">
        <MarkdownExport
          title="Blog Post"
          markdown={blogData?.markdown ?? null}
          filename="threat-model-blog.md"
          onGenerate={handleGenerateBlog}
          wordCount={blogData?.wordCount}
        />
      </TabsContent>

      <TabsContent value="github" className="mt-6">
        <MarkdownExport
          title="GitHub Report"
          markdown={githubData?.markdown ?? null}
          filename={githubData?.filename ?? "threat-model.md"}
          onGenerate={handleGenerateGitHub}
        />
      </TabsContent>

      <TabsContent value="linkedin" className="mt-6">
        <LinkedInExport />
      </TabsContent>
    </Tabs>
  )
}
