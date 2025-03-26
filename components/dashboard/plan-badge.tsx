"use client"

import { Badge } from "@/components/ui/badge"
import { Crown } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePlan, type PlanType } from "./plan-context"

interface PlanBadgeProps {
  className?: string
  showIcon?: boolean
  plan?: PlanType // Optional override for static contexts
}

export function PlanBadge({ className, showIcon = true, plan }: PlanBadgeProps) {
  // Use the provided plan prop or fall back to the context
  const planContext = usePlan()
  const currentPlan = plan || planContext.currentPlan

  const planColors = {
    free: "bg-muted text-muted-foreground",
    standard: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    premium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  }

  const planNames = {
    free: "Free",
    standard: "Standard",
    premium: "Premium",
  }

  return (
    <Badge variant="outline" className={cn("flex items-center gap-1 font-normal", planColors[currentPlan], className)}>
      {showIcon && currentPlan === "premium" && <Crown className="h-3 w-3" />}
      {planNames[currentPlan]}
    </Badge>
  )
}

