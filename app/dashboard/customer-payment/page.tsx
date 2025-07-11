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
    <div className="flex flex-col gap-6 w-full px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Customer Payments</h2>
        <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {hasPermission(Permissions.ADD_CUSTOMER_PAYMENT) && (
            <Link href="/dashboard/customer-payment/new" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Customer Payment
              </Button>
            </Link>
          )}
        </div>
      </div>

      <PlanLimitsAlert resourceType="customers" showWhen="approaching" />

      <div className="overflow-x-auto">
        <CustomerPaymentTable setRefreshFunction={(fn) => {
          refreshFunctionRef.current = fn;
        }} />
      </div>
    </div>
  )
}

