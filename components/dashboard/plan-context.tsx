"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Define plan types and features
export type PlanType = "free" | "standard" | "premium"

export interface PlanLimits {
  products: number
  customers: number
  users: number
  shops: number
}

export interface PlanDetails {
  id: PlanType
  name: string
  price: number
  period: string
  description: string
  features: { name: string; included: boolean }[]
  limits: PlanLimits
  popular: boolean
}

// Plan data
export const PLANS: Record<PlanType, PlanDetails> = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    description: "Basic features for small shops just getting started",
    features: [
      { name: "Up to 100 products", included: true },
      { name: "Up to 50 customers", included: true },
      { name: "Basic reporting", included: true },
      { name: "1 user account", included: true },
      { name: "Email support", included: false },
      { name: "Advanced analytics", included: false },
      { name: "Multiple shop management", included: false },
      { name: "Custom branding", included: false },
    ],
    limits: {
      products: 100,
      customers: 50,
      users: 1,
      shops: 1,
    },
    popular: false,
  },
  standard: {
    id: "standard",
    name: "Standard",
    price: 999,
    period: "per month",
    description: "Everything you need for a growing business",
    features: [
      { name: "Up to 1,000 products", included: true },
      { name: "Up to 500 customers", included: true },
      { name: "Advanced reporting", included: true },
      { name: "5 user accounts", included: true },
      { name: "Email & phone support", included: true },
      { name: "Basic analytics", included: true },
      { name: "Multiple shop management", included: false },
      { name: "Custom branding", included: false },
    ],
    limits: {
      products: 1000,
      customers: 500,
      users: 5,
      shops: 1,
    },
    popular: true,
  },
  premium: {
    id: "premium",
    name: "Premium",
    price: 2499,
    period: "per month",
    description: "Advanced features for larger businesses with multiple shops",
    features: [
      { name: "Unlimited products", included: true },
      { name: "Unlimited customers", included: true },
      { name: "Advanced reporting", included: true },
      { name: "Unlimited user accounts", included: true },
      { name: "Priority support", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Multiple shop management", included: true },
      { name: "Custom branding", included: true },
    ],
    limits: {
      products: Number.POSITIVE_INFINITY,
      customers: Number.POSITIVE_INFINITY,
      users: Number.POSITIVE_INFINITY,
      shops: 5,
    },
    popular: false,
  },
}

// Mock usage data
export const USAGE_DATA = {
  products: 78,
  customers: 42,
  users: 3,
  shops: 1,
}

// Create context
interface PlanContextType {
  currentPlan: PlanType
  planDetails: PlanDetails
  usage: typeof USAGE_DATA
  switchPlan: (plan: PlanType) => Promise<boolean>
  isPlanSwitching: boolean
  checkFeatureAccess: (feature: keyof PlanLimits) => {
    hasAccess: boolean
    isApproachingLimit: boolean
    isAtLimit: boolean
    usage: number
    limit: number
    percentage: number
  }
}

// Create a default context value to avoid undefined errors
const defaultContextValue: PlanContextType = {
  currentPlan: "standard",
  planDetails: PLANS.standard,
  usage: USAGE_DATA,
  switchPlan: async () => false,
  isPlanSwitching: false,
  checkFeatureAccess: () => ({
    hasAccess: true,
    isApproachingLimit: false,
    isAtLimit: false,
    usage: 0,
    limit: 0,
    percentage: 0,
  }),
}

const PlanContext = createContext<PlanContextType>(defaultContextValue)

export function PlanProvider({ children }: { children: ReactNode }) {
  const [currentPlan, setCurrentPlan] = useState<PlanType>("standard")
  const [isPlanSwitching, setIsPlanSwitching] = useState(false)

  // Get current plan details
  const planDetails = PLANS[currentPlan]

  // Function to switch plans
  const switchPlan = async (plan: PlanType): Promise<boolean> => {
    setIsPlanSwitching(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update plan
    setCurrentPlan(plan)
    setIsPlanSwitching(false)
    return true
  }

  // Function to check if a feature is accessible based on current plan
  const checkFeatureAccess = (feature: keyof PlanLimits) => {
    if (!planDetails || !planDetails.limits) {
      return {
        hasAccess: true,
        isApproachingLimit: false,
        isAtLimit: false,
        usage: 0,
        limit: 0,
        percentage: 0,
      }
    }

    const limit = planDetails.limits[feature] || 0
    const usage = USAGE_DATA[feature] || 0
    const percentage = limit === Number.POSITIVE_INFINITY ? 0 : Math.round((usage / limit) * 100)

    return {
      hasAccess: usage <= limit,
      isApproachingLimit: percentage >= 80 && percentage < 100,
      isAtLimit: percentage >= 100,
      usage,
      limit,
      percentage,
    }
  }

  return (
    <PlanContext.Provider
      value={{
        currentPlan,
        planDetails,
        usage: USAGE_DATA,
        switchPlan,
        isPlanSwitching,
        checkFeatureAccess,
      }}
    >
      {children}
    </PlanContext.Provider>
  )
}

export function usePlan() {
  const context = useContext(PlanContext)
  return context
}

