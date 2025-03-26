"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/date-range-picker"

// Mock data for sales report
const data = [
  { month: "Jan", wholesale: 3500, retail: 2500, total: 6000 },
  { month: "Feb", wholesale: 4200, retail: 2800, total: 7000 },
  { month: "Mar", wholesale: 3800, retail: 3200, total: 7000 },
  { month: "Apr", wholesale: 4300, retail: 3500, total: 7800 },
  { month: "May", wholesale: 4800, retail: 3800, total: 8600 },
  { month: "Jun", wholesale: 5200, retail: 4100, total: 9300 },
]

export function SalesReport() {
  const [timeRange, setTimeRange] = useState("monthly")

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <DateRangePicker />
        </div>
        <Button variant="outline" size="sm">
          Download CSV
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Total Sales</div>
          <div className="text-2xl font-bold mt-2">₹45,700</div>
          <div className="text-sm text-green-500 mt-1">+12.5% from last month</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Wholesale Sales</div>
          <div className="text-2xl font-bold mt-2">₹26,300</div>
          <div className="text-sm text-green-500 mt-1">+8.3% from last month</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Retail Sales</div>
          <div className="text-2xl font-bold mt-2">₹19,400</div>
          <div className="text-sm text-green-500 mt-1">+15.2% from last month</div>
        </Card>
      </div>

      <div className="h-[400px]">
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
          className="h-full"
        >
          <BarChart data={data} accessibilityLayer>
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

      <div className="border rounded-lg">
        <div className="grid grid-cols-3 border-b">
          <div className="p-3 font-medium">Month</div>
          <div className="p-3 font-medium">Wholesale</div>
          <div className="p-3 font-medium">Retail</div>
        </div>
        {data.map((item, index) => (
          <div key={index} className={`grid grid-cols-3 ${index < data.length - 1 ? "border-b" : ""}`}>
            <div className="p-3">{item.month}</div>
            <div className="p-3">₹{item.wholesale}</div>
            <div className="p-3">₹{item.retail}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

