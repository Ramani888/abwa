"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { useMemo, useImperativeHandle, forwardRef } from "react"
import { exportToCsv } from "@/utils/helpers/report"
import { formatCurrency } from "@/utils/helpers/general"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatLastPurchase(date: Date | string | undefined) {
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

// --- Add this helper ---
function filterOrdersByPeriod(orders: any[], period: string) {
  const now = new Date()
  if (!orders) return []
  if (period === "current-month") {
    return orders.filter(order => {
      const date = new Date(order?.captureDate ?? order?.createdAt)
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    })
  }
  if (period === "last-month") {
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return orders.filter(order => {
      const date = new Date(order?.captureDate ?? order?.createdAt)
      return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear()
    })
  }
  if (period === "last-3-months") {
    const start = new Date(now.getFullYear(), now.getMonth() - 2, 1)
    return orders.filter(order => {
      const date = new Date(order?.captureDate ?? order?.createdAt)
      return date >= start && date <= now
    })
  }
  if (period === "last-6-months") {
    const start = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    return orders.filter(order => {
      const date = new Date(order?.captureDate ?? order?.createdAt)
      return date >= start && date <= now
    })
  }
  if (period === "year-to-date") {
    const start = new Date(now.getFullYear(), 0, 1)
    return orders.filter(order => {
      const date = new Date(order?.captureDate ?? order?.createdAt)
      return date >= start && date <= now
    })
  }
  if (period === "last-year") {
    const start = new Date(now.getFullYear() - 1, 0, 1)
    const end = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59)
    return orders.filter(order => {
      const date = new Date(order?.captureDate ?? order?.createdAt)
      return date >= start && date <= end
    })
  }
  // For "custom", you can add your own logic or return all for now
  return orders
}

export const CustomerReportTable = forwardRef(function CustomerReportTable(
  { selectedPeriod, exportRef }: { selectedPeriod: string; exportRef?: any },
  ref
) {
  const { customers, loading: customerLoading } = useSelector((state: RootState) => state.customers)
  const { orders, loading: orderLoading } = useSelector((state: RootState) => state.orders)

  // Filter orders by selectedPeriod
  const filteredOrders = useMemo(
    () => filterOrdersByPeriod(orders, selectedPeriod),
    [orders, selectedPeriod]
  )

  const customerReports = useMemo(() => {
    if (customerLoading || orderLoading || !customers || !filteredOrders) return []

    return customers.map((customer: any) => {
      const customerOrders = filteredOrders.filter((order: any) => order.customerId === customer._id)
      const totalSpent = customerOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0)
      const orderCount = customerOrders.length
      const avgOrderValue = orderCount > 0 ? totalSpent / orderCount : 0
      const lastPurchaseDate = customerOrders.length > 0
        ? customerOrders
            .map((order: any) => new Date(order.captureDate ?? order.createdAt))
            .sort((a, b) => b.getTime() - a.getTime())[0]
        : undefined

      return {
        id: customer._id,
        name: customer.name,
        type: customer.customerType,
        orders: formatCurrency(orderCount, false, false),
        spent: formatCurrency(totalSpent),
        avgOrderValue: formatCurrency(avgOrderValue),
        lastPurchase: formatLastPurchase(lastPurchaseDate),
        initials: getInitials(customer.name),
      }
    })
  }, [customers, filteredOrders, customerLoading, orderLoading])

  useImperativeHandle(exportRef, () => handleExport, [customerReports, selectedPeriod])

  function handleExport() {
    exportToCsv(
      `customer-report-${selectedPeriod}.csv`,
      customerReports,
      ["name", "type", "orders", "spent", "avgOrderValue", "lastPurchase"],
      ["Customer", "Type", "Orders", "Total Spent", "Avg. Order Value", "Last Purchase"]
    )
  }

  return (
    <div className="rounded-md border overflow-x-auto p-2 sm:p-4 bg-background">
      <Table className="min-w-[600px] text-xs sm:text-sm">
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Orders</TableHead>
            <TableHead className="text-right">Total Spent</TableHead>
            <TableHead className="text-right">Avg. Order Value</TableHead>
            <TableHead className="text-right">Last Purchase</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customerReports.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                    <AvatarFallback>{customer.initials}</AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{customer.name}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={customer.type === "wholesale" ? "default" : "secondary"}>
                  {customer.type === "wholesale" ? "Wholesale" : "Retail"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{customer.orders}</TableCell>
              <TableCell className="text-right">{customer.spent}</TableCell>
              <TableCell className="text-right">{customer.avgOrderValue}</TableCell>
              <TableCell className="text-right">{customer.lastPurchase}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
})

