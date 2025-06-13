"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { CustomersTable } from "@/components/dashboard/customers-table"
import { PlanLimitsAlert } from "@/components/dashboard/plan-limits-alert"
import { useState, useRef } from "react"
import { usePermission } from "@/hooks/usePermission"
import { Permissions } from "@/utils/consts/permission"
import { CustomerPaymentTable } from "@/components/dashboard/customer-payment-table"

export default function CustomerPaymentPage() {
  const { hasPermission } = usePermission();
  const [isRefreshing, setIsRefreshing] = useState(false)
  const refreshFunctionRef = useRef<(() => Promise<void>) | null>(null)
  
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      if (refreshFunctionRef.current) {
        await refreshFunctionRef.current()
      }
    } catch (error) {
      console.error("Error refreshing data:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customer Payments</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {hasPermission(Permissions.ADD_CUSTOMER_PAYMENT) && (
            <Link href="/dashboard/customer-payment/new" className="flex items-center">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Customer Payment
              </Button>
            </Link>
          )}
        </div>
      </div>

      <PlanLimitsAlert resourceType="customers" showWhen="approaching" />

      <CustomerPaymentTable setRefreshFunction={(fn) => {
        refreshFunctionRef.current = fn;
      }} />
    </div>
  )
}

