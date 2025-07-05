"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SalesOverview } from "@/components/dashboard/sales-overview"
import { RecentSales } from "@/components/dashboard/recent-sales"
import { CustomerStats } from "@/components/dashboard/customer-stats"
import { StockSummary } from "@/components/dashboard/stock-summary"
import { useSelector } from 'react-redux'
import { RootState } from "@/lib/store"
import { IProduct } from "@/types/product"

interface totalProductData extends IProduct {
  packingSize?: string
  unit?: string
  quantity?: number
  minStockLevel?: number
  status?: string
}


export default function DashboardPage() {
  const { customers } = useSelector((state: RootState) => state.customers)
  const { products } = useSelector((state: RootState) => state.products)
  const { orders } = useSelector((state: RootState) => state.orders)

  const totalOrders = orders?.length;
  const totalCustomers = customers?.length;
  const totalProducts = products?.reduce((acc, product) => acc + product?.variants?.length, 0);
  const totalRevenue = orders?.reduce((acc, order) => acc + order?.total, 0).toFixed(2);

  const thisMonth = new Date().toISOString().slice(0, 7);

  const monthlySales = orders?.filter(
    (order) =>
      order?.captureDate &&
      new Date(order.captureDate).toISOString().slice(0, 7) === thisMonth
  );

  // i want to find this week new customer from customers
  const thisWeekNewCustomers = customers?.filter((customer) => {
    const createdAt = new Date(customer?.captureDate ?? "");
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    return createdAt >= oneWeekAgo;
  });

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

  const lowStockProduct = totalProductData?.filter(product => product.status === "Low Stock")

  // Calculate orders for this week and last week
  const today = new Date();
  const startOfThisWeek = new Date(today);
  startOfThisWeek.setDate(today.getDate() - today.getDay()); // Sunday

  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

  const endOfLastWeek = new Date(startOfThisWeek);
  endOfLastWeek.setDate(startOfThisWeek.getDate() - 1);

  const thisWeekOrders = orders?.filter(order => {
    const date = new Date(order?.captureDate ?? "");
    return date >= startOfThisWeek && date <= today;
  }) || [];

  const lastWeekOrders = orders?.filter(order => {
    const date = new Date(order?.captureDate ?? "");
    return date >= startOfLastWeek && date <= endOfLastWeek;
  }) || [];

  const ordersSinceLastWeek = thisWeekOrders.length - lastWeekOrders.length;

  // Calculate current and previous month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // Orders in current month
  const currentMonthOrders = orders?.filter(order => {
    const date = new Date(order?.captureDate ?? "");
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }) || [];

  // Orders in previous month
  const prevMonthOrders = orders?.filter(order => {
    const date = new Date(order?.captureDate ?? "");
    return date.getMonth() === prevMonth && date.getFullYear() === prevMonthYear;
  }) || [];

  // Calculate percentage change
  const prevCount = prevMonthOrders.length;
  const currCount = currentMonthOrders.length;
  const orderPercentChange = prevCount === 0
    ? 100
    : (((currCount - prevCount) / prevCount) * 100).toFixed(1);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back to your agro shop dashboard.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue}</div>
            <p className="text-xs text-muted-foreground">
              {Number(orderPercentChange) > 0 ? "+" : ""}
              {orderPercentChange}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {ordersSinceLastWeek >= 0 ? "+" : ""}
              {ordersSinceLastWeek} since last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">{lowStockProduct?.length || 0} low stock items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">+{thisWeekNewCustomers?.length || 0} this week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <SalesOverview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>You made {monthlySales?.length || 0} sales this month.</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Statistics</CardTitle>
              <CardDescription>Breakdown of retail and wholesale customers</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomerStats />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Summary</CardTitle>
              <CardDescription>Overview of your inventory status</CardDescription>
            </CardHeader>
            <CardContent>
              <StockSummary />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

