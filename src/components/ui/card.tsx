import * as React from "react"

import { cn } from "@/lib/utils"

type Variant = "default" | "terminal" | "holographic"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant
  hoverEffect?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", hoverEffect = true, children, ...props }, ref) => {
    const base = "relative text-card-foreground transition-[transform,box-shadow,border-color] duration-200"

    if (variant === "terminal") {
      return (
        <div
          ref={ref}
          className={cn(
            base,
            "cyber-chamfer bg-[color:var(--background)] border border-border pt-10",
            hoverEffect && "hover:border-accent hover:shadow-[0_0_6px_#00ff88,0_0_18px_rgba(0,255,136,0.4)] hover:-translate-y-[1px]",
            className
          )}
          {...props}
        >
          <div className="absolute top-0 left-0 right-0 h-7 flex items-center justify-between px-3 border-b border-border bg-[color:var(--muted)]/40">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#ff3366]" />
              <span className="h-2 w-2 rounded-full bg-[#ffaa00]" />
              <span className="h-2 w-2 rounded-full bg-accent" />
            </div>
            <span className="font-[family-name:var(--font-terminal)] text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              // session
            </span>
          </div>
          {children}
        </div>
      )
    }

    if (variant === "holographic") {
      return (
        <div
          ref={ref}
          className={cn(
            base,
            "cyber-chamfer cyber-corners bg-[color:var(--muted)]/30 border border-accent/30 backdrop-blur-sm",
            "shadow-[0_0_5px_#00ff88,0_0_18px_rgba(0,255,136,0.35)]",
            hoverEffect && "hover:border-accent hover:shadow-[0_0_8px_#00ff88,0_0_28px_rgba(0,255,136,0.5)] hover:-translate-y-[1px]",
            className
          )}
          {...props}
        >
          {children}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          base,
          "cyber-chamfer bg-card border border-border",
          hoverEffect && "hover:border-accent hover:shadow-[0_0_5px_#00ff88,0_0_14px_rgba(0,255,136,0.35)] hover:-translate-y-[1px]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4 sm:p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "font-[family-name:var(--font-display)] text-lg font-bold uppercase tracking-[0.1em] text-foreground leading-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground font-[family-name:var(--font-mono)] leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 sm:p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4 sm:p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
