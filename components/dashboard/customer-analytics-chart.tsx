"use client"

import { Pie, PieChart, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

interface Customer {
  customerType: string
  address?: string
  // Add other fields as needed
}

interface CustomerAnalyticsChartProps {
  customers: Customer[]
}

export function CustomerAnalyticsChart({ customers }: CustomerAnalyticsChartProps) {
  // Calculate type distribution
  const typeCounts = customers.reduce(
    (acc, c) => {
      if (c.customerType === "retail") acc.retail++
      else if (c.customerType === "wholesale") acc.wholesale++
      return acc
    },
    { retail: 0, wholesale: 0 }
  )
  const customerTypeData = [
    { name: "Retail Customers", value: typeCounts.retail },
    { name: "Wholesale Customers", value: typeCounts.wholesale },
  ].filter(d => d.value > 0)

  // Example: Calculate location distribution (simple keyword match)
  const locationCounts = customers.reduce(
    (acc, c) => {
      const addr = (c.address || "").toLowerCase()
      if (addr.includes("urban")) acc.urban++
      else if (addr.includes("suburban")) acc.suburban++
      else acc.rural++
      return acc
    },
    { urban: 0, suburban: 0, rural: 0 }
  )
  const customerLocationData = [
    { name: "Urban", value: locationCounts.urban },
    { name: "Suburban", value: locationCounts.suburban },
    { name: "Rural", value: locationCounts.rural },
  ].filter(d => d.value > 0)

  const noTypeData = customerTypeData.length === 0
  const noLocationData = customerLocationData.length === 0

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
          className="w-full h-[300px]"
        >
          {noTypeData ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-lg">
              No data available
            </div>
          ) : (
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
                  <Cell key={`cell-type-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          )}
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
          className="w-full h-[300px]"
        >
          {noLocationData ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-lg">
              No data available
            </div>
          ) : (
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
                  <Cell key={`cell-loc-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          )}
        </ChartContainer>
      </div>
    </div>
  )
}

