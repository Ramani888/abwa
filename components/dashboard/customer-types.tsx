"use client"

import { Pie, PieChart, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts"

interface CustomerTypesProps {
  retailCustomers: number
  wholesaleCustomers: number
}

export function CustomerTypes({ retailCustomers, wholesaleCustomers }: CustomerTypesProps) {
  const data = [
    { name: "Retailers", value: retailCustomers, color: "hsl(var(--chart-1))" },
    { name: "Wholesalers", value: wholesaleCustomers, color: "hsl(var(--chart-2))" },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="border rounded-lg p-4">
          <div className="text-sm font-medium text-muted-foreground mb-1">Retailers</div>
          <div className="text-2xl font-bold">{retailCustomers}</div>
          <div className="text-sm text-muted-foreground">
            {Math.round((retailCustomers / (retailCustomers + wholesaleCustomers)) * 100)}% of total
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm font-medium text-muted-foreground mb-1">Wholesalers</div>
          <div className="text-2xl font-bold">{wholesaleCustomers}</div>
          <div className="text-sm text-muted-foreground">
            {Math.round((wholesaleCustomers / (retailCustomers + wholesaleCustomers)) * 100)}% of total
          </div>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} customers`, "Count"]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

