"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { useMemo, useImperativeHandle, forwardRef } from "react"
import { exportToCsv } from "@/utils/helpers/report"
import { formatCurrency } from "@/utils/helpers/general"

// Helper to get initials
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// Helper to format last supply date
function formatLastSupply(date: Date | string | undefined) {
  if (!date) return "Never"
  const now = new Date()
  const d = new Date(date)
  const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return "Today"
  if (diff === 1) return "Yesterday"
  if (diff < 7) return `${diff} days ago`
  if (diff < 30) return `${Math.floor(diff / 7)} week${Math.floor(diff / 7) > 1 ? "s" : ""} ago`
  return d.toLocaleDateString()
}

// Helper to filter purchase orders by period
function filterPurchaseOrdersByPeriod(purchaseOrders: any[], period: string) {
  const now = new Date()
  if (!purchaseOrders) return []
  if (period === "current-month") {
    return purchaseOrders.filter(po => {
      const date = new Date(po?.captureDate ?? po?.createdAt)
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    })
  }
  if (period === "last-month") {
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return purchaseOrders.filter(po => {
      const date = new Date(po?.captureDate ?? po?.createdAt)
      return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear()
    })
  }
  // Add more period filters as needed
  return purchaseOrders
}

export const SupplierReportTable = forwardRef(function SupplierReportTable(
  { selectedPeriod, exportRef }: { selectedPeriod: string; exportRef?: any },
  ref
) {
  const { supplier, loading: supplierLoading } = useSelector((state: RootState) => state.suppliers)
  const { purchaseOrders, loading: purchaseOrderLoading } = useSelector((state: RootState) => state.purchaseOrders)

  // Filter purchase orders by selectedPeriod
  const filteredPurchaseOrders = useMemo(
    () => filterPurchaseOrdersByPeriod(purchaseOrders, selectedPeriod),
    [purchaseOrders, selectedPeriod]
  )

  const supplierReports = useMemo(() => {
    if (supplierLoading || purchaseOrderLoading || !supplier || !filteredPurchaseOrders) return []

    return supplier.map((sup: any) => {
      const supplierOrders = filteredPurchaseOrders.filter((po: any) => po.supplierId === sup._id)
      const totalSupplied = supplierOrders.reduce((sum: number, po: any) => sum + (po.total || 0), 0)
      const orderCount = supplierOrders.length
      const avgOrderValue = orderCount > 0 ? totalSupplied / orderCount : 0
      const lastSupplyDate = supplierOrders.length > 0
        ? supplierOrders
            .map((po: any) => new Date(po.captureDate ?? po.createdAt))
            .sort((a, b) => b.getTime() - a.getTime())[0]
        : undefined

      return {
        id: sup._id,
        name: sup.name,
        type: sup.supplierType || "Supplier",
        orders: formatCurrency(orderCount, false, false),
        supplied: formatCurrency(totalSupplied),
        avgOrderValue: formatCurrency(avgOrderValue),
        lastSupply: formatLastSupply(lastSupplyDate),
        initials: getInitials(sup.name),
      }
    })
  }, [supplier, filteredPurchaseOrders, supplierLoading, purchaseOrderLoading])

  useImperativeHandle(exportRef, () => handleExport, [supplierReports, selectedPeriod])

  function handleExport() {
    exportToCsv(
      `supplier-report-${selectedPeriod}.csv`,
      supplierReports,
      ["name", "type", "orders", "supplied", "avgOrderValue", "lastSupply"],
      ["Supplier", "Type", "Orders", "Total Supplied", "Avg. Order Value", "Last Supply"]
    )
  }

  return (
    <div className="rounded-md border overflow-x-auto p-2 sm:p-4 bg-background">
      <Table className="min-w-[600px] text-xs sm:text-sm">
        <TableHeader>
          <TableRow>
            <TableHead>Supplier</TableHead>
            <TableHead className="text-right">Orders</TableHead>
            <TableHead className="text-right">Total Supplied</TableHead>
            <TableHead className="text-right">Avg. Order Value</TableHead>
            <TableHead className="text-right">Last Supply</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {supplierReports.map((sup) => (
            <TableRow key={sup.id}>
              <TableCell>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                    <AvatarFallback>{sup.initials}</AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{sup.name}</div>
                </div>
              </TableCell>
              <TableCell className="text-right">{sup.orders}</TableCell>
              <TableCell className="text-right">{sup.supplied}</TableCell>
              <TableCell className="text-right">{sup.avgOrderValue}</TableCell>
              <TableCell className="text-right">{sup.lastSupply}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
})