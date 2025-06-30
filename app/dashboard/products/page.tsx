"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, RefreshCw } from "lucide-react"
import { ProductsTable } from "@/components/dashboard/products-table"
import { PlanLimitsAlert } from "@/components/dashboard/plan-limits-alert"
import { useRef, useState } from "react"
import { usePermission } from "@/hooks/usePermission"
import { Permissions } from "@/utils/consts/permission"

export default function ProductsPage() {
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Manage your product inventory and pricing.</p>
        </div>
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
          {hasPermission(Permissions.ADD_PRODUCT) && (
            <Link href="/dashboard/products/new" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Link>
          )}
        </div>
      </div>

      <PlanLimitsAlert resourceType="products" showWhen="approaching" />

      <ProductsTable setRefreshFunction={(fn) => {
        refreshFunctionRef.current = fn;
      }} />
    </div>
  )
}

