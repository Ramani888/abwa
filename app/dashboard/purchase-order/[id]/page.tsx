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
    <div className="w-full px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <div className="flex items-center">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="mr-3 sm:mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight break-all">
            Purchase Order #{purchaseOrder?._id}
          </h2>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Link href={`/dashboard/purchase-order/${params.id}/edit`} className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              <Edit className="mr-2 h-4 w-4" />
              Edit Purchase Order
            </Button>
          </Link>
          <Link href={`/dashboard/purchase-order/${params.id}/invoice`} className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <FileText className="mr-2 h-4 w-4" />
              View Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* <div className="grid gap-4 sm:gap-6"> */}
        <Card className="w-full mb-6">
          <CardHeader>
            <CardTitle>Purchase Order Information</CardTitle>
            <CardDescription>Order details and status information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Order Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Purchase Order Date:</span>
                    <span className="text-right">{purchaseOrder?.captureDate ? new Date(purchaseOrder?.captureDate).toLocaleDateString() : ""}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={"default"}>Completed</Badge>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Payment Status:</span>
                    <Badge variant={purchaseOrder?.paymentStatus === "paid" ? "default" : "destructive"} className="capitalize">
                      {purchaseOrder?.paymentStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span className="text-right">{purchaseOrder?.paymentMethod}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 md:mt-0">
                <h3 className="text-lg font-semibold mb-2">Supplier Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Name:</span>
                    <Link href={`/dashboard/suppliers/${purchaseOrder?.supplierData?._id}`} className="text-primary hover:underline capitalize text-right">
                      {purchaseOrder?.supplierData?.name}
                    </Link>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="text-right">{purchaseOrder?.supplierData?.number}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="text-right break-all">{purchaseOrder?.supplierData?.email}</span>
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
                  {purchaseOrder?.products?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item?.productData?.name}</TableCell>
                      <TableCell className="text-right">{item?.variantData?.packingSize}</TableCell>
                      <TableCell className="text-right">
                        ₹{(item?.mrp ?? item?.variantData?.mrp ?? 0).toFixed(2)}
                      </TableCell>
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

            <div className="mt-6 flex flex-col items-end">
              <div className="w-full sm:w-2/3 md:w-1/2 space-y-2">
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>₹{purchaseOrder?.subTotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Total GST:</span>
                  <span>₹{purchaseOrder?.totalGst?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Round-off:</span>
                  <span>₹{purchaseOrder?.roundOff?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between gap-2 font-bold">
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
              <p className="break-words">{purchaseOrder?.notes}</p>
            </CardContent>
          </Card>
        )}
      {/* </div> */}
    </div>
  )
}

