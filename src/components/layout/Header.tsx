import { Link, useLocation } from "react-router-dom"
import { Shield, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/ThemeToggle"
import { ApiKeyInput } from "@/components/shared/ApiKeyInput"
import { LiveModeToggle } from "@/components/shared/LiveModeToggle"
import { cn } from "@/lib/utils"

const navItems = [
  { path: "/", label: "Home" },
  { path: "/input", label: "Input" },
  { path: "/analysis", label: "Analysis" },
  { path: "/export", label: "Export" },
]

export function Header() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <Shield className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline">AI Threat Modeler</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "text-sm",
                  location.pathname === item.path && "font-medium"
                )}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <LiveModeToggle />
            <Separator orientation="vertical" className="h-6" />
            <ApiKeyInput />
            <Separator orientation="vertical" className="h-6" />
          </div>
          <ThemeToggle />
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
                      variant={location.pathname === item.path ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
                <Separator className="my-2" />
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
