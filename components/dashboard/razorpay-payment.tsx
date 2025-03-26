"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { usePlan, type PlanType, PLANS } from "@/components/dashboard/plan-context"
import { Loader2 } from "lucide-react"

declare global {
  interface Window {
    Razorpay: any
  }
}

interface RazorpayPaymentProps {
  planId: PlanType
  onSuccess: () => void
  onCancel: () => void
}

export function RazorpayPayment({ planId, onSuccess, onCancel }: RazorpayPaymentProps) {
  const { switchPlan } = usePlan()
  const [isLoading, setIsLoading] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => setScriptLoaded(true)

    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const handlePayment = async () => {
    if (planId === "free") {
      // Free plan doesn't need payment
      setIsLoading(true)
      const success = await switchPlan(planId)
      setIsLoading(false)
      if (success) onSuccess()
      return
    }

    if (!scriptLoaded) {
      alert("Payment gateway is loading. Please try again.")
      return
    }

    setIsLoading(true)

    const plan = PLANS[planId]

    // Create a Razorpay order (in a real app, this would be done on the server)
    const options = {
      key: "rzp_test_1DP5mmOlF5G5ag", // Razorpay test key
      amount: plan.price * 100, // Amount in paise
      currency: "INR",
      name: "AgroBill",
      description: `Upgrade to ${plan.name} Plan`,
      image: "https://example.com/logo.png", // Replace with your logo URL
      handler: async (response: any) => {
        // Handle successful payment
        console.log("Payment successful:", response)
        const success = await switchPlan(planId)
        setIsLoading(false)
        if (success) onSuccess()
      },
      prefill: {
        name: "Rahul Sharma",
        email: "rahul@example.com",
        contact: "+919876543210",
      },
      notes: {
        plan_id: planId,
      },
      theme: {
        color: "#22c55e",
      },
      modal: {
        ondismiss: () => {
          setIsLoading(false)
          onCancel()
        },
      },
    }

    try {
      // For demo purposes, we'll simulate a successful payment
      // In a real app, you would use the actual Razorpay checkout
      setTimeout(async () => {
        const success = await switchPlan(planId)
        setIsLoading(false)
        if (success) onSuccess()
      }, 2000)

      // Uncomment this to use the actual Razorpay checkout
      // const razorpay = new window.Razorpay(options)
      // razorpay.open()
    } catch (error) {
      console.error("Razorpay error:", error)
      setIsLoading(false)
      alert("Payment failed to initialize. Please try again.")
    }
  }

  return (
    <Button onClick={handlePayment} disabled={isLoading} className="w-full">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : planId === "free" ? (
        "Downgrade to Free"
      ) : (
        `Upgrade to ${PLANS[planId].name}`
      )}
    </Button>
  )
}

