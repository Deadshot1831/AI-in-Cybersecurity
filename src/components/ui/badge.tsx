import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1 border px-2 py-0.5",
    "font-[family-name:var(--font-terminal)] uppercase tracking-[0.2em] text-[10px] font-medium",
    "cyber-chamfer-sm transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "border-accent bg-transparent text-accent",
        secondary: "border-[color:var(--accent-secondary)] bg-transparent text-[color:var(--accent-secondary)]",
        destructive: "border-[color:var(--destructive)] bg-transparent text-[color:var(--destructive)]",
        outline: "border-border bg-transparent text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
