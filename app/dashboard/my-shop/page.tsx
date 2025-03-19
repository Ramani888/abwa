import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/dashboard/overview"
import { RecentSales } from "@/components/dashboard/recent-sales"
import { ShopDetails } from "@/components/dashboard/shop-details"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import Link from "next/link"

// Mock data for the shop
const shopData = {
  id: "1",
  name: "Green Harvest Agro Shop",
  owner: "Rahul Sharma",
  address: "123 Farm Road, Agricity",
  phone: "+91 9876543210",
  email: "contact@greenharvest.com",
  gstNumber: "22AAAAA0000A1Z5",
  established: "2022-05-15",
  totalProducts: 156,
  totalOrders: 573,
  totalCustomers: 248,
  totalRevenue: "₹45,231.89",
}

export default function MyShopPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{shopData.name}</h2>
          <p className="text-muted-foreground">Welcome back, {shopData.owner}</p>
        </div>
        <Link href="/dashboard/my-shop/edit">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Shop
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Shop Details</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{shopData.totalRevenue}</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{shopData.totalOrders}</div>
                <p className="text-xs text-muted-foreground">+201 since last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{shopData.totalProducts}</div>
                <p className="text-xs text-muted-foreground">12 low stock items</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{shopData.totalCustomers}</div>
                <p className="text-xs text-muted-foreground">+18 this week</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>You made 265 sales this month.</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Shop Information</CardTitle>
              <CardDescription>Details about your agro shop</CardDescription>
            </CardHeader>
            <CardContent>
              <ShopDetails shop={shopData} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>View detailed analytics for your shop.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Analytics content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

