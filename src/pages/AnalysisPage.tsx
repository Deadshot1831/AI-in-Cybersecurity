import { useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PageContainer } from "@/components/layout/PageContainer"
import { AnalysisPanel } from "@/components/analysis/AnalysisPanel"
import { RiskSummary } from "@/components/analysis/RiskSummary"
import { ThreatCard } from "@/components/analysis/ThreatCard"
import { ThreatFilters } from "@/components/analysis/ThreatFilters"
import { useAnalysisStore } from "@/stores/useAnalysisStore"
import { useSystemStore } from "@/stores/useSystemStore"
import { runThreatAnalysis } from "@/services/analysis/threatEngine"

export function AnalysisPage() {
  const navigate = useNavigate()
  const { status, result, getFilteredThreats } = useAnalysisStore()
  const architecture = useSystemStore((s) => s.architecture)

  const filteredThreats = getFilteredThreats()

  const componentNames = useMemo(() => {
    const names: Record<string, string> = {}
    if (architecture) {
      architecture.components.forEach((c) => {
        names[c.id] = c.name
      })
    }
    // Also add mock component names
    if (result) {
      const mockNames: Record<string, string> = {
        "comp-ui": "Chat Frontend",
        "comp-gateway": "API Gateway",
        "comp-llm": "Claude LLM Endpoint",
        "comp-rag": "RAG Pipeline",
        "comp-vector": "Pinecone Vector Store",
        "comp-ingest": "Document Ingestion Service",
        "comp-auth": "Auth Service",
      }
      Object.assign(names, mockNames)
    }
    return names
  }, [architecture, result])

  useEffect(() => {
    if (status === "idle") {
      runThreatAnalysis()
    }
  }, [])

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Threat Analysis</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {result
              ? `${result.threats.length} threats identified across ${result.frameworksCovered.length} frameworks`
              : "Running analysis..."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/input")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Input
          </Button>
          {status === "complete" && (
            <Button onClick={() => navigate("/export")} className="gap-2">
              <FileDown className="h-4 w-4" /> Export Results
            </Button>
          )}
        </div>
      </div>

      <AnalysisPanel />

      {status === "complete" && result && (
        <div className="space-y-6">
          <RiskSummary />

          {result.executiveSummary && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Executive Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {result.executiveSummary}
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-base">Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <ThreatFilters />
              </CardContent>
            </Card>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Identified Threats ({filteredThreats.length})
                </h2>
              </div>
              <ScrollArea className="h-[calc(100vh-500px)] min-h-[400px]">
                <div className="space-y-3 pr-4">
                  {filteredThreats.map((threat) => (
                    <ThreatCard
                      key={threat.id}
                      threat={threat}
                      componentNames={componentNames}
                    />
                  ))}
                  {filteredThreats.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No threats match the current filters. Try adjusting your filter criteria.
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  )
}
