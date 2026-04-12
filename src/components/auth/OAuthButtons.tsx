import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/useAuthStore"

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.73.5.67 5.57.67 11.84c0 5.01 3.24 9.26 7.74 10.76.57.1.78-.25.78-.55v-1.92c-3.15.69-3.82-1.52-3.82-1.52-.51-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.66 1.23 3.31.94.1-.74.4-1.23.72-1.51-2.51-.29-5.15-1.26-5.15-5.6 0-1.24.44-2.25 1.16-3.04-.12-.29-.5-1.44.11-3 0 0 .95-.3 3.12 1.16.9-.25 1.87-.38 2.83-.38.96 0 1.93.13 2.83.38 2.16-1.46 3.12-1.16 3.12-1.16.62 1.56.23 2.71.11 3 .72.79 1.16 1.8 1.16 3.04 0 4.35-2.65 5.31-5.17 5.59.41.35.77 1.04.77 2.1v3.11c0 .3.21.66.79.55 4.49-1.5 7.73-5.75 7.73-10.76C23.33 5.57 18.27.5 12 .5Z" />
    </svg>
  )
}

export function OAuthButtons() {
  const signInWithOAuth = useAuthStore((s) => s.signInWithOAuth)
  const isLoading = useAuthStore((s) => s.isLoading)

  return (
    <div className="grid gap-2">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => signInWithOAuth("github")}
        disabled={isLoading}
      >
        <GitHubIcon className="h-4 w-4" />
        Continue with GitHub
      </Button>
    </div>
  )
}
