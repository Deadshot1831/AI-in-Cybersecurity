import { useState } from "react"
import { Download, RefreshCw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useAnalysisStore } from "@/stores/useAnalysisStore"
import { useSystemStore } from "@/stores/useSystemStore"
import { useExportStore } from "@/stores/useExportStore"
import { generateLinkedInSlides } from "@/services/export/linkedinGenerator"
import { generateCarouselPdf } from "@/services/export/pdfGenerator"
import { MOCK_SYSTEM } from "@/services/mock/mockSystem"

export function LinkedInExport() {
  const result = useAnalysisStore((s) => s.result)
  const architecture = useSystemStore((s) => s.architecture)
  const { linkedinData, setLinkedInData } = useExportStore()
  const [isPdfGenerating, setIsPdfGenerating] = useState(false)

  const system = architecture ?? MOCK_SYSTEM

  const handleGenerate = () => {
    if (!result) return
    const data = generateLinkedInSlides(system, result)
    setLinkedInData(data)
  }

  const handleDownloadPdf = async () => {
    if (!linkedinData) return
    setIsPdfGenerating(true)
    try {
      const blob = await generateCarouselPdf(linkedinData.slides)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `linkedin-carousel-${system.name.toLowerCase().replace(/\s+/g, "-")}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error("PDF generation failed:", e)
    } finally {
      setIsPdfGenerating(false)
    }
  }

  if (!result) {
    return <p className="text-sm text-muted-foreground">Run an analysis first to generate carousel.</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={handleGenerate} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Generate Slides
        </Button>
        {linkedinData && (
          <Button
            variant="outline"
            onClick={handleDownloadPdf}
            disabled={isPdfGenerating}
            className="gap-2"
          >
            {isPdfGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Download PDF
          </Button>
        )}
      </div>

      {linkedinData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              LinkedIn Carousel Preview ({linkedinData.slides.length} slides)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {linkedinData.slides.map((slide) => (
                  <Card
                    key={slide.slideNumber}
                    className="bg-slate-900 text-white border-slate-700 aspect-square flex flex-col"
                  >
                    <CardContent className="flex flex-col justify-center flex-1 p-6">
                      <div className="flex items-center justify-between mb-1">
                        <div className="w-10 h-1 bg-blue-500 rounded" />
                        <Badge variant="secondary" className="text-xs">
                          {slide.slideNumber}/{linkedinData.slides.length}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold mb-4 text-slate-100">
                        {slide.title}
                      </h3>
                      <div className="space-y-2">
                        {slide.bullets.map((bullet, i) => (
                          <p key={i} className="text-sm text-slate-300">
                            {bullet}
                          </p>
                        ))}
                      </div>
                      {slide.footer && (
                        <p className="text-xs text-slate-500 mt-auto pt-4">
                          {slide.footer}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
