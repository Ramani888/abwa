"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePlan } from "./plan-context"

interface PlanLimitsAlertProps {
  resourceType: "products" | "customers" | "users" | "shops"
  showWhen?: "approaching" | "reached" | "both"
}

export function PlanLimitsAlert({ resourceType, showWhen = "both" }: PlanLimitsAlertProps) {
  const { checkFeatureAccess } = usePlan()

  try {
    const { isApproachingLimit, isAtLimit, usage, limit, percentage } = checkFeatureAccess(resourceType)

    // Only show when approaching (>80%) or reached (>=100%) based on showWhen prop
    if (
      (showWhen === "approaching" && !isApproachingLimit) ||
      (showWhen === "reached" && !isAtLimit) ||
      (showWhen === "both" && !isApproachingLimit && !isAtLimit)
    ) {
      return null
    }

    const resourceNames = {
      products: "products",
      customers: "customers",
      users: "user accounts",
      shops: "shops",
    }

    return (
      <Alert variant={isAtLimit ? "destructive" : "default"} className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{isAtLimit ? "Plan limit reached" : "Plan limit approaching"}</AlertTitle>
        <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>
            {isAtLimit
              ? `You've reached your plan limit of ${limit} ${resourceNames[resourceType]}.`
              : `You're using ${usage} of ${limit} available ${resourceNames[resourceType]} (${Math.round(percentage)}%).`}
          </span>
          <Link href="/dashboard/plans">
            <Button size="sm" variant={isAtLimit ? "default" : "outline"}>
              Upgrade Plan
            </Button>
          </Link>
        </AlertDescription>
      </Alert>
    )
  } catch (error) {
    console.error("Error in PlanLimitsAlert:", error)
    return null
  }
}

