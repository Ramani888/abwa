"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock data for customer reports
const customerReports = [
  {
    id: "1",
    name: "Rahul Sharma",
    type: "retail",
    orders: 12,
    spent: "₹15,200.00",
    avgOrderValue: "₹1,266.67",
    lastPurchase: "2 days ago",
    initials: "RS",
  },
  {
    id: "2",
    name: "Priya Patel",
    type: "retail",
    orders: 8,
    spent: "₹9,800.00",
    avgOrderValue: "₹1,225.00",
    lastPurchase: "1 week ago",
    initials: "PP",
  },
  {
    id: "3",
    name: "Amit Kumar Enterprises",
    type: "wholesale",
    orders: 25,
    spent: "₹1,24,500.00",
    avgOrderValue: "₹4,980.00",
    lastPurchase: "3 days ago",
    initials: "AK",
  },
  {
    id: "4",
    name: "Neha Singh",
    type: "retail",
    orders: 15,
    spent: "₹22,300.00",
    avgOrderValue: "₹1,486.67",
    lastPurchase: "5 days ago",
    initials: "NS",
  },
  {
    id: "5",
    name: "Vikram Reddy Distributors",
    type: "wholesale",
    orders: 32,
    spent: "₹2,45,600.00",
    avgOrderValue: "₹7,675.00",
    lastPurchase: "Yesterday",
    initials: "VR",
  },
]

export function CustomerReportTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Orders</TableHead>
            <TableHead className="text-right">Total Spent</TableHead>
            <TableHead className="text-right">Avg. Order Value</TableHead>
            <TableHead>Last Purchase</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customerReports.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{customer.initials}</AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{customer.name}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={customer.type === "wholesale" ? "default" : "secondary"}>
                  {customer.type === "wholesale" ? "Wholesale" : "Retail"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{customer.orders}</TableCell>
              <TableCell className="text-right">{customer.spent}</TableCell>
              <TableCell className="text-right">{customer.avgOrderValue}</TableCell>
              <TableCell>{customer.lastPurchase}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

