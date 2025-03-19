"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowDownToLine, ArrowUpFromLine, Search, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for stock history
const stockHistory = [
  {
    id: "1",
    date: "2023-03-15 14:30",
    product: "Organic Fertilizer",
    type: "in",
    quantity: "50 kg",
    reason: "Purchase",
    reference: "INV-12345",
    user: "Admin",
  },
  {
    id: "2",
    date: "2023-03-14 11:20",
    product: "Wheat Seeds (Premium)",
    type: "in",
    quantity: "30 kg",
    reason: "Purchase",
    reference: "INV-12346",
    user: "Admin",
  },
  {
    id: "3",
    date: "2023-03-13 16:45",
    product: "Pesticide Spray",
    type: "out",
    quantity: "5 l",
    reason: "Damaged/Expired",
    reference: "-",
    user: "Admin",
  },
  {
    id: "4",
    date: "2023-03-12 09:15",
    product: "Garden Tools Set",
    type: "in",
    quantity: "10 pcs",
    reason: "Purchase",
    reference: "INV-12347",
    user: "Admin",
  },
  {
    id: "5",
    date: "2023-03-10 13:30",
    product: "Organic Fertilizer",
    type: "out",
    quantity: "15 kg",
    reason: "Inventory Adjustment",
    reference: "-",
    user: "Admin",
  },
  {
    id: "6",
    date: "2023-03-08 10:00",
    product: "Drip Irrigation Kit",
    type: "in",
    quantity: "5 set",
    reason: "Purchase",
    reference: "INV-12348",
    user: "Admin",
  },
  {
    id: "7",
    date: "2023-03-05 14:20",
    product: "Wheat Seeds (Premium)",
    type: "out",
    quantity: "10 kg",
    reason: "Return to Supplier",
    reference: "RET-001",
    user: "Admin",
  },
]

export default function StockHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const router = useRouter()

  const filteredHistory = stockHistory.filter((item) => {
    const matchesSearch =
      item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reference.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = typeFilter === "all" || item.type === typeFilter

    return matchesSearch && matchesType
  })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Stock Movement History</h2>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Stock History</CardTitle>
            <CardDescription>Track all stock movements including additions and removals</CardDescription>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products or references..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Movement Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Movements</SelectItem>
                <SelectItem value="in">Stock In</SelectItem>
                <SelectItem value="out">Stock Out</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell className="font-medium">{item.product}</TableCell>
                      <TableCell>
                        <Badge
                          variant={item.type === "in" ? "default" : "secondary"}
                          className="flex items-center gap-1 w-fit"
                        >
                          {item.type === "in" ? (
                            <>
                              <ArrowDownToLine className="h-3 w-3" />
                              Stock In
                            </>
                          ) : (
                            <>
                              <ArrowUpFromLine className="h-3 w-3" />
                              Stock Out
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.reason}</TableCell>
                      <TableCell>{item.reference}</TableCell>
                      <TableCell>{item.user}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No stock movements found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

