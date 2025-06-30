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
import { Edit, Eye, Loader2, MoreHorizontal, Search, ShoppingBag, Trash } from "lucide-react"
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
import { serverDeleteSupplier, serverGetSupplier } from "@/services/serverApi"
import { usePermission } from "@/hooks/usePermission"
import { Permissions } from "@/utils/consts/permission"
import { ISupplier } from "@/types/supplier"

export function SuppliersTable({ setRefreshFunction }: { setRefreshFunction?: (fn: () => Promise<void>) => void }) {
  const { hasPermission, hasAnyPermission } = usePermission();
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false);
  const [supplierData, setSupplierData] = useState<ISupplier[]>([])

  const filteredSuppliers = supplierData?.filter((supplier) => {
    const name = supplier?.name?.toLowerCase() || '';
    const number = supplier?.number?.toLowerCase() || '';
    const query = searchQuery?.toLowerCase() || '';
  
    return name.includes(query) || number.includes(query);
  }); 

  const handleDeleteClick = (id: string) => {
    setSupplierToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!supplierToDelete) return;
    try {
      setLoading(true);
      const res = await serverDeleteSupplier(supplierToDelete ?? '');
      if (res?.success) {
        setDeleteDialogOpen(false)
        setSupplierToDelete(null)
        getSupplierData();
      }
    } catch (error) {
      console.error("Error deleting supplier:", error)
      setLoading(false);
    }
  }

  const getSupplierData = async () => {
    try {
      setLoading(true)
      const res = await serverGetSupplier();
      setSupplierData(res?.data)
      setLoading(false)
    } catch (error) {
      setSupplierData([])
      setLoading(false)
      console.error("Error fetching supplier data:", error)
    }
  }

  useEffect(() => {
    if (setRefreshFunction) {
      setRefreshFunction(getSupplierData);
    }
  }, [setRefreshFunction]);

  useEffect(() => {
    getSupplierData();
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full max-w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search here..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto bg-white">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>GST Number</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span>Loading Supplier...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : 
            filteredSuppliers?.length > 0 ? (
              filteredSuppliers?.map((supplier) => (
                <TableRow key={supplier?._id}>
                  <TableCell className="font-medium">{supplier?.name}</TableCell>
                  <TableCell>{supplier?.number}</TableCell>
                  <TableCell>{supplier?.email ?? 'N/A'}</TableCell>
                  <TableCell>{supplier?.gstNumber ?? 'N/A'}</TableCell>
                  <TableCell>{supplier?.address ?? 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      {supplier?.totalOrder ?? 0}
                    </div>
                  </TableCell>
                  <TableCell>₹{supplier?.totalSpent?.toFixed(2) ?? '0.00'}</TableCell>
                  {hasAnyPermission([Permissions.UPDATE_SUPPLIER, Permissions.DELETE_SUPPLIER]) && (
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
                            <Link href={`/dashboard/suppliers/${supplier?._id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          {hasPermission(Permissions.UPDATE_SUPPLIER) && (
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/suppliers/${supplier?._id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/suppliers/${supplier?._id?.toString()}/orders`}>
                              <ShoppingBag className="mr-2 h-4 w-4" />
                              View Orders
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {hasPermission(Permissions.DELETE_SUPPLIER) && (
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(supplier?._id ?? '')}>
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
                <TableCell colSpan={10} className="h-24 text-center">
                  No suppliers found.
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
              This will permanently delete this supplier. This action cannot be
              undone.
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

