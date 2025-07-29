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
import { Edit, MoreHorizontal, Search, Trash, Loader2 } from "lucide-react"
import { serverDeleteSupplierPayment, serverGetSupplierPayment } from "@/services/serverApi"
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
import { ISupplierPayment } from "@/types/supplier"
import { formatCurrency } from "@/utils/helpers/general"

export function SupplierPaymentTable({ setRefreshFunction }: { setRefreshFunction?: (fn: () => Promise<void>) => void }) {
  const { hasPermission, hasAnyPermission } = usePermission();
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState<boolean>(false)
  const [supplierPaymentData, setSupplierPaymentData] = useState<ISupplierPayment[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [supplierPaymentToDelete, setSupplierPaymentToDelete] = useState<string | null>(null)

  const filteredSupplierPayment = supplierPaymentData?.filter((item) => {
    const matchesSearch =
      item?.supplierData?.name?.toLowerCase()?.includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const getSupplierPaymentData = async () => {
    try {
      setLoading(true)
      const res = await serverGetSupplierPayment();
      setSupplierPaymentData(res?.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error("Error fetching supplier payment data:", error)
    }
  }

  const handleDelete = (id: string) => {
    setSupplierPaymentToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    try {
      setLoading(true)
      const res = await serverDeleteSupplierPayment(supplierPaymentToDelete ?? '');
      if (res?.success) {
        setDeleteDialogOpen(false)
        setSupplierPaymentToDelete(null)
        getSupplierPaymentData();
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error("Error deleting supplier payment:", error)
    }
  }

  useEffect(() => {
    if (setRefreshFunction) {
      setRefreshFunction(getSupplierPaymentData);
    }
  }, [setRefreshFunction]);

  useEffect(() => {
    getSupplierPaymentData();
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
        <div className="relative flex-1 w-full max-w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search suppliers..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead>Supplier Name</TableHead>
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
                    <span>Loading supplier payments ...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredSupplierPayment?.length > 0 ? (
              filteredSupplierPayment?.map((item) => (
                <TableRow key={item?._id?.toString()}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>
                          {(item?.supplierData?.name?.[0] ?? "") + (item?.supplierData?.name?.[1] ?? "")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{item?.supplierData?.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{formatCurrency(Number(item?.amount))}</span>
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
                  {hasAnyPermission([Permissions.UPDATE_SUPPLIER_PAYMENT, Permissions.DELETE_SUPPLIER_PAYMENT]) && (
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
                          {hasPermission(Permissions.UPDATE_SUPPLIER_PAYMENT) && (
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/supplier-payment/${item?._id?.toString()}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                          )}
                          {hasPermission(Permissions.DELETE_SUPPLIER_PAYMENT) && !item?.refOrderId && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(item?._id)}>
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </>
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
                  No supplier payments found.
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
              This will permanently delete this supplier payment. This action cannot be undone.
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

