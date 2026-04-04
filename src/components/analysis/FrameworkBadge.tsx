import { Badge } from "@/components/ui/badge"
import { FRAMEWORK_COLORS, FRAMEWORK_LABELS } from "@/lib/constants"
import type { FrameworkType } from "@/types/threat"

interface FrameworkBadgeProps {
  framework: FrameworkType
  className?: string
}

export function FrameworkBadge({ framework, className }: FrameworkBadgeProps) {
  return (
    <Badge variant="outline" className={`${FRAMEWORK_COLORS[framework]} ${className ?? ""}`}>
      {FRAMEWORK_LABELS[framework]}
    </Badge>
  )
}
