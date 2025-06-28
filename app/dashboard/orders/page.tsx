"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { OrdersTable } from "@/components/dashboard/orders-table"
import { Permissions } from "@/utils/consts/permission";
import { usePermission } from "@/hooks/usePermission";
import { useRef, useState } from "react"

export default function OrdersPage() {
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
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Orders</h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {hasPermission(Permissions.ADD_ORDER) && (
            <Link href="/dashboard/orders/new" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Order
              </Button>
            </Link>
          )}
        </div>
      </div>

      <OrdersTable setRefreshFunction={(fn) => {
        refreshFunctionRef.current = fn;
      }} />
    </div>
  )
}

