"use client"

import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for the chart
const data = [
  { name: "Fertilizers", sales: 12500, profit: 3750 },
  { name: "Seeds", sales: 8200, profit: 2050 },
  { name: "Pesticides", sales: 6800, profit: 1700 },
  { name: "Tools", sales: 9500, profit: 2850 },
  { name: "Irrigation", sales: 7200, profit: 2160 },
]

export function ProductAnalyticsChart() {
  return (
    <ChartContainer
      config={{
        sales: {
          label: "Sales (₹)",
          color: "hsl(var(--chart-1))",
        },
        profit: {
          label: "Profit (₹)",
          color: "hsl(var(--chart-2))",
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
        <Bar dataKey="sales" fill="var(--color-sales)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="profit" fill="var(--color-profit)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

