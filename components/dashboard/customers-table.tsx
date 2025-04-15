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
import { Edit, MoreHorizontal, Search, ShoppingBag, Trash, Loader2 } from "lucide-react"
import { serverDeleteCustomer, serverGetCustomers } from "@/services/serverApi"
import { set } from "date-fns"
import { ICustomer } from "@/types/customer"
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

export function CustomersTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [customerType, setCustomerType] = useState("all") // all, retail, wholesale
  const [loading, setLoading] = useState<boolean>(false)
  const [customers, setCustomers] = useState<ICustomer[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null)

  const filteredCustomers = customers?.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
      customer.number.toString().includes(searchQuery)

    const matchesType = customerType === "all" || customer.customerType === customerType

    return matchesSearch && matchesType
  })

  const getCustomerData = async () => {
    try {
      setLoading(true)
      const res = await serverGetCustomers();
      // console.log("Fetched customer data:", data)
      setCustomers(res?.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error("Error fetching customer data:", error)
    }
  }

  const handleDelete = (id: string) => {
    setCustomerToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    try {
      setLoading(true)
      const res = await serverDeleteCustomer(customerToDelete ?? '');
      if (res?.success) {
        setDeleteDialogOpen(false)
        setCustomerToDelete(null)
        getCustomerData();
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error("Error deleting customer:", error)    
    }
  }

  useEffect(() => {
    getCustomerData();
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={customerType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setCustomerType("all")}
          >
            All
          </Button>
          <Button
            variant={customerType === "retail" ? "default" : "outline"}
            size="sm"
            onClick={() => setCustomerType("retail")}
          >
            Retail
          </Button>
          <Button
            variant={customerType === "wholesale" ? "default" : "outline"}
            size="sm"
            onClick={() => setCustomerType("wholesale")}
          >
            Wholesale
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span>Loading customers...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer?._id?.toString()}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{customer?.name?.[0] + customer?.name?.[1]}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{customer.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={customer.customerType === "wholesale" ? "default" : "secondary"}>
                      {customer.customerType === "wholesale" ? "Wholesale" : "Retail"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{customer.number}</span>
                      <span className="text-xs text-muted-foreground">{customer.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      {'11'}
                    </div>
                  </TableCell>
                  <TableCell>{'12,000'}</TableCell>
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
                          <Link href={`/dashboard/customers/${customer._id?.toString()}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/customers/${customer._id?.toString()}/orders`}>
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            View Orders
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(customer?._id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No customers found.
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
              This will permanently delete this customer account. This action cannot be undone.
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

