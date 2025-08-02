"use client"

import { Pie, PieChart, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ISupplier } from "@/types/supplier"

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

interface SupplierAnalyticsChartProps {
  suppliers: ISupplier[]
}

export function SupplierAnalyticsChart({ suppliers }: SupplierAnalyticsChartProps) {
  // Example: Calculate type distribution
  const supplierTypeData = [
    { name: "Suppliers", value: suppliers.length },
  ].filter(d => d.value > 0)

  // Example: Calculate location distribution (simple keyword match)
  const locationCounts = suppliers.reduce(
    (acc, s) => {
      const addr = (s.address || "").toLowerCase()
      if (addr.includes("urban")) acc.urban++
      else if (addr.includes("suburban")) acc.suburban++
      else acc.rural++
      return acc
    },
    { urban: 0, suburban: 0, rural: 0 }
  )
  const supplierLocationData = [
    { name: "Urban", value: locationCounts.urban },
    { name: "Suburban", value: locationCounts.suburban },
    { name: "Rural", value: locationCounts.rural },
  ].filter(d => d.value > 0)

  const noTypeData = supplierTypeData.length === 0
  const noLocationData = supplierLocationData.length === 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-medium mb-4 text-center">Supplier Type Distribution</h3>
        <ChartContainer
          config={{
            "Local Suppliers": {
              label: "Local Suppliers",
              color: COLORS[0],
            },
            "International Suppliers": {
              label: "International Suppliers",
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
                data={supplierTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {supplierTypeData.map((entry, index) => (
                  <Cell key={`cell-type-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          )}
        </ChartContainer>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4 text-center">Supplier Location Distribution</h3>
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
                data={supplierLocationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {supplierLocationData.map((entry, index) => (
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