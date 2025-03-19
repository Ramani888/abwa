"use client"

import { useState } from "react"
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
import { Edit, MoreHorizontal, Search, ShoppingBag, Trash } from "lucide-react"

// Mock data for customers
const customers = [
  {
    id: "1",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 9876543210",
    type: "retail",
    orders: 12,
    spent: "₹15,200.00",
    initials: "RS",
  },
  {
    id: "2",
    name: "Priya Patel",
    email: "priya@example.com",
    phone: "+91 9876543211",
    type: "retail",
    orders: 8,
    spent: "₹9,800.00",
    initials: "PP",
  },
  {
    id: "3",
    name: "Amit Kumar Enterprises",
    email: "amit@example.com",
    phone: "+91 9876543212",
    type: "wholesale",
    orders: 25,
    spent: "₹1,24,500.00",
    initials: "AK",
  },
  {
    id: "4",
    name: "Neha Singh",
    email: "neha@example.com",
    phone: "+91 9876543213",
    type: "retail",
    orders: 15,
    spent: "₹22,300.00",
    initials: "NS",
  },
  {
    id: "5",
    name: "Vikram Reddy Distributors",
    email: "vikram@example.com",
    phone: "+91 9876543214",
    type: "wholesale",
    orders: 32,
    spent: "₹2,45,600.00",
    initials: "VR",
  },
]

export function CustomersTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [customerType, setCustomerType] = useState("all") // all, retail, wholesale

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)

    const matchesType = customerType === "all" || customer.type === customerType

    return matchesSearch && matchesType
  })

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
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{customer.initials}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{customer.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={customer.type === "wholesale" ? "default" : "secondary"}>
                      {customer.type === "wholesale" ? "Wholesale" : "Retail"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{customer.phone}</span>
                      <span className="text-xs text-muted-foreground">{customer.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      {customer.orders}
                    </div>
                  </TableCell>
                  <TableCell>{customer.spent}</TableCell>
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
                          <Link href={`/dashboard/customers/${customer.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/customers/${customer.id}/orders`}>
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            View Orders
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
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
    </div>
  )
}

