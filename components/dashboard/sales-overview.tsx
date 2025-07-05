"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"

// Helper to get month name from index
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function getMonthlyRevenue(orders: any[]) {
  // Initialize revenue for each month
  const monthlyTotals: { [key: string]: number } = {}
  MONTHS.forEach((month) => (monthlyTotals[month] = 0))

  orders.forEach((order) => {
    if (!order.createdAt) return
    const date = new Date(order.createdAt)
    const monthName = MONTHS[date.getMonth()]
    if (monthName) {
      monthlyTotals[monthName] += order.total || 0
    }
  })

  // Return array suitable for recharts
  return MONTHS.map((name) => ({
    name,
    total: monthlyTotals[name],
  }))
}

export function SalesOverview() {
  const { orders, loading: orderLoading } = useSelector((state: RootState) => state.orders)

  // Generate dynamic data based on orders
  const data = getMonthlyRevenue(orders || [])

  return (
    <ChartContainer
      config={{
        total: {
          label: "Revenue",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px]"
    >
      <BarChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `₹${value}`} />
        <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
        <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

