"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SalesAnalyticsChart } from "@/components/dashboard/sales-analytics-chart"
import { CustomerAnalyticsChart } from "@/components/dashboard/customer-analytics-chart"
import { ProductAnalyticsChart } from "@/components/dashboard/product-analytics-chart"
import { Button } from "@/components/ui/button"
import { Download, BarChart3, Users, Package } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useMemo } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { exportToCsv } from "@/utils/helpers/report"
import { formatCurrency } from "@/utils/helpers/general"

export default function AnalyticsPage() {
  const { customers, loading: customerLoading } = useSelector((state: RootState) => state.customers)
  const { products, loading: productLoading } = useSelector((state: RootState) => state.products)
  const { orders, loading: orderLoading } = useSelector((state: RootState) => state.orders)

  const [selectedPeriod, setSelectedPeriod] = useState("current-month")
  const isLoading = customerLoading || productLoading || orderLoading

  // Filter orders by period (example: only current month)
  const filteredOrders = useMemo(() => {
    if (!orders) return []
    if (selectedPeriod === "current-month") {
      const now = new Date()
      return orders.filter(order => {
        const date = new Date(order.captureDate ?? order.createdAt ?? "")
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      })
    }
    // Add more period filters as needed
    return orders
  }, [orders, selectedPeriod])

  // Filter customers by period (example: only current month)
  const filteredCustomers = useMemo(() => {
    if (!customers) return []
    if (selectedPeriod === "current-month") {
      const now = new Date()
      return customers.filter(c => {
        if (!c.createdAt && !c.captureDate) return false
        const date = new Date(c.captureDate ?? c.createdAt ?? "")
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      })
    }
    // Add more period filters as needed
    return customers
  }, [customers, selectedPeriod])

  // Analytics calculations
  const totalRevenue = useMemo(
    () => filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0),
    [filteredOrders]
  )
  const retailSales = useMemo(
    () => filteredOrders.filter(o => o.customerType === "retail").reduce((sum, o) => sum + (o.total || 0), 0),
    [filteredOrders]
  )
  const wholesaleSales = useMemo(
    () => filteredOrders.filter(o => o.customerType === "wholesale").reduce((sum, o) => sum + (o.total || 0), 0),
    [filteredOrders]
  )
  const newCustomers = useMemo(() => {
    if (!customers) return 0
    const now = new Date()
    return customers.filter(c => {
      if (!c.createdAt && !c.captureDate) return false
      const date = new Date(c.captureDate ?? c.createdAt ?? "")
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }).length
  }, [customers])

  // Aggregate product sales/profit for the selected period
  const productSalesMap = useMemo(() => {
    if (!products || !filteredOrders) return []
    // Map productId to sales/profit
    const map: Record<string, { name: string; variants: any[] }> = {}

    filteredOrders.forEach(order => {
      order.products.forEach(item => {
        const product = products.find(p => p._id === item.productId)
        if (!product) return
        if (!map[item.productId]) {
          map[item.productId] = {
            name: product.name,
            variants: product.variants.map(v => ({
              ...v,
              // We'll override quantity with the order's quantity for this variant if it matches
              quantity: 0,
            })),
          }
        }
        // Find the variant in the map and add the quantity from the order
        const variantIdx = product.variants.findIndex(v => v._id === item.variantId)
        if (variantIdx !== -1) {
          map[item.productId].variants[variantIdx].quantity += item.quantity
        }
      })
    })

    // Only include products that had sales in this period
    return Object.values(map)
  }, [products, filteredOrders])

  // Export handlers
  function handleExport(type: "orders" | "customers" | "products") {
    if (type === "orders") {
      exportToCsv(
        "orders.csv",
        filteredOrders,
        [
          "_id",
          "customerId",
          "customerType",
          "subTotal",
          "totalGst",
          "roundOff",
          "total",
          "paymentMethod",
          "paymentStatus",
          "createdAt"
        ],
        [
          "Order ID",
          "Customer ID",
          "Customer Type",
          "Subtotal",
          "Total GST",
          "Round Off",
          "Total",
          "Payment Method",
          "Payment Status",
          "Created At"
        ]
      )
    } else if (type === "customers") {
      exportToCsv(
        "customers.csv",
        filteredCustomers,
        [
          "_id",
          "name",
          "email",
          "number",
          "customerType",
          "address",
          "createdAt"
        ],
        [
          "Customer ID",
          "Name",
          "Email",
          "Phone",
          "Customer Type",
          "Address",
          "Created At"
        ]
      )
    } else if (type === "products") {
      // Flatten productSalesMap for CSV export
      const flatProducts = productSalesMap.flatMap(product =>
        product.variants.map(variant => ({
          productName: product.name,
          variantName: variant.unit,
          sku: variant.sku,
          quantity: variant.quantity,
          retailPrice: variant.retailPrice,
          wholesalePrice: variant.wholesalePrice,
          purchasePrice: variant.purchasePrice,
        }))
      )
      exportToCsv(
        "products.csv",
        flatProducts,
        [
          "productName",
          "variantName",
          "sku",
          "quantity",
          "retailPrice",
          "wholesalePrice",
          "purchasePrice"
        ],
        [
          "Product Name",
          "Variant",
          "SKU",
          "Quantity Sold",
          "Retail Price",
          "Wholesale Price",
          "Purchase Price"
        ]
      )
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full px-2 sm:px-4 md:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Analytics</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleExport("orders")}>
              Export Orders (Current Period)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("customers")}>
              Export Customers (Current Period)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("products")}>
              Export Products (Current Period)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Select defaultValue={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current-month">Current Month</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="last-3-months">Last 3 Months</SelectItem>
            <SelectItem value="last-6-months">Last 6 Months</SelectItem>
            <SelectItem value="year-to-date">Year to Date</SelectItem>
            <SelectItem value="last-year">Last Year</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24 mb-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-3 w-28" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24 mb-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-32 mb-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-3 w-28" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-28 mb-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">Compared to last period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Retail Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(retailSales)}</div>
                <p className="text-xs text-muted-foreground">Compared to last period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wholesale Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(wholesaleSales)}</div>
                <p className="text-xs text-muted-foreground">Compared to last period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{formatCurrency(newCustomers, false, false)}</div>
                <p className="text-xs text-muted-foreground">Compared to last period</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList
          className="
            flex flex-row gap-2
            items-start
            justify-start
            overflow-x-auto
            whitespace-nowrap
            w-full
            sm:w-auto
            scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent
            px-1
          "
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <TabsTrigger value="sales" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Sales Analytics
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Customer Analytics
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center">
            <Package className="mr-2 h-4 w-4" />
            Product Analytics
          </TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Trends</CardTitle>
              <CardDescription>Analyze your sales performance over time</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {orderLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-40 mb-4" />
                  <Skeleton className="h-[300px] w-full mb-2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              ) : (
                <div className="min-w-[320px]">
                  <SalesAnalyticsChart orders={filteredOrders} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Insights</CardTitle>
              <CardDescription>Understand your customer base and purchasing patterns</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {customerLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-40 mb-4" />
                  <Skeleton className="h-[300px] w-full mb-2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              ) : (
                <div className="min-w-[320px]">
                  <CustomerAnalyticsChart customers={filteredCustomers} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>Analyze which products are selling best</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {productLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-40 mb-4" />
                  <Skeleton className="h-[300px] w-full mb-2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              ) : (
                <div className="min-w-[320px]">
                  <ProductAnalyticsChart products={productSalesMap} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

