"use client"

import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts"
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
]

export function SalesReportChart() {
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
      className="h-[400px]"
    >
      <BarChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `₹${value}`} />
        <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
        <Legend />
        <Bar dataKey="retail" fill="var(--color-retail)" radius={[4, 4, 0, 0]} stackId="a" />
        <Bar dataKey="wholesale" fill="var(--color-wholesale)" radius={[4, 4, 0, 0]} stackId="a" />
      </BarChart>
    </ChartContainer>
  )
}

