import { useState } from "react"
import { toast } from "sonner"
import { Copy, Download, RefreshCw, Eye, Code } from "lucide-react"
import { marked } from "marked"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MarkdownExportProps {
  title: string
  markdown: string | null
  filename: string
  onGenerate: () => void
  wordCount?: number
}

export function MarkdownExport({
  title,
  markdown,
  filename,
  onGenerate,
  wordCount,
}: MarkdownExportProps) {
  const [view, setView] = useState<"preview" | "source">("preview")

  const handleCopy = () => {
    if (markdown) {
      navigator.clipboard.writeText(markdown)
      toast.success("Markdown copied to clipboard")
    }
  }

  const handleDownload = () => {
    if (!markdown) return
    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`${title} downloaded`)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button onClick={onGenerate} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Generate {title}
        </Button>
        {markdown && (
          <>
            <Button variant="outline" onClick={handleCopy} className="gap-2">
              <Copy className="h-4 w-4" /> Copy Markdown
            </Button>
            <Button variant="outline" onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" /> Download .md
            </Button>
          </>
        )}
      </div>

      {markdown && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{title}</CardTitle>
              {wordCount && (
                <span className="text-xs text-muted-foreground">{wordCount} words</span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={view} onValueChange={(v) => setView(v as "preview" | "source")}>
              <TabsList className="mb-3">
                <TabsTrigger value="preview" className="gap-1">
                  <Eye className="h-3 w-3" /> Preview
                </TabsTrigger>
                <TabsTrigger value="source" className="gap-1">
                  <Code className="h-3 w-3" /> Source
                </TabsTrigger>
              </TabsList>
              <TabsContent value="preview">
                <ScrollArea className="h-[500px]">
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: marked(markdown) as string }}
                  />
                </ScrollArea>
              </TabsContent>
              <TabsContent value="source">
                <ScrollArea className="h-[500px]">
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap bg-muted/50 rounded-md p-4">
                    {markdown}
                  </pre>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
