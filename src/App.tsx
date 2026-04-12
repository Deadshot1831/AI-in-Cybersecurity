import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ErrorBoundary } from "@/components/shared/ErrorBoundary"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { PageContainer } from "@/components/layout/PageContainer"
import { HomePage } from "@/pages/HomePage"
import { InputPage } from "@/pages/InputPage"
import { AnalysisPage } from "@/pages/AnalysisPage"

const ExportPage = lazy(() =>
  import("@/pages/ExportPage").then((m) => ({ default: m.ExportPage }))
)

function PageFallback() {
  return (
    <PageContainer>
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    </PageContainer>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Toaster theme="system" position="bottom-right" richColors />
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Header />
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<PageContainer><HomePage /></PageContainer>} />
                <Route path="/input" element={<InputPage />} />
                <Route path="/analysis" element={<AnalysisPage />} />
                <Route path="/export" element={<ExportPage />} />
              </Routes>
            </Suspense>
            <Footer />
          </div>
        </BrowserRouter>
      </ErrorBoundary>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default App
