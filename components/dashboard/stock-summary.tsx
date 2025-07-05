"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"

export function StockSummary() {
  const { products, loading: productLoading } = useSelector((state: RootState) => state.products)

  // Aggregate stock data dynamically by category
  const stockSummary = products.reduce((acc, product) => {
    const category = product.categoryName || "Uncategorized"
    if (!acc[category]) {
      acc[category] = { category, inStock: 0, lowStock: 0, outOfStock: 0 }
    }
    product.variants.forEach(variant => {
      if (variant.quantity === 0) {
        acc[category].outOfStock += 1
      } else if (variant.quantity <= variant.minStockLevel) {
        acc[category].lowStock += 1
      } else {
        acc[category].inStock += 1
      }
    })
    return acc
  }, {} as Record<string, { category: string; inStock: number; lowStock: number; outOfStock: number }>)

  const stockData = Object.values(stockSummary)

  // Calculate totals for overview
  const totalVariants = products.reduce((sum, p) => sum + p.variants.length, 0)
  const totalInStock = stockData.reduce((sum, c) => sum + c.inStock, 0)
  const totalLowStock = stockData.reduce((sum, c) => sum + c.lowStock, 0)
  const totalOutOfStock = stockData.reduce((sum, c) => sum + c.outOfStock, 0)

  if (productLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Chart Skeleton */}
        <Card>
          <CardContent className="pt-6">
            <div className="h-8 w-2/3 sm:w-1/2 bg-muted animate-pulse rounded mb-4" />
            <div className="flex flex-col justify-between h-[180px] sm:h-[240px] space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="h-6 w-24 bg-muted animate-pulse rounded" />
                  <div className="flex-1 h-6 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Overview Skeleton */}
        <Card>
          <CardContent className="pt-6">
            <div className="h-8 w-2/3 sm:w-1/2 bg-muted animate-pulse rounded mb-4" />
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <div className="h-4 w-24 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Custom Tooltip for dark mode support and legend color
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div
        className={`bg-background rounded-lg p-4 shadow-lg text-sm min-w-[120px]`}
      >
        <div className="font-semibold mb-1">{label}</div>
        {payload.map((entry: any, idx: number) => (
          <div key={idx} className="flex items-center justify-between">
            <span className="flex items-center" style={{ color: entry.color }}>
              <span
                className="inline-block rounded-full border border-gray-200 mr-1.5"
                style={{
                  width: 10,
                  height: 10,
                  background: entry.color,
                }}
              />
              {entry.name}:
            </span>
            <span className="ml-2 font-bold" style={{ color: entry.color }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Stock Status by Category</h3>
          <div className="h-[200px] sm:h-[300px] px-1 sm:px-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockData} layout="vertical" barCategoryGap="15%">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="category" type="category" width={80} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="inStock" name="In Stock" fill="hsl(var(--chart-1))" stackId="a" />
                <Bar dataKey="lowStock" name="Low Stock" fill="hsl(var(--chart-2))" stackId="a" />
                <Bar dataKey="outOfStock" name="Out of Stock" fill="hsl(var(--chart-3))" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Stock Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium">Total Variants</p>
                <p className="text-xl sm:text-2xl font-bold">{totalVariants}</p>
              </div>
              <Badge className="mt-2 sm:mt-0">100%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium">In Stock</p>
                <p className="text-xl sm:text-2xl font-bold">{totalInStock}</p>
              </div>
              <Badge variant="outline" className="mt-2 sm:mt-0">
                {totalVariants ? ((totalInStock / totalVariants) * 100).toFixed(1) : 0}%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium">Low Stock</p>
                <p className="text-xl sm:text-2xl font-bold">{totalLowStock}</p>
              </div>
              <Badge variant="secondary" className="mt-2 sm:mt-0">
                {totalVariants ? ((totalLowStock / totalVariants) * 100).toFixed(1) : 0}%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium">Out of Stock</p>
                <p className="text-xl sm:text-2xl font-bold">{totalOutOfStock}</p>
              </div>
              <Badge variant="destructive" className="mt-2 sm:mt-0">
                {totalVariants ? ((totalOutOfStock / totalVariants) * 100).toFixed(1) : 0}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

