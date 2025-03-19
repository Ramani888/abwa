"use client"

import { Pie, PieChart, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for the chart
const customerTypeData = [
  { name: "Retail Customers", value: 65 },
  { name: "Wholesale Customers", value: 35 },
]

const customerLocationData = [
  { name: "Urban", value: 45 },
  { name: "Suburban", value: 30 },
  { name: "Rural", value: 25 },
]

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

export function CustomerAnalyticsChart() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-medium mb-4 text-center">Customer Type Distribution</h3>
        <ChartContainer
          config={{
            "Retail Customers": {
              label: "Retail Customers",
              color: COLORS[0],
            },
            "Wholesale Customers": {
              label: "Wholesale Customers",
              color: COLORS[1],
            },
          }}
          className="h-[300px]"
        >
          <PieChart>
            <Pie
              data={customerTypeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {customerTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4 text-center">Customer Location Distribution</h3>
        <ChartContainer
          config={{
            Urban: {
              label: "Urban",
              color: COLORS[0],
            },
            Suburban: {
              label: "Suburban",
              color: COLORS[1],
            },
            Rural: {
              label: "Rural",
              color: COLORS[2],
            },
          }}
          className="h-[300px]"
        >
          <PieChart>
            <Pie
              data={customerLocationData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {customerLocationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  )
}

