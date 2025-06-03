"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Edit, FileText } from "lucide-react"
import Link from "next/link"
import { serverGetPurchaseOrder } from "@/services/serverApi"
import { IPurchaseOrder } from "@/types/purchaseOrder"

export default function PurchaseOrderDetailsPage({ params }: { params: { id: string } }) {
  const [purchaseOrder, setPurchaseOrder] = useState<IPurchaseOrder>()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await serverGetPurchaseOrder();
        const orderData = res?.data?.find((order: any) => order?._id?.toString() === params?.id);
        setPurchaseOrder(orderData)
      } catch (error) {
        setPurchaseOrder(undefined)
        setIsLoading(false)
        console.error("Failed to fetch purchase order details:", error)
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
          <p className="mt-2">Loading purchase order details...</p>
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
          <h2 className="text-3xl font-bold tracking-tight">Purchase Order #{purchaseOrder?._id}</h2>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/purchase-order/${params.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Purchase Order
            </Button>
          </Link>
          <Link href={`/dashboard/purchase-order/${params.id}/invoice`}>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              View Invoice
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Purchase Order Information</CardTitle>
            <CardDescription>Order details and status information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Order Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Purchase Order Date:</span>
                    <span>{purchaseOrder?.createdAt ? new Date(purchaseOrder.createdAt).toLocaleDateString() : ""}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    {/* <Badge variant={order.status === "Completed" ? "default" : "outline"}>{order.status}</Badge> */}
                    <Badge variant={"default"}>{'Completed'}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Status:</span>
                    <Badge variant={purchaseOrder?.paymentStatus === "paid" ? "default" : "destructive"} className="capitalize">
                      {purchaseOrder?.paymentStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span>{purchaseOrder?.paymentMethod}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Supplier Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <Link href={`/dashboard/suppliers`} className="text-primary hover:underline capitalize">
                      {purchaseOrder?.supplierData?.name}
                    </Link>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span>{purchaseOrder?.supplierData?.number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{purchaseOrder?.supplierData?.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Purchase Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Size</TableHead>
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
                  {purchaseOrder?.products?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item?.productData?.name}</TableCell>
                      <TableCell className="text-right">{item?.variantData?.packingSize}</TableCell>
                      <TableCell className="text-right">₹{item?.price?.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item?.unit ?? 1}</TableCell>
                      <TableCell className="text-right">{item?.carton ?? 1}</TableCell>
                      <TableCell className="text-right">{item?.quantity ?? ((item?.unit ?? 1) * (item?.carton ?? 1))}</TableCell>
                      <TableCell className="text-right">{item?.gstRate} %</TableCell>
                      <TableCell className="text-right">₹{item?.gstAmount}</TableCell>
                      <TableCell className="text-right">₹{item?.total?.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 flex justify-end">
              <div className="w-full md:w-1/2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>₹{purchaseOrder?.subTotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total GST:</span>
                  <span>₹{purchaseOrder?.totalGst?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Round-off:</span>
                  <span>₹{purchaseOrder?.roundOff?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>₹{purchaseOrder?.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {purchaseOrder?.notes && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{purchaseOrder?.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

