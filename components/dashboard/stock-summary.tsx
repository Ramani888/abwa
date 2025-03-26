"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for stock status
const stockData = [
  { category: "Fertilizers", inStock: 45, lowStock: 12, outOfStock: 3 },
  { category: "Seeds", inStock: 32, lowStock: 8, outOfStock: 2 },
  { category: "Pesticides", inStock: 28, lowStock: 5, outOfStock: 1 },
  { category: "Tools", inStock: 18, lowStock: 4, outOfStock: 0 },
  { category: "Irrigation", inStock: 15, lowStock: 3, outOfStock: 2 },
]

export function StockSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Stock Status by Category</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="category" type="category" width={100} />
                <Tooltip />
                <Legend />
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
          <h3 className="text-lg font-semibold mb-4">Stock Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Products</p>
                <p className="text-2xl font-bold">176</p>
              </div>
              <Badge>100%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">In Stock</p>
                <p className="text-2xl font-bold">138</p>
              </div>
              <Badge variant="outline">78.4%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Low Stock</p>
                <p className="text-2xl font-bold">32</p>
              </div>
              <Badge variant="secondary">18.2%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Out of Stock</p>
                <p className="text-2xl font-bold">6</p>
              </div>
              <Badge variant="destructive">3.4%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

