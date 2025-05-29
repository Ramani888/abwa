"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, RefreshCw } from "lucide-react"
import { useRef, useState } from "react"
import { usePermission } from "@/hooks/usePermission"
import { Permissions } from "@/utils/consts/permission"
import { SuppliersTable } from "@/components/dashboard/suppliers-table"

export default function CategoriesPage() {
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Suppliers</h2>
          <p className="text-muted-foreground">Manage suppliers for your inventory.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {hasPermission(Permissions.ADD_CATEGORY) && (
            <Link href="/dashboard/suppliers/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Supplier
              </Button>
            </Link>
          )}
        </div>
      </div>

      <SuppliersTable setRefreshFunction={(fn) => {
        refreshFunctionRef.current = fn;
      }} />
    </div>
  )
}