"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

// Mock data for product analytics
const topProducts = [
  { name: "Organic Fertilizer", sales: 120 },
  { name: "Wheat Seeds", sales: 85 },
  { name: "Pesticide Spray", sales: 72 },
  { name: "Garden Tools", sales: 54 },
  { name: "Drip Irrigation", sales: 43 },
]

const categoryData = [
  { name: "Fertilizers", value: 35, color: "#0088FE" },
  { name: "Seeds", value: 25, color: "#00C49F" },
  { name: "Pesticides", value: 20, color: "#FFBB28" },
  { name: "Equipment", value: 15, color: "#FF8042" },
  { name: "Tools", value: 5, color: "#9146FF" },
]

export function ProductAnalytics() {
  return (
    <div className="space-y-8">
      <div className="h-[350px]">
        <h3 className="text-lg font-medium mb-4">Top Selling Products</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topProducts}
            layout="vertical"
            margin={{
              top: 5,
              right: 30,
              left: 70,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} />
            <Tooltip />
            <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="h-[350px]">
        <h3 className="text-lg font-medium mb-4">Sales by Category</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="border rounded-lg">
        <div className="grid grid-cols-3 border-b">
          <div className="p-3 font-medium">Product</div>
          <div className="p-3 font-medium">Units Sold</div>
          <div className="p-3 font-medium">% of Total</div>
        </div>
        {topProducts.map((product, index) => (
          <div key={index} className={`grid grid-cols-3 ${index < topProducts.length - 1 ? "border-b" : ""}`}>
            <div className="p-3">{product.name}</div>
            <div className="p-3">{product.sales}</div>
            <div className="p-3">
              {Math.round((product.sales / topProducts.reduce((sum, item) => sum + item.sales, 0)) * 100)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

