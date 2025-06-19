"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowDownToLine, ArrowUpFromLine, Loader2, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { IProduct } from "@/types/product"

interface StockTableProps {
  stockFilter: "all" | "low" | "out"
}

interface totalProductData extends IProduct {
  packingSize?: string
  unit?: string
  quantity?: number
  minStockLevel?: number
  status?: string
}

export function StockTable({ stockFilter }: StockTableProps) {
  const { products, loading } = useSelector((state: RootState) => state.products)

  const totalProductData: totalProductData[] =
    products?.flatMap((product) =>
      product?.variants?.map((variant) => ({
        ...product,
        packingSize: variant.packingSize,
        unit: variant.unit,
        quantity: variant.quantity,
        minStockLevel: variant.minStockLevel,
        status: variant?.status
      }))
    ) || []

  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredProducts = totalProductData?.filter((product) => {
    const matchesSearch =
      product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product?.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || product?.categoryName?.toLowerCase() === categoryFilter.toLowerCase()

    const matchesStockFilter =
      stockFilter === "all" ||
      (stockFilter === "low" && product?.status === "Low Stock") ||
      (stockFilter === "out" && product?.status === "Out of Stock")

    return matchesSearch && matchesCategory && matchesStockFilter
  })

  // Get unique categories
  const categories = ["all", ...new Set(totalProductData?.map((product) => product?.categoryName?.toLowerCase()))]

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
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
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
                  <SelectItem key={category ?? ""} value={category ?? ""}>
                    {(category ?? "").charAt(0).toUpperCase() + (category ?? "").slice(1)}
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
              <TableHead className="whitespace-nowrap">Product</TableHead>
              <TableHead className="whitespace-nowrap">Category</TableHead>
              <TableHead className="whitespace-nowrap">Current Stock</TableHead>
              <TableHead className="whitespace-nowrap">Min Stock</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap">Stock Level</TableHead>
              {/* <TableHead className="text-right">Actions</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center whitespace-nowrap">
                  <div className="flex justify-center items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span>Loading Stock...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : 
            filteredProducts?.length > 0 ? (
              filteredProducts?.map((product) => (
                <TableRow key={product?._id}>
                  <TableCell className="font-medium whitespace-nowrap">{product?.name} - {product?.packingSize}</TableCell>
                  <TableCell className="whitespace-nowrap">{product?.categoryName}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {product?.quantity} {product?.unit}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {product?.minStockLevel} {product?.unit}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge
                      variant={
                        product?.status === "In Stock"
                          ? "default"
                          : product.status === "Low Stock"
                            ? "outline"
                            : "destructive"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-[200px] whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <Progress
                        value={getStockPercentage(product?.quantity ?? 0, product?.minStockLevel ?? 1)}
                        className={
                          product.status === "Out of Stock"
                            ? "bg-destructive/20"
                            : product.status === "Low Stock"
                              ? "bg-amber-500/20"
                              : undefined
                        }
                      />
                      <span className="text-xs text-muted-foreground">
                        {(product?.quantity ?? 0) > 0
                          ? `${Math.round(((product?.quantity ?? 0) / (product?.minStockLevel ?? 1)) * 100)}% of minimum`
                          : "Out of stock"}
                      </span>
                    </div>
                  </TableCell>
                  {/* <TableCell className="text-right">
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
                  </TableCell> */}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center whitespace-nowrap">
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

