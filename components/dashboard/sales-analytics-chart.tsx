"use client"

import { Line, LineChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface Order {
  captureDate?: Date | string
  createdAt?: Date | string
  customerType: string // 'retail' | 'wholesale'
  total: number
}

interface SalesAnalyticsChartProps {
  orders: Order[]
}

function getMonthName(month: number) {
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month]
}

function groupOrdersByMonth(orders: Order[]) {
  const result: Record<string, { retail: number; wholesale: number; total: number }> = {}

  orders.forEach((order) => {
    const date = new Date(order.captureDate ?? order.createdAt ?? "")
    if (isNaN(date.getTime())) return
    const key = `${date.getFullYear()}-${date.getMonth()}`
    if (!result[key]) {
      result[key] = { retail: 0, wholesale: 0, total: 0 }
    }
    if (order.customerType === "retail") {
      result[key].retail += order.total || 0
    } else if (order.customerType === "wholesale") {
      result[key].wholesale += order.total || 0
    }
    result[key].total += order.total || 0
  })

  let entries = Object.entries(result)
    .sort(([a], [b]) => (a > b ? 1 : -1))

  // If only one data point, add a zero point before it
  if (entries.length === 1) {
    const [key] = entries[0]
    const [year, month] = key.split("-").map(Number)
    // Calculate previous month and year
    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    const prevKey = `${prevYear}-${prevMonth}`
    entries = [
      [prevKey, { retail: 0, wholesale: 0, total: 0 }],
      ...entries,
    ]
  }

  return entries.map(([key, value]) => {
    const [year, month] = key.split("-")
    return {
      name: `${getMonthName(Number(month))} ${year}`,
      ...value,
    }
  })
}

export function SalesAnalyticsChart({ orders }: SalesAnalyticsChartProps) {
  const data = groupOrdersByMonth(orders)

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
        },
      }}
      className="w-full h-[400px]"
    >
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-full text-muted-foreground text-lg">
          No data available
        </div>
      ) : (
        <LineChart data={data} accessibilityLayer>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `₹${value}`} />
          <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
          <Legend />
          <Line type="monotone" dataKey="retail" stroke="var(--color-retail)" strokeWidth={2} activeDot={{ r: 8 }} />
          <Line
            type="monotone"
            dataKey="wholesale"
            stroke="var(--color-wholesale)"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="total" stroke="var(--color-total)" strokeWidth={3} activeDot={{ r: 8 }} />
        </LineChart>
      )}
    </ChartContainer>
  )
}

