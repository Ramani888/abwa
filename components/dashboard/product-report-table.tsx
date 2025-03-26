"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

// Mock data for product reports
const productReports = [
  {
    id: "1",
    name: "Organic Fertilizer",
    category: "Fertilizers",
    sold: 245,
    revenue: "₹208,250.00",
    profit: "₹49,000.00",
    profitMargin: 23.5,
  },
  {
    id: "2",
    name: "Wheat Seeds (Premium)",
    category: "Seeds",
    sold: 180,
    revenue: "₹81,000.00",
    profit: "₹18,000.00",
    profitMargin: 22.2,
  },
  {
    id: "3",
    name: "Pesticide Spray",
    category: "Pesticides",
    sold: 120,
    revenue: "₹42,000.00",
    profit: "₹12,000.00",
    profitMargin: 28.6,
  },
  {
    id: "4",
    name: "Garden Tools Set",
    category: "Tools",
    sold: 85,
    revenue: "₹102,000.00",
    profit: "₹25,500.00",
    profitMargin: 25.0,
  },
  {
    id: "5",
    name: "Drip Irrigation Kit",
    category: "Irrigation",
    sold: 65,
    revenue: "₹162,500.00",
    profit: "₹48,750.00",
    profitMargin: 30.0,
  },
]

export function ProductReportTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Units Sold</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
            <TableHead className="text-right">Profit</TableHead>
            <TableHead>Profit Margin</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productReports.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell className="text-right">{product.sold}</TableCell>
              <TableCell className="text-right">{product.revenue}</TableCell>
              <TableCell className="text-right">{product.profit}</TableCell>
              <TableCell className="w-[200px]">
                <div className="flex flex-col gap-1">
                  <Progress value={product.profitMargin} />
                  <span className="text-xs text-muted-foreground">{product.profitMargin}%</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

