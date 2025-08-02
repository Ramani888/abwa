"use client"

import { ResponsiveContainer, Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { useMemo } from "react"

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

type PurchaseReportChartProps = {
  selectedPeriod: string
}

function filterPurchaseOrdersByPeriod(purchaseOrders: any[], period: string) {
  const now = new Date()
  if (!purchaseOrders) return []
  // Same logic as filterOrdersByPeriod, but for purchaseOrders
  if (period === "current-month") {
    return purchaseOrders.filter(po => {
      const date = new Date(po?.purchaseDate ?? po?.createdAt)
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    })
  }
  if (period === "last-month") {
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return purchaseOrders.filter(po => {
      const date = new Date(po?.purchaseDate ?? po?.createdAt)
      return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear()
    })
  }
  // Add other periods as needed...
  return purchaseOrders
}

export function PurchaseReportChart({ selectedPeriod }: PurchaseReportChartProps) {
  const { purchaseOrders, loading: purchaseOrderLoading } = useSelector((state: RootState) => state.purchaseOrders)

  const data = useMemo(() => {
    if (!purchaseOrders || purchaseOrderLoading) return []

    const filteredOrders = filterPurchaseOrdersByPeriod(purchaseOrders, selectedPeriod)
    const monthly: Record<string, { total: number }> = {}

    filteredOrders.forEach((po: any) => {
      const date = po.purchaseDate ? new Date(po.purchaseDate) : new Date(po.createdAt)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      if (!monthly[key]) monthly[key] = { total: 0 }
      monthly[key].total += po.total || 0
    })

    let year = new Date().getFullYear()
    if (filteredOrders.length > 0) {
      const firstOrder = filteredOrders[0]
      const date = firstOrder.purchaseDate ? new Date(firstOrder.purchaseDate) : new Date(firstOrder.createdAt)
      year = date.getFullYear()
    }

    const result = []
    for (let m = 0; m < 12; m++) {
      const key = `${year}-${String(m + 1).padStart(2, "0")}`
      result.push({
        name: monthNames[m],
        total: monthly[key]?.total || 0,
      })
    }
    return result
  }, [purchaseOrders, purchaseOrderLoading, selectedPeriod])

  const hasData = data.some(d => d.total > 0)

  return (
    <ChartContainer
      config={{
        total: {
          label: "Total Purchases",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="w-full h-[400px] sm:h-[300px] xs:h-[220px]"
    >
      {hasData ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `₹${value}`} />
            <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
            <Legend />
            <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground text-lg">
          No data available
        </div>
      )}
    </ChartContainer>
  )
}