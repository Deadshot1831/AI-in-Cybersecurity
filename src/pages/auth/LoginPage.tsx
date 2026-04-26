import { useEffect, useState } from "react"
import { Link, Navigate, useLocation } from "react-router-dom"
import { Shield, ShieldCheck, Sparkles, Lock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthForm } from "@/components/auth/AuthForm"
import { OAuthButtons } from "@/components/auth/OAuthButtons"
import { useAuthStore } from "@/stores/useAuthStore"
import { toast } from "sonner"

type View = "tabs" | "forgot"

export function LoginPage() {
  const user = useAuthStore((s) => s.user)
  const isDemo = useAuthStore((s) => s.isDemo)
  const clearError = useAuthStore((s) => s.clearError)
  const resetPassword = useAuthStore((s) => s.resetPassword)
  const location = useLocation()
  const authError = useAuthStore((s) => s.error)

  const [view, setView] = useState<View>("tabs")
  const [tab, setTab] = useState<"signin" | "signup">("signin")
  const [resetEmail, setResetEmail] = useState("")
  const [resetSent, setResetSent] = useState(false)

  useEffect(() => {
    clearError()
  }, [tab, view, clearError])

  if (user) {
    const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/"
    return <Navigate to={from} replace />
  }

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail) return
    clearError()
    await resetPassword(resetEmail)
    if (useAuthStore.getState().error) {
      toast.error("Reset link could not be sent", {
        description: useAuthStore.getState().error ?? undefined,
      })
      return
    }
    setResetSent(true)
    toast.success("Password reset email sent", {
      description: "Check your inbox for a reset link.",
    })
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Hero panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary/15 via-background to-background lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.18),transparent_55%)]" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" className="inline-flex items-center gap-2 text-lg font-semibold">
            <Shield className="h-6 w-6 text-primary" />
            AI Threat Modeler
          </Link>

          <div className="max-w-md space-y-6">
            <h1 className="text-4xl font-bold leading-tight tracking-tight">
              Model threats faster.
              <br />
              Ship securer systems.
            </h1>
            <p className="text-lg text-muted-foreground">
              Sign in to run STRIDE-driven analyses, generate executive reports, and track risks across your architecture.
            </p>
            <div className="space-y-3 pt-2">
              <Feature icon={<ShieldCheck className="h-5 w-5 text-primary" />} label="OWASP-aligned security analysis" />
              <Feature icon={<Sparkles className="h-5 w-5 text-primary" />} label="AI-powered threat generation" />
              <Feature icon={<Lock className="h-5 w-5 text-primary" />} label="Secure session management" />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} AI Threat Modeler. All rights reserved.
          </p>
        </div>
      </div>

      {/* Auth panel */}
      <div className="flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-md space-y-5 sm:space-y-6">
          <div className="space-y-2 text-center lg:hidden">
            <div className="inline-flex items-center gap-2 text-lg font-semibold">
              <Shield className="h-6 w-6 text-primary" />
              AI Threat Modeler
            </div>
          </div>

          {isDemo && (
            <Alert>
              <AlertDescription className="text-xs">
                Running in demo mode. Set <code className="rounded bg-muted px-1">VITE_SUPABASE_URL</code> and{" "}
                <code className="rounded bg-muted px-1">VITE_SUPABASE_ANON_KEY</code> to enable real auth.
              </AlertDescription>
            </Alert>
          )}

          {view === "tabs" ? (
            <>
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold tracking-tight">Welcome</h2>
                <p className="text-sm text-muted-foreground">
                  Sign in to your account or create a new one
                </p>
              </div>

              <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="mt-6">
                  <AuthForm mode="signin" onForgotPassword={() => setView("forgot")} />
                </TabsContent>

                <TabsContent value="signup" className="mt-6">
                  <AuthForm mode="signup" />
                </TabsContent>
              </Tabs>

              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                  OR CONTINUE WITH
                </span>
              </div>

              <OAuthButtons />

              <p className="text-center text-xs text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">Reset password</h2>
                <p className="text-sm text-muted-foreground">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              {resetSent ? (
                <Alert>
                  <AlertDescription>
                    If an account exists for <strong>{resetEmail}</strong>, a reset link has been sent.
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                  {authError && (
                    <Alert variant="destructive">
                      <AlertDescription>{authError}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={isDemo}>
                    Send reset link
                  </Button>
                </form>
              )}

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setView("tabs")
                  setResetSent(false)
                  setResetEmail("")
                }}
              >
                Back to sign in
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border/60 bg-background/60">
        {icon}
      </div>
      <span>{label}</span>
    </div>
  )
}
