import { useEffect, useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Shield, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuthStore } from "@/stores/useAuthStore"
import { toast } from "sonner"

export function ResetPasswordPage() {
  const user = useAuthStore((s) => s.user)
  const error = useAuthStore((s) => s.error)
  const isLoading = useAuthStore((s) => s.isLoading)
  const updatePassword = useAuthStore((s) => s.updatePassword)
  const clearError = useAuthStore((s) => s.clearError)
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [timedOut, setTimedOut] = useState(false)

  // The recovery session is established by the Supabase client exchanging the
  // ?code= in the URL; give it a few seconds before declaring the link dead.
  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 8000)
    return () => clearTimeout(t)
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    clearError()
    if (password.length < 8) return setFieldError("Password must be at least 8 characters")
    if (password !== confirm) return setFieldError("Passwords do not match")
    setFieldError(null)
    await updatePassword(password)
    if (useAuthStore.getState().error) return
    toast.success("Password updated", { description: "You're signed in with your new password." })
    navigate("/", { replace: true })
  }

  const body = user ? (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="new-password">New password</Label>
        <Input
          id="new-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm password</Label>
        <Input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      </div>
      {(fieldError || error) && (
        <Alert variant="destructive">
          <AlertDescription>{fieldError ?? error}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Update password
      </Button>
    </form>
  ) : timedOut || error ? (
    <div className="w-full space-y-4">
      <Alert variant="destructive">
        <AlertDescription>
          {error ?? "This reset link is invalid or has expired. Open it in the same browser you requested it from, or request a new one."}
        </AlertDescription>
      </Alert>
      <Button asChild variant="outline" className="w-full">
        <Link to="/login">Back to sign in</Link>
      </Button>
    </div>
  ) : (
    <>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="text-sm text-muted-foreground">Verifying reset link…</p>
    </>
  )

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-4 text-center">
        <Shield className="h-10 w-10 text-primary" />
        <h2 className="text-2xl font-semibold tracking-tight">Reset password</h2>
        {body}
      </div>
    </div>
  )
}
