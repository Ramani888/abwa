"use client"

import { Button } from "@/components/ui/button"
import { StockTable } from "@/components/dashboard/stock-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDownToLine, ArrowUpFromLine, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { Skeleton } from "@/components/ui/skeleton"
import { IProduct } from "@/types/product"

function CardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" /> {/* Title */}
        <Skeleton className="h-4 w-4" />   {/* Icon */}
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-2" /> {/* Main number */}
        <Skeleton className="h-3 w-32" />      {/* Description */}
      </CardContent>
    </Card>
  );
}

interface totalProductData extends IProduct {
  packingSize?: string
  unit?: string
  quantity?: number
  minStockLevel?: number
  status?: string
}

export default function StockPage() {
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

  const totalProducts = totalProductData?.length || 0;

  const lowStockProduct = totalProductData?.filter(product => product.status === "Low Stock")
  const totalLowStockProduct = lowStockProduct?.length || 0;

  const outOfStockProduct = totalProductData?.filter(product => product.status === "Out of Stock")
  const totalOutOfStockProduct = outOfStockProduct?.length || 0;

  const inStockProduct = totalProductData?.filter(product => product.status === "In Stock")
  const totalInStockProduct = inStockProduct?.length || 0;

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Stock Management</h2>
        {/* <div className="flex gap-2">
          <Link href="/dashboard/stock/in">
            <Button variant="outline">
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Stock In
            </Button>
          </Link>
          <Link href="/dashboard/stock/out">
            <Button variant="outline">
              <ArrowUpFromLine className="mr-2 h-4 w-4" />
              Stock Out
            </Button>
          </Link>
        </div> */}
      </div>

      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4">
        {/* Total Products Card */}
        {loading ? (
          <CardSkeleton />
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">Across all categories</p>
            </CardContent>
          </Card>
        )}

        {/* Low Stock Items Card */}
        {loading ? (
          <CardSkeleton />
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLowStockProduct}</div>
              <p className="text-xs text-muted-foreground">Below minimum stock level</p>
            </CardContent>
          </Card>
        )}

        {/* Out of Stock Card */}
        {loading ? (
          <CardSkeleton />
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOutOfStockProduct}</div>
              <p className="text-xs text-muted-foreground">Need immediate restock</p>
            </CardContent>
          </Card>
        )}
        
        {/* In Stock Card */}
        {loading ? (
          <CardSkeleton />
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInStockProduct}</div>
              <p className="text-xs text-muted-foreground">Above minimum stock level</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Stock</TabsTrigger>
          <TabsTrigger value="low">Low Stock</TabsTrigger>
          <TabsTrigger value="out">Out of Stock</TabsTrigger>
          <TabsTrigger value="in">In Stock</TabsTrigger>
          <TabsTrigger value="history">Stock History</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <StockTable stockFilter="all" />
        </TabsContent>
        <TabsContent value="low">
          <StockTable stockFilter="low" />
        </TabsContent>
        <TabsContent value="out">
          <StockTable stockFilter="out" />
        </TabsContent>
        <TabsContent value="in">
          <StockTable stockFilter="in" />
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movement History</CardTitle>
              <CardDescription>Track all stock movements including additions and removals</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Stock movement history will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

