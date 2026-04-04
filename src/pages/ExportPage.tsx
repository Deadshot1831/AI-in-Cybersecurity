import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PageContainer } from "@/components/layout/PageContainer"
import { ExportCenter } from "@/components/export/ExportCenter"
import { useAnalysisStore } from "@/stores/useAnalysisStore"

export function ExportPage() {
  const navigate = useNavigate()
  const result = useAnalysisStore((s) => s.result)

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Export Center</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Export your threat analysis as diagrams, reports, and presentations.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/analysis")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Analysis
        </Button>
      </div>

      {!result ? (
        <Alert>
          <AlertDescription>
            No analysis results available. Please{" "}
            <button
              className="underline font-medium"
              onClick={() => navigate("/input")}
            >
              run a threat analysis
            </button>{" "}
            first.
          </AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Export Formats</CardTitle>
            <CardDescription>
              Choose an export format and generate your threat model artifacts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExportCenter />
          </CardContent>
        </Card>
      )}
    </PageContainer>
  )
}
