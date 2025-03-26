"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePlan, PLANS } from "@/components/dashboard/plan-context"

// Replace the entire function with a simplified version without payment integration
export default function PlansPage() {
  const { currentPlan, planDetails, usage } = usePlan()

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Subscription Plans</h2>
        <p className="text-muted-foreground">Choose the right plan for your business needs</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {Object.values(PLANS).map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "flex flex-col",
              plan.popular && "border-primary shadow-md",
              currentPlan === plan.id && "bg-muted/50",
            )}
          >
            <CardHeader>
              {plan.popular && (
                <Badge className="w-fit mb-2" variant="default">
                  Popular
                </Badge>
              )}
              <CardTitle>{plan.name}</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">₹{plan.price}</span>
                <span className="text-sm text-muted-foreground">/{plan.period}</span>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2">
                {plan?.features?.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    {feature.included ? (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className={cn(!feature.included && "text-muted-foreground")}>{feature.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {currentPlan === plan.id ? (
                <Button className="w-full" variant="outline" disabled>
                  Current Plan
                </Button>
              ) : (
                <Button className="w-full" variant={plan.id === "free" ? "outline" : "default"}>
                  {currentPlan === "free" ? "Upgrade" : plan.id === "free" ? "Downgrade" : "Switch"}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Current Usage
          </CardTitle>
          <CardDescription>Your current plan limits and usage statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {planDetails && planDetails.limits ? (
              Object.entries(planDetails.limits).map(([key, limit]) => {
                if (!usage) return null
                const resourceKey = key as keyof typeof usage
                const usageValue = usage[resourceKey] || 0
                const limitValue = limit || 0
                const percentage =
                  limitValue === Number.POSITIVE_INFINITY ? 0 : Math.round((usageValue / limitValue) * 100)

                return (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium capitalize">{key}</span>
                      <span className="text-sm text-muted-foreground">
                        {usageValue} / {limitValue === Number.POSITIVE_INFINITY ? "Unlimited" : limitValue}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          percentage > 90 ? "bg-destructive" : percentage > 70 ? "bg-amber-500" : "bg-primary",
                        )}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="col-span-4 text-center py-4">
                <p className="text-muted-foreground">Plan information is not available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

