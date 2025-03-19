"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for sales analytics
const salesData = [
  { month: "Jan", wholesale: 3500, retail: 2500, total: 6000 },
  { month: "Feb", wholesale: 4200, retail: 2800, total: 7000 },
  { month: "Mar", wholesale: 3800, retail: 3200, total: 7000 },
  { month: "Apr", wholesale: 4300, retail: 3500, total: 7800 },
  { month: "May", wholesale: 4800, retail: 3800, total: 8600 },
  { month: "Jun", wholesale: 5200, retail: 4100, total: 9300 },
]

const growthData = [
  { month: "Jan", growth: 5 },
  { month: "Feb", growth: 8 },
  { month: "Mar", growth: 0 },
  { month: "Apr", growth: 11 },
  { month: "May", growth: 10 },
  { month: "Jun", growth: 8 },
]

export function SalesAnalytics() {
  return (
    <div className="space-y-8">
      <div className="h-[400px]">
        <h3 className="text-lg font-medium mb-4">Monthly Sales Breakdown</h3>
        <ChartContainer
          config={{
            wholesale: {
              label: "Wholesale",
              color: "hsl(var(--chart-1))",
            },
            retail: {
              label: "Retail",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[350px]"
        >
          <BarChart data={salesData} accessibilityLayer>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `₹${value}`} />
            <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
            <Legend />
            <Bar dataKey="wholesale" fill="var(--color-wholesale)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="retail" fill="var(--color-retail)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>

      <div className="h-[300px]">
        <h3 className="text-lg font-medium mb-4">Month-over-Month Growth (%)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={growthData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="growth" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="border rounded-lg">
        <div className="grid grid-cols-4 border-b">
          <div className="p-3 font-medium">Month</div>
          <div className="p-3 font-medium">Wholesale (₹)</div>
          <div className="p-3 font-medium">Retail (₹)</div>
          <div className="p-3 font-medium">Total (₹)</div>
        </div>
        {salesData.map((item, index) => (
          <div key={index} className={`grid grid-cols-4 ${index < salesData.length - 1 ? "border-b" : ""}`}>
            <div className="p-3">{item.month}</div>
            <div className="p-3">{item.wholesale}</div>
            <div className="p-3">{item.retail}</div>
            <div className="p-3">{item.total}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

