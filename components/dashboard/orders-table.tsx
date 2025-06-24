"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Edit, Eye, FileText, Loader2, MoreHorizontal, Printer, Search, Trash } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { usePermission } from "@/hooks/usePermission"
import { Permissions } from "@/utils/consts/permission"
import { IOrder } from "@/types/order"
import { serverDeleteOrder, serverGetOrder } from "@/services/serverApi"
import { paymentStatuses } from "@/utils/consts/product"

export function OrdersTable({ setRefreshFunction }: { setRefreshFunction?: (fn: () => Promise<void>) => void }) {
  const { hasPermission, hasAnyPermission } = usePermission();
  const [searchQuery, setSearchQuery] = useState("")
  const [customerTypeFilter, setCustomerTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null)
  const [orderData, setOrderData] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const filteredOrders = orderData?.filter((order) => {
    const matchesSearch =
      order?._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order?.customerData?.name?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCustomerType = customerTypeFilter === "all" || order.customerType === customerTypeFilter

    const matchesStatus = statusFilter === "all" || order.paymentStatus === statusFilter

    return matchesSearch && matchesCustomerType && matchesStatus
  })

  const handleDeleteClick = (id: string) => {
    setOrderToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;
    try {
      setIsLoading(true);
      const res = await serverDeleteOrder(orderToDelete ?? '');
      if (res?.success) {
        setDeleteDialogOpen(false)
        setOrderToDelete(null)
        getOrderData();
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting order:", error)
      setIsLoading(false);
    }
  }

  const handlePrintInvoice = (id: string) => {
    // Open the invoice in a new tab for printing
    window.open(`/dashboard/orders/${id}/invoice?print=true`, "_blank")
  }

  const getOrderData = async () => {
    try {
      setIsLoading(true);
      const res = await serverGetOrder();
      setOrderData(res?.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("Error fetching order data:", error)
    }
  }

  useEffect(() => {
    if (setRefreshFunction) {
      setRefreshFunction(getOrderData);
    }
  }, [setRefreshFunction]);

  useEffect(() => {
    getOrderData();
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={customerTypeFilter} onValueChange={setCustomerTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Customer Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="wholesale">Wholesale</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Order Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {paymentStatuses?.map((item) => {
                return (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span>Loading Order...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) :
            filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order?._id}>
                  <TableCell className="font-medium">{order?._id}</TableCell>
                  <TableCell>{order?.customerData?.name}</TableCell>
                  <TableCell>
                    <Badge variant={order.customerType === "wholesale" ? "default" : "secondary"}>
                      {order.customerType === "wholesale" ? "Wholesale" : "Retail"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order?.createdAt
                      ? typeof order.createdAt === "string"
                        ? order.createdAt
                        : order.createdAt instanceof Date
                          ? order.createdAt.toLocaleDateString()
                          : ""
                      : ""}
                  </TableCell>
                  <TableCell>₹{order?.total}</TableCell>
                  <TableCell>
                    <Badge variant={order.paymentStatus === "paid" ? "default" : "destructive"} className="capitalize">{order?.paymentStatus}</Badge>
                  </TableCell>
                  <TableCell className="text-right">    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/orders/${order?._id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        {hasPermission(Permissions.UPDATE_ORDER) && (
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/orders/${order?._id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Order
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/orders/${order?._id}/invoice`}>
                            <FileText className="mr-2 h-4 w-4" />
                            View Invoice
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePrintInvoice(order?._id ?? '')}>
                          <Printer className="mr-2 h-4 w-4" />
                          Print Invoice
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {hasPermission(Permissions.DELETE_ORDER) && (
                          <DropdownMenuItem onClick={() => handleDeleteClick(order?._id ?? '')} className="text-destructive">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this order and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

