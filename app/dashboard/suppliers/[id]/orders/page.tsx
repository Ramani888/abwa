"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { serverGetAllPurchaseOrdersBySupplierId, serverGetSupplier } from "@/services/serverApi"
import { formatCurrency } from "@/utils/helpers/general"

export default function SupplierPurchaseOrdersPage({ params }: { params: { id: string } }) {
  const [supplierData, setSupplierData] = useState<any>(null)
  const [purchaseOrdersData, setPurchaseOrdersData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supplierRes = await serverGetSupplier();
        const supplier = supplierRes?.data?.find((c: any) => c?._id === params.id);
        setSupplierData(supplier);
        const res = await serverGetAllPurchaseOrdersBySupplierId(params?.id);
        setPurchaseOrdersData(res?.data);
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch supplier data:", error)
        setIsLoading(false)
      }
    }

    fetchData();
  }, [params.id])

  const filteredOrders = purchaseOrdersData?.filter((order) => {
    const matchesSearch = order?._id?.toLowerCase().includes(searchQuery.toLowerCase())

    // const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading supplier purchase orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Supplier Purchase Orders</h2>
          <p className="text-muted-foreground">
            All purchase orders from {supplierData?.name}
          </p>
        </div>
      </div>

      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle>Purchase Order History</CardTitle>
          <CardDescription>View and manage all purchase orders for this supplier</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="relative flex-1 w-full max-w-full sm:max-w-sm">
              <Input
                type="search"
                placeholder="Search by order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Status filter can be added here */}
          </div>

          <div className="overflow-x-auto">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  {/* <TableHead>Status</TableHead> */}
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders?.length > 0 ? (
                  filteredOrders?.map((order) => (
                    <TableRow key={order?._id}>
                      <TableCell className="font-medium">{order?._id}</TableCell>
                      <TableCell>{order?.captureDate ? new Date(order?.captureDate).toLocaleDateString() : ""}</TableCell>
                      <TableCell>{formatCurrency(Number(order?.products?.length), false, false)}</TableCell>
                      <TableCell>{formatCurrency(Number(order?.total))}</TableCell>
                      {/* <TableCell>
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
                      </TableCell> */}
                      <TableCell>
                        <Badge variant={order?.paymentStatus === "paid" ? "default" : "destructive"} className="capitalize">{order?.paymentStatus}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/dashboard/purchase-order/${order?._id}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                          {/* <Link href={`/dashboard/purchase-order/${order?._id}/invoice`}>
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </Link> */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No purchase orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

