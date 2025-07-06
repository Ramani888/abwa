"use client"

import { ResponsiveContainer, Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { useMemo } from "react"

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

type SalesReportChartProps = {
  selectedPeriod: string
}

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

export function SalesReportChart({ selectedPeriod }: SalesReportChartProps) {
  const { orders, loading: orderLoading } = useSelector((state: RootState) => state.orders)

  const data = useMemo(() => {
    if (!orders || orderLoading) return []

    // Filter orders by selected period
    const filteredOrders = filterOrdersByPeriod(orders, selectedPeriod)

    // Map: { "YYYY-MM": { retail: 0, wholesale: 0, total: 0 } }
    const monthly: Record<string, { retail: number; wholesale: number; total: number }> = {}

    filteredOrders.forEach((order: any) => {
      const date = order.captureDate ? new Date(order.captureDate) : new Date(order.createdAt)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      if (!monthly[key]) monthly[key] = { retail: 0, wholesale: 0, total: 0 }

      if (order.customerType === "retail") {
        monthly[key].retail += order.total || 0
      } else if (order.customerType === "wholesale") {
        monthly[key].wholesale += order.total || 0
      }
      monthly[key].total += order.total || 0
    })

    // Determine which year to show (default: current year)
    let year = new Date().getFullYear()
    if (filteredOrders.length > 0) {
      const firstOrder = filteredOrders[0]
      const date = firstOrder.captureDate ? new Date(firstOrder.captureDate) : new Date(firstOrder.createdAt)
      year = date.getFullYear()
    }

    // Always show all 12 months for the selected year
    const result = []
    for (let m = 0; m < 12; m++) {
      const key = `${year}-${String(m + 1).padStart(2, "0")}`
      result.push({
        name: monthNames[m],
        retail: monthly[key]?.retail || 0,
        wholesale: monthly[key]?.wholesale || 0,
        total: monthly[key]?.total || 0,
      })
    }
    return result
  }, [orders, orderLoading, selectedPeriod])

  return (
    <ChartContainer
      config={{
        retail: {
          label: "Retail Sales",
          color: "hsl(var(--chart-1))",
        },
        wholesale: {
          label: "Wholesale Sales",
          color: "hsl(var(--chart-2))",
        },
        total: {
          label: "Total Sales",
          color: "hsl(var(--chart-3))",
          hideInLegend: true,
        },
      }}
      className="w-full h-[400px] sm:h-[300px] xs:h-[220px]" // Responsive height
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `₹${value}`} />
          <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
          <Legend />
          <Bar dataKey="retail" fill="var(--color-retail)" radius={[4, 4, 0, 0]} stackId="a" />
          <Bar dataKey="wholesale" fill="var(--color-wholesale)" radius={[4, 4, 0, 0]} stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

