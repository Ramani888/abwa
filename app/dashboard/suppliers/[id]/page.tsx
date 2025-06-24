"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Edit, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { serverGetSupplierDetailOrder } from "@/services/serverApi"

export default function SupplierDetailsPage({ params }: { params: { id: string } }) {
  const [supplierData, setSupplierData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Calculate totals for trending UI
  const pendingTotal = supplierData?.orders?.reduce(
    (sum: number, order: any) => order.paymentStatus !== "paid" ? sum + (order.total || 0) : sum,
    0
  ) || 0;

  const paidTotal = supplierData?.orders?.reduce(
    (sum: number, order: any) => order.paymentStatus === "paid" ? sum + (order.total || 0) : sum,
    0
  ) || 0;

  const totalAmount = supplierData?.orders?.reduce(
    (sum: number, order: any) => sum + (order.total || 0),
    0
  ) || 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await serverGetSupplierDetailOrder(params?.id);
        setSupplierData(res?.data);
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch supplier data:", error)
        setIsLoading(false)
      }
    }

    fetchData();
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading supplier details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Supplier Details</h2>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/suppliers/${params.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Supplier
            </Button>
          </Link>
          <Link href={`/dashboard/suppliers/${params.id}/orders`}>
            <Button>
              <ShoppingBag className="mr-2 h-4 w-4" />
              View All Purchase Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* Modern Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="border border-red-200 bg-white transition-all duration-200">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <ArrowLeft className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground font-medium">Pending Amount</div>
              <div className="text-2xl font-bold text-red-600">₹{pendingTotal.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-green-200 bg-white transition-all duration-200">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <ShoppingBag className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground font-medium">Paid Amount</div>
              <div className="text-2xl font-bold text-green-600">₹{paidTotal.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-blue-200 bg-white transition-all duration-200">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <Edit className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground font-medium">Total Amount</div>
              <div className="text-2xl font-bold text-blue-600">₹{totalAmount.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Supplier Information</CardTitle>
            <CardDescription>Basic details and contact information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Basic Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{supplierData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{supplierData?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span>{supplierData?.number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address:</span>
                    <span>{supplierData?.address}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Purchase History</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Orders:</span>
                    <span>{supplierData?.totalOrder}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Spent:</span>
                    <span>₹{supplierData?.totalSpent?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Order:</span>
                    <span>{supplierData?.lastOrderDate ? new Date(supplierData?.lastOrderDate).toLocaleDateString() : ""}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Recent Purchase Orders</CardTitle>
            <CardDescription>Last few purchase orders placed by this supplier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supplierData?.orders?.map((order: any) => (
                    <TableRow key={order?._id}>
                      <TableCell className="font-medium">{order?._id}</TableCell>
                      <TableCell>{order?.captureDate ? new Date(order?.captureDate).toLocaleDateString() : ""}</TableCell>
                      <TableCell>₹{order?.total?.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className="capitalize" variant={order?.paymentStatus === "paid" ? "default" : "destructive"}>{order?.paymentStatus}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/dashboard/purchase-order/${order?._id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}