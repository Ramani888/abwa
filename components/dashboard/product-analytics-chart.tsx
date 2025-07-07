"use client"

import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface Product {
  name: string
  variants: {
    retailPrice: number
    wholesalePrice: number
    purchasePrice: number
    quantity: number
    // Add other fields as needed
  }[]
  // Add other fields as needed
}

interface ProductAnalyticsChartProps {
  products: Product[]
}

function getProductAnalyticsData(products: Product[]) {
  // Example: aggregate sales and profit by product name
  return products
    .map((product) => {
      // Sum sales and profit for all variants
      let sales = 0
      let profit = 0
      product.variants.forEach((variant) => {
        // Example: sales = retailPrice * quantity, profit = (retailPrice - purchasePrice) * quantity
        sales += (variant.retailPrice || 0) * (variant.quantity || 0)
        profit +=
          ((variant.retailPrice || 0) - (variant.purchasePrice || 0)) * (variant.quantity || 0)
      })
      return {
        name: product.name,
        sales,
        profit,
      }
    })
    .filter((d) => d.sales > 0 || d.profit > 0)
}

export function ProductAnalyticsChart({ products }: ProductAnalyticsChartProps) {
  const data = getProductAnalyticsData(products)

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
      className="w-full h-[400px]"
    >
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-full text-muted-foreground text-lg">
          No data available
        </div>
      ) : (
        <BarChart data={data} accessibilityLayer>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `₹${value}`}
          />
          <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
          <Legend />
          <Bar dataKey="sales" fill="var(--color-sales)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="profit" fill="var(--color-profit)" radius={[4, 4, 0, 0]} />
        </BarChart>
      )}
    </ChartContainer>
  )
}

