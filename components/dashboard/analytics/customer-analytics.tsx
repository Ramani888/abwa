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

// Mock data for customer analytics
const customerTypeData = [
  { name: "Retailers", value: 178, color: "hsl(var(--chart-1))" },
  { name: "Wholesalers", value: 70, color: "hsl(var(--chart-2))" },
]

const customerLoyaltyData = [
  { name: "1-time", value: 98 },
  { name: "2-5 orders", value: 75 },
  { name: "6-10 orders", value: 42 },
  { name: "11+ orders", value: 33 },
]

const customerLocationData = [
  { location: "Mumbai", customers: 68 },
  { location: "Delhi", customers: 52 },
  { location: "Bangalore", customers: 43 },
  { location: "Hyderabad", customers: 35 },
  { location: "Chennai", customers: 28 },
  { location: "Other", customers: 22 },
]

export function CustomerAnalytics() {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="h-[300px]">
          <h3 className="text-lg font-medium mb-4">Customer Types</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={customerTypeData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {customerTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} customers`, "Count"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="h-[300px]">
          <h3 className="text-lg font-medium mb-4">Customer Loyalty</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={customerLoyaltyData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="h-[350px]">
        <h3 className="text-lg font-medium mb-4">Customer Locations</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={customerLocationData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="location" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="customers" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="border rounded-lg">
        <div className="grid grid-cols-2 border-b">
          <div className="p-3 font-medium">Key Metrics</div>
          <div className="p-3 font-medium">Value</div>
        </div>
        <div className="grid grid-cols-2 border-b">
          <div className="p-3">Average Customer Value</div>
          <div className="p-3">₹3,250</div>
        </div>
        <div className="grid grid-cols-2 border-b">
          <div className="p-3">Customer Acquisition Cost</div>
          <div className="p-3">₹450</div>
        </div>
        <div className="grid grid-cols-2 border-b">
          <div className="p-3">Customer Retention Rate</div>
          <div className="p-3">72%</div>
        </div>
        <div className="grid grid-cols-2">
          <div className="p-3">Repeat Purchase Rate</div>
          <div className="p-3">38%</div>
        </div>
      </div>
    </div>
  )
}

