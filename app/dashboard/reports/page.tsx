"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SalesReportChart } from "@/components/dashboard/sales-report-chart"
import { ProductReportTable } from "@/components/dashboard/product-report-table"
import { CustomerReportTable } from "@/components/dashboard/customer-report-table"
import { Button } from "@/components/ui/button"
import { Download, FileText, BarChart3, Users } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { useMemo, useRef, useState } from "react"
import { exportToCsv } from "@/utils/helpers/report"
import { Skeleton } from "@/components/ui/skeleton"

export default function ReportsPage() {
  const { customers, loading: customerLoading } = useSelector((state: RootState) => state.customers)
  const { products, loading: productLoading } = useSelector((state: RootState) => state.products)
  const { orders, loading: orderLoading } = useSelector((state: RootState) => state.orders)

  const [selectedPeriod, setSelectedPeriod] = useState("current-month")
  const [activeTab, setActiveTab] = useState("sales")
  const productExportRef = useRef<() => void>(null)
  const customerExportRef = useRef<() => void>(null)

  // Helper to filter orders by period
  function filterOrders(period: string) {
    const now = new Date()
    if (!orders) return []
    if (period === "current-month") {
      return orders.filter(order => {
        const date = new Date(order?.captureDate ?? "")
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      })
    }
    if (period === "last-month") {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      return orders.filter(order => {
        const date = new Date(order?.captureDate ?? "")
        return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear()
      })
    }
    // Add more period filters as needed
    return orders
  }

  // Filter orders for selected period and last month
  const currentOrders = useMemo(() => filterOrders(selectedPeriod), [orders, selectedPeriod])
  const lastMonthOrders = useMemo(() => filterOrders(
    selectedPeriod === "current-month" ? "last-month" : "current-month"
  ), [orders, selectedPeriod])

  // Calculate stats for selected period
  const totalSales = currentOrders.reduce((sum, order) => sum + (order.total || 0), 0)
  const totalOrders = currentOrders.length
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0

  // Calculate stats for previous period
  const lastPeriodSales = lastMonthOrders.reduce((sum, order) => sum + (order.total || 0), 0)
  const lastPeriodOrders = lastMonthOrders.length
  const lastPeriodAvgOrderValue = lastPeriodOrders > 0 ? lastPeriodSales / lastPeriodOrders : 0

  // Customers for conversion rate (not period filtered, but you can filter if needed)
  const totalCustomers = customers?.length || 0
  const lastPeriodTotalCustomers = totalCustomers // Or filter by period if needed

  // Conversion rate for selected and previous period
  const conversionRate = totalCustomers > 0 ? (totalOrders / totalCustomers) * 100 : 0
  const lastPeriodConversionRate = lastPeriodTotalCustomers > 0 ? (lastPeriodOrders / lastPeriodTotalCustomers) * 100 : 0

  // Calculate changes
  const salesChange = lastPeriodSales === 0 ? 0 : ((totalSales - lastPeriodSales) / lastPeriodSales) * 100
  const ordersChange = lastPeriodOrders === 0 ? 0 : ((totalOrders - lastPeriodOrders) / lastPeriodOrders) * 100
  const avgOrderValueChange = lastPeriodAvgOrderValue === 0 ? 0 : ((avgOrderValue - lastPeriodAvgOrderValue) / lastPeriodAvgOrderValue) * 100
  const conversionRateChange = lastPeriodConversionRate === 0 ? 0 : ((conversionRate - lastPeriodConversionRate) / lastPeriodConversionRate) * 100

  function handleExport() {
    if (activeTab === "products" && productExportRef.current) {
      productExportRef.current()
    } else if (activeTab === "customers" && customerExportRef.current) {
      customerExportRef.current()
    } else if (activeTab === "sales") {
      // Example: Export sales summary as CSV
      exportToCsv(
        `sales-summary-${selectedPeriod}.csv`,
        [
          {
            totalSales,
            totalOrders,
            avgOrderValue,
            conversionRate: conversionRate.toFixed(1) + "%",
            salesChange: salesChange.toFixed(1) + "%",
            ordersChange: ordersChange.toFixed(1) + "%",
            avgOrderValueChange: avgOrderValueChange.toFixed(1) + "%",
            conversionRateChange: conversionRateChange.toFixed(1) + "%",
          },
        ],
        [
          "totalSales",
          "totalOrders",
          "avgOrderValue",
          "conversionRate",
          "salesChange",
          "ordersChange",
          "avgOrderValueChange",
          "conversionRateChange",
        ],
        [
          "Total Sales",
          "Total Orders",
          "Average Order Value",
          "Conversion Rate",
          "Sales Change",
          "Orders Change",
          "Avg Order Value Change",
          "Conversion Rate Change",
        ]
      )
    }
  }

  const isLoading = customerLoading || productLoading || orderLoading

  return (
    <div className="flex flex-col gap-6 w-full px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Reports</h2>
        { activeTab !== "sales" && (
          <Button
            className="w-full sm:w-auto"
            onClick={handleExport}
            disabled={activeTab === "sales"}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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

      <Tabs
        defaultValue="sales"
        className="space-y-4"
        onValueChange={setActiveTab}
      >
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
          <TabsTrigger value="sales" className="flex items-center min-w-[140px] justify-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Sales Reports
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center min-w-[140px] justify-center">
            <FileText className="mr-2 h-4 w-4" />
            Product Reports
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center min-w-[140px] justify-center">
            <Users className="mr-2 h-4 w-4" />
            Customer Reports
          </TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
              <>
                {/* Total Sales Card Skeleton */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-24 mb-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-32 mb-2" />
                    <Skeleton className="h-3 w-28" />
                  </CardContent>
                </Card>
                {/* Total Orders Card Skeleton */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-24 mb-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </CardContent>
                </Card>
                {/* Average Order Value Card Skeleton */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-32 mb-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-24 mb-2" />
                    <Skeleton className="h-3 w-28" />
                  </CardContent>
                </Card>
                {/* Conversion Rate Card Skeleton */}
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
                {/* Total Sales Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹{totalSales.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                    <p className="text-xs text-muted-foreground">
                      {salesChange >= 0 ? "+" : ""}
                      {salesChange.toFixed(1)}% from last period
                    </p>
                  </CardContent>
                </Card>
                {/* Total Orders Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalOrders}</div>
                    <p className="text-xs text-muted-foreground">
                      {totalOrders - lastPeriodOrders >= 0 ? "+" : ""}
                      {(totalOrders - lastPeriodOrders)} since last period
                    </p>
                  </CardContent>
                </Card>
                {/* Average Order Value Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹{avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                    <p className="text-xs text-muted-foreground">
                      {avgOrderValueChange >= 0 ? "+" : ""}
                      {avgOrderValueChange.toFixed(1)}% from last period
                    </p>
                  </CardContent>
                </Card>
                {/* Conversion Rate Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">
                      {conversionRateChange >= 0 ? "+" : ""}
                      {conversionRateChange.toFixed(1)}% from last period
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Monthly sales performance for the current period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-40 mb-4" />
                    <Skeleton className="h-[220px] w-full mb-2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                ) : (
                  <SalesReportChart selectedPeriod={selectedPeriod} />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>Top selling products and inventory analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                {productLoading ? (
                  <div>
                    <Skeleton className="h-6 w-40 mb-4" />
                    {/* Table header skeleton */}
                    <div className="flex gap-4 mb-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    {/* Table rows skeleton */}
                    {[...Array(5)].map((_, i) => (
                      <div className="flex gap-4 mb-2" key={i}>
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <ProductReportTable
                    selectedPeriod={selectedPeriod}
                    exportRef={productExportRef}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Analysis</CardTitle>
              <CardDescription>Customer purchase patterns and loyalty metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                {customerLoading ? (
                  <div>
                    <Skeleton className="h-6 w-40 mb-4" />
                    {/* Table header skeleton */}
                    <div className="flex gap-4 mb-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    {/* Table rows skeleton */}
                    {[...Array(5)].map((_, i) => (
                      <div className="flex gap-4 mb-2" key={i}>
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <CustomerReportTable
                    selectedPeriod={selectedPeriod}
                    exportRef={customerExportRef}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

