"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Edit, ShoppingBag } from "lucide-react"
import Link from "next/link"

// Mock data for the customer
const customerData = {
  id: "1",
  name: "Rahul Sharma",
  email: "rahul@example.com",
  phone: "+91 9876543210",
  address: "123 Main St, Agricity",
  type: "retail",
  gstNumber: "",
  creditLimit: "",
  paymentTerms: "cod",
  totalOrders: 12,
  totalSpent: "₹15,200.00",
  lastOrderDate: "2023-03-15",
  // Recent orders
  recentOrders: [
    {
      id: "ORD-001",
      date: "2023-03-15",
      total: "₹2,500.00",
      status: "Completed",
      payment: "Paid",
    },
    {
      id: "ORD-008",
      date: "2023-03-10",
      total: "₹1,800.00",
      status: "Completed",
      payment: "Paid",
    },
    {
      id: "ORD-015",
      date: "2023-03-05",
      total: "₹3,200.00",
      status: "Completed",
      payment: "Paid",
    },
  ],
}

export default function CustomerDetailsPage({ params }: { params: { id: string } }) {
  const [customer, setCustomer] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // In a real app, you would fetch the customer data from an API
    // For now, we'll just use the mock data
    setCustomer(customerData)
    setIsLoading(false)
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading customer details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Customer Details</h2>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/customers/${params.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Customer
            </Button>
          </Link>
          <Link href={`/dashboard/customers/${params.id}/orders`}>
            <Button>
              <ShoppingBag className="mr-2 h-4 w-4" />
              View All Orders
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Basic details and contact information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Basic Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{customer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant={customer.type === "wholesale" ? "default" : "secondary"}>
                      {customer.type === "wholesale" ? "Wholesale" : "Retail"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address:</span>
                    <span>{customer.address}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Purchase History</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Orders:</span>
                    <span>{customer.totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Spent:</span>
                    <span>{customer.totalSpent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Order:</span>
                    <span>{customer.lastOrderDate}</span>
                  </div>
                  {customer.type === "wholesale" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">GST Number:</span>
                        <span>{customer.gstNumber || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Credit Limit:</span>
                        <span>{customer.creditLimit || "Not set"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Terms:</span>
                        <span>{customer.paymentTerms === "cod" ? "Cash on Delivery" : customer.paymentTerms}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Last few orders placed by this customer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customer.recentOrders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.total}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === "Completed"
                              ? "default"
                              : order.status === "Processing"
                                ? "outline"
                                : "secondary"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={order.payment === "Paid" ? "default" : "destructive"}>{order.payment}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/dashboard/orders/${order.id}`}>
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

