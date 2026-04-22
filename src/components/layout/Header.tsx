import { Link, useLocation } from "react-router-dom"
import { Shield, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ApiKeyInput } from "@/components/shared/ApiKeyInput"
import { LiveModeToggle } from "@/components/shared/LiveModeToggle"
import { PlainEnglishToggle } from "@/components/shared/PlainEnglishToggle"
import { useSettingsStore } from "@/stores/useSettingsStore"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { path: "/", label: "Home", plainLabel: "Home" },
  { path: "/input", label: "Input", plainLabel: "Describe" },
  { path: "/analysis", label: "Analysis", plainLabel: "Report" },
  { path: "/export", label: "Export", plainLabel: "Download" },
]

export function Header() {
  const location = useLocation()
  const plainEnglish = useSettingsStore((s) => s.plainEnglish)
  const navItems = NAV_ITEMS

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md">
      {/* HUD status strip */}
      <div className="h-1 w-full bg-gradient-to-r from-accent via-[color:var(--accent-tertiary)] to-[color:var(--accent-secondary)] opacity-80" />
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group flex items-center gap-2 font-[family-name:var(--font-display)] uppercase tracking-[0.22em] text-sm font-bold"
        >
          <span className="relative grid h-7 w-7 place-items-center border border-accent cyber-chamfer-sm text-accent transition-shadow group-hover:shadow-[0_0_6px_#00ff88,0_0_14px_rgba(0,255,136,0.6)]">
            <Shield className="h-4 w-4" strokeWidth={1.5} />
          </span>
          <span className="hidden sm:flex items-baseline gap-1.5">
            <span className="text-muted-foreground text-[10px] tracking-[0.3em]">//</span>
            <span className="text-foreground">AI Threat</span>
            <span className="text-accent">Modeler</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-0">
          {navItems.map((item) => {
            const active = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  data-active={active}
                  className={cn(
                    "nav-underline px-3 text-[10px]",
                    active
                      ? "text-accent"
                      : "text-muted-foreground hover:text-accent"
                  )}
                >
                  {plainEnglish ? item.plainLabel : item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <PlainEnglishToggle />
            <Separator orientation="vertical" className="h-5 bg-border" />
            <LiveModeToggle />
            <Separator orientation="vertical" className="h-5 bg-border" />
            <ApiKeyInput />
            <Separator orientation="vertical" className="h-5 bg-border" />
          </div>
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col gap-2 mt-8">
                {navItems.map((item) => (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={location.pathname === item.path ? "default" : "ghost"}
                      className="w-full justify-start"
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
                <Separator className="my-2" />
                <div className="flex items-center gap-2 px-4 py-2">
                  <PlainEnglishToggle />
                </div>
                <div className="flex items-center gap-2 px-4 py-2">
                  <LiveModeToggle />
                </div>
                <ApiKeyInput />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
