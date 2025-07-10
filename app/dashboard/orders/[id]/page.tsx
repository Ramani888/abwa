"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Edit, FileText } from "lucide-react"
import Link from "next/link"
import { IOrder } from "@/types/order"
import { serverGetOrder } from "@/services/serverApi"
import { formatCurrency } from "@/utils/helpers/general"

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<IOrder>()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await serverGetOrder();
        const orderData = res?.data?.find((order: any) => order?._id?.toString() === params?.id);
        setOrder(orderData)
      } catch (error) {
        setOrder(undefined)
        setIsLoading(false)
        console.error("Failed to fetch order details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full px-2 md:px-0">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center w-full md:w-auto">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight break-all">Order #{order?._id}</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <Link href={`/dashboard/orders/${params.id}/edit`} className="w-full md:w-auto">
            <Button variant="outline" className="w-full md:w-auto">
              <Edit className="mr-2 h-4 w-4" />
              Edit Order
            </Button>
          </Link>
          <Link href={`/dashboard/orders/${params.id}/invoice`} className="w-full md:w-auto">
            <Button className="w-full md:w-auto">
              <FileText className="mr-2 h-4 w-4" />
              View Invoice
            </Button>
          </Link>
        </div>
      </div>

      <Card className="w-full mb-6">
        <CardHeader>
          <CardTitle>Order Information</CardTitle>
          <CardDescription>Order details and status information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Order Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Date:</span>
                  <span>{order?.captureDate ? new Date(order?.captureDate).toLocaleDateString() : ""}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={"default"}>{'Completed'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Status:</span>
                  <Badge variant={order?.paymentStatus === "paid" ? "default" : "destructive"} className="capitalize">
                    {order?.paymentStatus}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span>{order?.paymentMethod}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <Link href={`/dashboard/customers/${order?.customerData?._id}`} className="text-primary hover:underline capitalize break-all">
                    {order?.customerData?.name}
                  </Link>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge variant={order?.customerType === "wholesale" ? "default" : "secondary"}>
                    {order?.customerType === "wholesale" ? "Wholesale" : "Retail"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="break-all">{order?.customerData?.number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="break-all">{order?.customerData?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Size</TableHead>
                  <TableHead className="text-right">MRP</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Unit</TableHead>
                  <TableHead className="text-right">Carton</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">GST %</TableHead>
                  <TableHead className="text-right">GST Amount</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order?.products?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item?.productData?.name}</TableCell>
                    <TableCell className="text-right">{item?.variantData?.packingSize}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item?.mrp ?? item?.variantData?.mrp)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item?.price)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item?.unit ?? 1, false, false)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item?.carton ?? 1, false, false)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item?.quantity ?? ((item?.unit ?? 1) * (item?.carton ?? 1)), false, false)}</TableCell>
                    <TableCell className="text-right">{item?.gstRate} %</TableCell>
                    <TableCell className="text-right">{formatCurrency(item?.gstAmount)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item?.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 flex flex-col items-end">
            <div className="w-full md:w-1/2 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>{formatCurrency(Number(order?.subTotal))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total GST:</span>
                <span>{formatCurrency(Number(order?.totalGst))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Round-off:</span>
                <span>{formatCurrency(Number(order?.roundOff))}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>{formatCurrency(Number(order?.total))}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {order?.notes && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="break-words">{order?.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

