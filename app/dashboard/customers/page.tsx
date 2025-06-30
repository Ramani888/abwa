"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { CustomersTable } from "@/components/dashboard/customers-table"
import { PlanLimitsAlert } from "@/components/dashboard/plan-limits-alert"
import { useState, useRef } from "react"
import { usePermission } from "@/hooks/usePermission"
import { Permissions } from "@/utils/consts/permission"

export default function CustomersPage() {
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
    <div className="flex flex-col gap-6 w-full px-2 sm:px-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Customers</h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {hasPermission(Permissions.ADD_CUSTOMER) && (
            <Link href="/dashboard/customers/new" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </Link>
          )}
        </div>
      </div>

      <PlanLimitsAlert resourceType="customers" showWhen="approaching" />

      <CustomersTable setRefreshFunction={(fn) => {
        refreshFunctionRef.current = fn;
      }} />
    </div>
  )
}

