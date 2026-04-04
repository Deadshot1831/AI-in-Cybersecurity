import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from "@/components/shared/ErrorBoundary"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { PageContainer } from "@/components/layout/PageContainer"
import { HomePage } from "@/pages/HomePage"
import { InputPage } from "@/pages/InputPage"
import { AnalysisPage } from "@/pages/AnalysisPage"
import { ExportPage } from "@/pages/ExportPage"

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <ErrorBoundary>
        <BrowserRouter>
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Header />
            <Routes>
              <Route path="/" element={<PageContainer><HomePage /></PageContainer>} />
              <Route path="/input" element={<InputPage />} />
              <Route path="/analysis" element={<AnalysisPage />} />
              <Route path="/export" element={<ExportPage />} />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default App
