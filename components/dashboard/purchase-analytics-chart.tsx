"use client"

import { Line, LineChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface Purchase {
  captureDate?: Date | string
  createdAt?: Date | string
  total: number
}

interface PurchaseAnalyticsChartProps {
  purchases: Purchase[]
}

function getMonthName(month: number) {
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month]
}

function groupPurchasesByMonth(purchases: Purchase[]) {
  const result: Record<string, { total: number }> = {}

  purchases.forEach((purchase) => {
    const date = new Date(purchase.captureDate ?? purchase.createdAt ?? "")
    if (isNaN(date.getTime())) return
    const key = `${date.getFullYear()}-${date.getMonth()}`
    if (!result[key]) {
      result[key] = { total: 0 }
    }
    result[key].total += purchase.total || 0
  })

  let entries = Object.entries(result)
    .sort(([a], [b]) => (a > b ? 1 : -1))

  if (entries.length === 1) {
    const [key] = entries[0]
    const [year, month] = key.split("-").map(Number)
    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    const prevKey = `${prevYear}-${prevMonth}`
    entries = [
      [prevKey, { total: 0 }],
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

export function PurchaseAnalyticsChart({ purchases }: PurchaseAnalyticsChartProps) {
  const data = groupPurchasesByMonth(purchases)

  return (
    <ChartContainer
      config={{
        total: {
          label: "Total Purchases",
          color: "hsl(var(--chart-1))",
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
          <Line
            type="monotone"
            dataKey="total"
            stroke="hsl(var(--chart-1))" // <-- Fixed color to match config
            strokeWidth={3}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      )}
    </ChartContainer>
  )
}