import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-[family-name:var(--font-terminal)] text-sm text-accent"
          style={{ textShadow: "0 0 6px rgba(0, 255, 136, 0.6)" }}
        >
          &gt;
        </span>
        <input
          type={type}
          className={cn(
            "cyber-chamfer-sm flex h-10 w-full border border-border bg-input pl-8 pr-3 py-2",
            "font-[family-name:var(--font-mono)] text-sm text-accent",
            "placeholder:text-muted-foreground placeholder:uppercase placeholder:tracking-[0.15em]",
            "transition-[border-color,box-shadow] duration-200",
            "focus-visible:outline-none focus-visible:border-accent focus-visible:shadow-[0_0_4px_#00ff88,0_0_12px_rgba(0,255,136,0.45)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
