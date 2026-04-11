import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { Copy, Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAnalysisStore } from "@/stores/useAnalysisStore"
import { useSystemStore } from "@/stores/useSystemStore"
import { useExportStore } from "@/stores/useExportStore"
import { generateMermaidDiagram } from "@/services/export/mermaidGenerator"
import { MOCK_SYSTEM } from "@/services/mock/mockSystem"

export function MermaidExport() {
  const result = useAnalysisStore((s) => s.result)
  const architecture = useSystemStore((s) => s.architecture)
  const { mermaidData, setMermaidData } = useExportStore()
  const diagramRef = useRef<HTMLDivElement>(null)
  const [svgContent, setSvgContent] = useState<string>("")
  const [renderError, setRenderError] = useState<string | null>(null)

  const system = architecture ?? MOCK_SYSTEM

  const handleGenerate = () => {
    if (!result) return
    const data = generateMermaidDiagram(system, result)
    setMermaidData(data)
  }

  useEffect(() => {
    if (!mermaidData) return

    async function renderDiagram() {
      try {
        const mermaid = (await import("mermaid")).default
        mermaid.initialize({
          theme: "dark",
          securityLevel: "loose",
          flowchart: { curve: "basis", padding: 20 },
        })
        const { svg } = await mermaid.render("threat-diagram", mermaidData!.diagramSyntax)
        setSvgContent(svg)
        setRenderError(null)
      } catch (e) {
        setRenderError(e instanceof Error ? e.message : "Failed to render diagram")
      }
    }

    renderDiagram()
  }, [mermaidData])

  const handleCopySyntax = () => {
    if (mermaidData) {
      navigator.clipboard.writeText(mermaidData.diagramSyntax)
      toast.success("Mermaid syntax copied to clipboard")
    }
  }

  const handleDownloadSvg = () => {
    if (!svgContent) return
    const blob = new Blob([svgContent], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "threat-model-diagram.svg"
    a.click()
    URL.revokeObjectURL(url)
    toast.success("SVG diagram downloaded")
  }

  if (!result) {
    return <p className="text-sm text-muted-foreground">Run an analysis first to generate diagrams.</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={handleGenerate} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Generate Diagram
        </Button>
        {mermaidData && (
          <>
            <Button variant="outline" onClick={handleCopySyntax} className="gap-2">
              <Copy className="h-4 w-4" /> Copy Mermaid Syntax
            </Button>
            {svgContent && (
              <Button variant="outline" onClick={handleDownloadSvg} className="gap-2">
                <Download className="h-4 w-4" /> Download SVG
              </Button>
            )}
          </>
        )}
      </div>

      {renderError && (
        <Card className="border-destructive">
          <CardContent className="py-4">
            <p className="text-sm text-destructive">Render error: {renderError}</p>
            {mermaidData && (
              <pre className="mt-2 text-xs text-muted-foreground overflow-auto max-h-40">
                {mermaidData.diagramSyntax}
              </pre>
            )}
          </CardContent>
        </Card>
      )}

      {svgContent && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Threat Model Diagram</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              ref={diagramRef}
              className="overflow-auto bg-background rounded-md"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          </CardContent>
        </Card>
      )}

      {mermaidData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mermaid Source</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs text-muted-foreground overflow-auto max-h-60 bg-muted/50 rounded-md p-4">
              {mermaidData.diagramSyntax}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
