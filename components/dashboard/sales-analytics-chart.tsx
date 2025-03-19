"use client"

import { Line, LineChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for the chart
const data = [
  { name: "Jan", retail: 1500, wholesale: 3200, total: 4700 },
  { name: "Feb", retail: 2300, wholesale: 4100, total: 6400 },
  { name: "Mar", retail: 3200, wholesale: 5800, total: 9000 },
  { name: "Apr", retail: 2800, wholesale: 4900, total: 7700 },
  { name: "May", retail: 4100, wholesale: 6200, total: 10300 },
  { name: "Jun", retail: 3800, wholesale: 5500, total: 9300 },
  { name: "Jul", retail: 4300, wholesale: 6800, total: 11100 },
  { name: "Aug", retail: 4500, wholesale: 7200, total: 11700 },
  { name: "Sep", retail: 4200, wholesale: 6900, total: 11100 },
  { name: "Oct", retail: 3900, wholesale: 6500, total: 10400 },
  { name: "Nov", retail: 4600, wholesale: 7500, total: 12100 },
  { name: "Dec", retail: 5200, wholesale: 8200, total: 13400 },
]

export function SalesAnalyticsChart() {
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
      className="h-[400px]"
    >
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
    </ChartContainer>
  )
}

