"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShoppingBag } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Here you would implement actual logout logic
    // For now, we'll just simulate it
    const timer = setTimeout(() => {
      router.push("/login")
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
      <div className="flex flex-col items-center gap-4 text-center">
        <ShoppingBag className="h-12 w-12 text-primary" />
        <h1 className="text-2xl font-bold">Logging out...</h1>
        <p className="text-muted-foreground">Thank you for using AgroBill</p>
      </div>
    </div>
  )
}

