"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
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

  // Check if there is any revenue data
  const hasData = data.some((d) => d.total > 0)

  return (
    <div className="w-full overflow-x-auto">
      <ChartContainer
        config={{
          total: {
            label: "Revenue",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="w-full h-[220px] sm:h-[300px] min-w-[500px] sm:min-w-0"
      >
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              accessibilityLayer
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `₹${value}`} />
              <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
              <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-lg">
            No data available
          </div>
        )}
      </ChartContainer>
    </div>
  )
}

