import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { Shield } from "lucide-react"
import { useAuthStore } from "@/stores/useAuthStore"

export function AuthCallbackPage() {
  const user = useAuthStore((s) => s.user)
  const error = useAuthStore((s) => s.error)
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 8000)
    return () => clearTimeout(t)
  }, [])

  if (user) return <Navigate to="/" replace />
  if (error || timedOut) {
    return <Navigate to="/login" replace state={{ error: error ?? "Sign-in timed out. Please try again." }} />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-center">
        <Shield className="h-10 w-10 text-primary" />
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Completing sign-in…</p>
      </div>
    </div>
  )
}
