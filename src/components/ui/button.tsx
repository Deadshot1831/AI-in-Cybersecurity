import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-[family-name:var(--font-terminal)] uppercase tracking-[0.18em] text-xs font-medium",
    "transition-[background-color,color,box-shadow,transform,border-color] duration-150 ease-out",
    "active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-40",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:stroke-[1.5]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "cyber-chamfer-sm bg-transparent text-accent",
          "border-2 border-accent",
          "hover:bg-accent hover:text-[color:var(--accent-foreground)]",
          "hover:shadow-[0_0_5px_#00ff88,0_0_20px_rgba(0,255,136,0.55)]",
        ].join(" "),
        destructive: [
          "cyber-chamfer-sm bg-transparent text-[color:var(--destructive)]",
          "border-2 border-[color:var(--destructive)]",
          "hover:bg-[color:var(--destructive)] hover:text-[color:var(--destructive-foreground)]",
          "hover:shadow-[0_0_5px_#ff3366,0_0_20px_rgba(255,51,102,0.55)]",
        ].join(" "),
        outline: [
          "cyber-chamfer-sm bg-transparent text-foreground",
          "border border-border",
          "hover:border-accent hover:text-accent",
          "hover:shadow-[0_0_4px_#00ff88,0_0_12px_rgba(0,255,136,0.4)]",
        ].join(" "),
        secondary: [
          "cyber-chamfer-sm bg-transparent text-[color:var(--accent-secondary)]",
          "border-2 border-[color:var(--accent-secondary)]",
          "hover:bg-[color:var(--accent-secondary)] hover:text-[color:var(--background)]",
          "hover:shadow-[0_0_5px_#ff00ff,0_0_20px_rgba(255,0,255,0.6)]",
        ].join(" "),
        ghost: "text-foreground hover:text-accent hover:bg-accent/10",
        link: "text-accent underline-offset-4 hover:underline hover:text-[color:var(--accent-tertiary)]",
        glitch: [
          "cyber-chamfer-sm bg-accent text-[color:var(--accent-foreground)]",
          "border-2 border-accent",
          "hover:brightness-110 hover:shadow-[0_0_10px_#00ff88,0_0_28px_rgba(0,255,136,0.7)]",
        ].join(" "),
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-[10px]",
        lg: "h-12 px-8 text-sm",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
