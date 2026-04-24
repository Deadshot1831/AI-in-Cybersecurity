import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { LogOut, Loader2, User as UserIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/useAuthStore"

interface UserMenuProps {
  variant?: "header" | "sheet"
}

export function UserMenu({ variant = "header" }: UserMenuProps) {
  const user = useAuthStore((s) => s.user)
  const signOut = useAuthStore((s) => s.signOut)
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)

  if (!user) return null

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ??
    user.email ??
    "Operator"

  const initial = displayName.charAt(0).toUpperCase()

  const handleLogout = async () => {
    setBusy(true)
    try {
      await signOut()
      toast.success("Signed out", { description: "Session terminated." })
      navigate("/login", { replace: true })
    } catch {
      toast.error("Sign out failed", { description: "Try again." })
    } finally {
      setBusy(false)
    }
  }

  if (variant === "sheet") {
    return (
      <div className="flex flex-col gap-2 px-4 py-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="grid h-7 w-7 place-items-center border border-accent/60 cyber-chamfer-sm text-accent font-[family-name:var(--font-terminal)] text-[11px]">
            {initial}
          </span>
          <span className="truncate font-[family-name:var(--font-mono)]">
            {displayName}
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={busy}
          className="w-full justify-start"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
          ) : (
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
          )}
          Log out
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className="hidden lg:flex items-center gap-2 font-[family-name:var(--font-terminal)] text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
        title={displayName}
      >
        <span className="grid h-6 w-6 place-items-center border border-accent/60 cyber-chamfer-sm text-accent">
          <UserIcon className="h-3 w-3" strokeWidth={1.5} />
        </span>
        <span className="max-w-[120px] truncate text-foreground">
          {displayName}
        </span>
      </span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        disabled={busy}
        className="text-[10px] px-2 text-muted-foreground hover:text-accent"
        aria-label="Log out"
        title="Log out"
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
        ) : (
          <LogOut className="h-4 w-4" strokeWidth={1.5} />
        )}
        <span className="hidden xl:inline">Logout</span>
      </Button>
    </div>
  )
}
