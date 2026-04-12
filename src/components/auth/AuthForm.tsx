import { useState, type FormEvent } from "react"
import { Loader2, Mail, Lock, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuthStore } from "@/stores/useAuthStore"

type Mode = "signin" | "signup"

interface AuthFormProps {
  mode: Mode
  onForgotPassword?: () => void
}

interface FieldErrors {
  email?: string
  password?: string
  fullName?: string
}

function validate(mode: Mode, email: string, password: string, fullName: string): FieldErrors {
  const errors: FieldErrors = {}
  if (!email) {
    errors.email = "Email is required"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address"
  }
  if (!password) {
    errors.password = "Password is required"
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters"
  }
  if (mode === "signup" && !fullName.trim()) {
    errors.fullName = "Name is required"
  }
  return errors
}

export function AuthForm({ mode, onForgotPassword }: AuthFormProps) {
  const signInWithEmail = useAuthStore((s) => s.signInWithEmail)
  const signUpWithEmail = useAuthStore((s) => s.signUpWithEmail)
  const isLoading = useAuthStore((s) => s.isLoading)
  const error = useAuthStore((s) => s.error)
  const clearError = useAuthStore((s) => s.clearError)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    clearError()
    const errors = validate(mode, email, password, fullName)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    if (mode === "signin") {
      await signInWithEmail(email, password)
    } else {
      await signUpWithEmail(email, password, fullName)
    }
  }

  const submitLabel = mode === "signin" ? "Sign In" : "Create Account"

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {mode === "signup" && (
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="Ada Lovelace"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="pl-9"
              aria-invalid={!!fieldErrors.fullName}
              disabled={isLoading}
            />
          </div>
          {fieldErrors.fullName && (
            <p className="text-xs text-destructive">{fieldErrors.fullName}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-9"
            aria-invalid={!!fieldErrors.email}
            disabled={isLoading}
          />
        </div>
        {fieldErrors.email && (
          <p className="text-xs text-destructive">{fieldErrors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          {mode === "signin" && onForgotPassword && (
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs text-primary hover:underline"
            >
              Forgot password?
            </button>
          )}
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-9"
            aria-invalid={!!fieldErrors.password}
            disabled={isLoading}
          />
        </div>
        {fieldErrors.password && (
          <p className="text-xs text-destructive">{fieldErrors.password}</p>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  )
}
