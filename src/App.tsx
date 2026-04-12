import { lazy, Suspense, useEffect } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ErrorBoundary } from "@/components/shared/ErrorBoundary"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { PageContainer } from "@/components/layout/PageContainer"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { HomePage } from "@/pages/HomePage"
import { InputPage } from "@/pages/InputPage"
import { AnalysisPage } from "@/pages/AnalysisPage"
import { LoginPage } from "@/pages/auth/LoginPage"
import { AuthCallbackPage } from "@/pages/auth/AuthCallbackPage"
import { useAuthStore } from "@/stores/useAuthStore"

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

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      {children}
      <Footer />
    </div>
  )
}

function AppRoutes() {
  const location = useLocation()
  const isAuthRoute =
    location.pathname.startsWith("/login") || location.pathname.startsWith("/auth/")

  if (isAuthRoute) {
    return (
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
        </Routes>
      </Suspense>
    )
  }

  return (
    <AppShell>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<PageContainer><HomePage /></PageContainer>} />
          <Route
            path="/input"
            element={
              <ProtectedRoute>
                <InputPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analysis"
            element={
              <ProtectedRoute>
                <AnalysisPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/export"
            element={
              <ProtectedRoute>
                <ExportPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </AppShell>
  )
}

function App() {
  const initialize = useAuthStore((s) => s.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <ErrorBoundary>
          <BrowserRouter>
            <Toaster theme="system" position="bottom-right" richColors />
            <AppRoutes />
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default App
