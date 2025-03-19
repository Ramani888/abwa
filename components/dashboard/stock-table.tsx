"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowDownToLine, ArrowUpFromLine, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

// Mock data for products
const products = [
  {
    id: "1",
    name: "Organic Fertilizer",
    category: "Fertilizers",
    stock: 120,
    minStock: 20,
    unit: "kg",
    status: "In Stock",
  },
  {
    id: "2",
    name: "Wheat Seeds (Premium)",
    category: "Seeds",
    stock: 85,
    minStock: 50,
    unit: "kg",
    status: "In Stock",
  },
  {
    id: "3",
    name: "Pesticide Spray",
    category: "Pesticides",
    stock: 42,
    minStock: 40,
    unit: "l",
    status: "Low Stock",
  },
  {
    id: "4",
    name: "Garden Tools Set",
    category: "Tools",
    stock: 18,
    minStock: 20,
    unit: "pcs",
    status: "Low Stock",
  },
  {
    id: "5",
    name: "Drip Irrigation Kit",
    category: "Irrigation",
    stock: 0,
    minStock: 10,
    unit: "set",
    status: "Out of Stock",
  },
]

interface StockTableProps {
  stockFilter: "all" | "low" | "out"
}

export function StockTable({ stockFilter }: StockTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || product.category.toLowerCase() === categoryFilter.toLowerCase()

    const matchesStockFilter =
      stockFilter === "all" ||
      (stockFilter === "low" && product.status === "Low Stock") ||
      (stockFilter === "out" && product.status === "Out of Stock")

    return matchesSearch && matchesCategory && matchesStockFilter
  })

  // Get unique categories
  const categories = ["all", ...new Set(products.map((product) => product.category.toLowerCase()))]

  const getStockPercentage = (current: number, min: number) => {
    if (current === 0) return 0
    // Calculate percentage relative to minimum stock
    // If min is 20 and current is 40, we want to show 200%
    const percentage = (current / min) * 100
    // Cap at 100% for visual clarity
    return Math.min(percentage, 100)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories
                .filter((c) => c !== "all")
                .map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Min Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    {product.stock} {product.unit}
                  </TableCell>
                  <TableCell>
                    {product.minStock} {product.unit}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "In Stock"
                          ? "default"
                          : product.status === "Low Stock"
                            ? "outline"
                            : "destructive"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-[200px]">
                    <div className="flex flex-col gap-1">
                      <Progress
                        value={getStockPercentage(product.stock, product.minStock)}
                        className={
                          product.status === "Out of Stock"
                            ? "bg-destructive/20"
                            : product.status === "Low Stock"
                              ? "bg-amber-500/20"
                              : undefined
                        }
                      />
                      <span className="text-xs text-muted-foreground">
                        {product.stock > 0
                          ? `${Math.round((product.stock / product.minStock) * 100)}% of minimum`
                          : "Out of stock"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <ArrowDownToLine className="h-4 w-4" />
                        <span className="sr-only md:not-sr-only md:ml-2">Stock In</span>
                      </Button>
                      <Button variant="outline" size="sm">
                        <ArrowUpFromLine className="h-4 w-4" />
                        <span className="sr-only md:not-sr-only md:ml-2">Stock Out</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

