import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PageContainer } from "@/components/layout/PageContainer"
import { ExportCenter } from "@/components/export/ExportCenter"
import { useAnalysisStore } from "@/stores/useAnalysisStore"
import { useSettingsStore } from "@/stores/useSettingsStore"

export function ExportPage() {
  const navigate = useNavigate()
  const result = useAnalysisStore((s) => s.result)
  const plainEnglish = useSettingsStore((s) => s.plainEnglish)

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {plainEnglish ? "Download Your Report" : "Export Center"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {plainEnglish
              ? "Save your security report as a diagram, document, or presentation to share with your team."
              : "Export your threat analysis as diagrams, reports, and presentations."}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/analysis")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> {plainEnglish ? "Back to Report" : "Back to Analysis"}
        </Button>
      </div>

      {!result ? (
        <Alert>
          <AlertDescription>
            {plainEnglish ? (
              <>
                No report available yet.{" "}
                <button
                  className="underline font-medium"
                  onClick={() => navigate("/input")}
                >
                  Check your AI system
                </button>{" "}
                first to generate a report.
              </>
            ) : (
              <>
                No analysis results available. Please{" "}
                <button
                  className="underline font-medium"
                  onClick={() => navigate("/input")}
                >
                  run a threat analysis
                </button>{" "}
                first.
              </>
            )}
          </AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{plainEnglish ? "Choose a Format" : "Export Formats"}</CardTitle>
            <CardDescription>
              {plainEnglish
                ? "Pick how you'd like to save or share your security report."
                : "Choose an export format and generate your threat model artifacts."}
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
