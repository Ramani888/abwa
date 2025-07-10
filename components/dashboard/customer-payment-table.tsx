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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Edit, MoreHorizontal, Search, ShoppingBag, Trash, Loader2, Eye } from "lucide-react"
import { serverDeleteCustomerPayment, serverGetCustomerPayment } from "@/services/serverApi"
import { ICustomerPayment } from "@/types/customer"
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
import { formatCurrency } from "@/utils/helpers/general"

export function CustomerPaymentTable({ setRefreshFunction }: { setRefreshFunction?: (fn: () => Promise<void>) => void }) {
  const { hasPermission, hasAnyPermission } = usePermission();
  const [searchQuery, setSearchQuery] = useState("")
  const [customerType, setCustomerType] = useState("all") // all, retail, wholesale
  const [loading, setLoading] = useState<boolean>(false)
  const [customerPaymentData, setCustomerPaymentData] = useState<ICustomerPayment[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [customerPaymentToDelete, setCustomerPaymentToDelete] = useState<string | null>(null)

  const filteredCustomerPayment = customerPaymentData?.filter((item) => {
    const matchesSearch =
      item.customerData?.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = customerType === "all" || item.customerData?.customerType === customerType

    return matchesSearch && matchesType
  })

  const getCustomerPaymentData = async () => {
    try {
      setLoading(true)
      const res = await serverGetCustomerPayment();
      setCustomerPaymentData(res?.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error("Error fetching customer payment data:", error)
    }
  }

  const handleDelete = (id: string) => {
    setCustomerPaymentToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    try {
      setLoading(true)
      const res = await serverDeleteCustomerPayment(customerPaymentToDelete ?? '');
      if (res?.success) {
        setDeleteDialogOpen(false)
        setCustomerPaymentToDelete(null)
        getCustomerPaymentData();
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error("Error deleting customer payment:", error)
    }
  }

  useEffect(() => {
    if (setRefreshFunction) {
      setRefreshFunction(getCustomerPaymentData);
    }
  }, [setRefreshFunction]);

  useEffect(() => {
    getCustomerPaymentData();
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full max-w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-row flex-wrap gap-2 w-full sm:w-auto">
          <Button
            variant={customerType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setCustomerType("all")}
            className="flex-1 sm:flex-none"
          >
            All
          </Button>
          <Button
            variant={customerType === "retail" ? "default" : "outline"}
            size="sm"
            onClick={() => setCustomerType("retail")}
            className="flex-1 sm:flex-none"
          >
            Retail
          </Button>
          <Button
            variant={customerType === "wholesale" ? "default" : "outline"}
            size="sm"
            onClick={() => setCustomerType("wholesale")}
            className="flex-1 sm:flex-none"
          >
            Wholesale
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead>Customer Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Type</TableHead>
              <TableHead>Payment Mode</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span>Loading customer payments ...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCustomerPayment?.length > 0 ? (
              filteredCustomerPayment?.map((item) => (
                <TableRow key={item?._id?.toString()}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>
                          {(item?.customerData?.name?.[0] ?? "") + (item?.customerData?.name?.[1] ?? "")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{item?.customerData?.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{formatCurrency(item?.amount ?? 0)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {item?.paymentType ?? 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {item?.paymentMode ?? 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>{item?.captureDate ? new Date(item?.captureDate).toLocaleDateString() : 'N/A'}</TableCell>
                  {hasAnyPermission([Permissions.UPDATE_CUSTOMER_PAYMENT, Permissions.DELETE_CUSTOMER_PAYMENT]) && (
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
                          {hasPermission(Permissions.UPDATE_CUSTOMER_PAYMENT) && (
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/customer-payment/${item?._id?.toString()}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {hasPermission(Permissions.DELETE_CUSTOMER_PAYMENT) && (
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(item?._id)}>
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No customer payments found.
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
              This will permanently delete this customer payment. This action cannot be undone.
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

