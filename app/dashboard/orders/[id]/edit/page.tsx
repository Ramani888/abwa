"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash, Plus, ArrowLeft } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

// Mock data for the order
const orderData = {
  id: "ORD-001",
  date: "2023-03-15",
  customerId: "1",
  customerType: "retail",
  items: [
    {
      id: "1",
      productId: "1",
      name: "Organic Fertilizer",
      price: 850,
      quantity: 2,
      total: 1700,
    },
    {
      id: "2",
      productId: "4",
      name: "Garden Tools Set",
      price: 800,
      quantity: 1,
      total: 800,
    },
  ],
  subtotal: 2500,
  tax: 125,
  total: 2625,
  status: "Completed",
  paymentStatus: "Paid",
  paymentMethod: "Cash",
  notes: "Customer requested delivery on Saturday morning.",
}

// Mock data for products
const products = [
  { id: "1", name: "Organic Fertilizer", price: 850, wholesalePrice: 750, stock: 120 },
  { id: "2", name: "Wheat Seeds (Premium)", price: 450, wholesalePrice: 400, stock: 85 },
  { id: "3", name: "Pesticide Spray", price: 350, wholesalePrice: 300, stock: 42 },
  { id: "4", name: "Garden Tools Set", price: 1200, wholesalePrice: 1050, stock: 18 },
  { id: "5", name: "Drip Irrigation Kit", price: 2500, wholesalePrice: 2200, stock: 0 },
]

// Mock data for customers
const customers = [
  { id: "1", name: "Rahul Sharma", type: "retail", phone: "+91 9876543210" },
  { id: "2", name: "Priya Patel", type: "retail", phone: "+91 9876543211" },
  { id: "3", name: "Amit Kumar Enterprises", type: "wholesale", phone: "+91 9876543212" },
  { id: "4", name: "Neha Singh", type: "retail", phone: "+91 9876543213" },
  { id: "5", name: "Vikram Reddy Distributors", type: "wholesale", phone: "+91 9876543214" },
]

export default function EditOrderPage({ params }: { params: { id: string } }) {
  const [orderItems, setOrderItems] = useState<
    Array<{
      id: string
      productId: string
      name: string
      price: number
      quantity: number
      total: number
    }>
  >([])
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [customerType, setCustomerType] = useState("retail")
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [paymentStatus, setPaymentStatus] = useState("paid")
  const [orderStatus, setOrderStatus] = useState("pending")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // In a real app, you would fetch the order data from an API
    // For now, we'll just use the mock data
    setOrderItems(orderData.items)
    setSelectedCustomer(orderData.customerId)
    setCustomerType(orderData.customerType)
    setPaymentMethod(orderData.paymentMethod.toLowerCase())
    setPaymentStatus(orderData.paymentStatus.toLowerCase())
    setOrderStatus(orderData.status.toLowerCase())
    setNotes(orderData.notes)
    setIsLoading(false)
  }, [params.id])

  const handleAddItem = () => {
    if (!selectedProduct || quantity <= 0) return

    const product = products.find((p) => p.id === selectedProduct)
    if (!product) return

    const price = customerType === "wholesale" ? product.wholesalePrice : product.price

    const newItem = {
      id: Date.now().toString(),
      productId: product.id,
      name: product.name,
      price,
      quantity,
      total: price * quantity,
    }

    setOrderItems([...orderItems, newItem])
    setSelectedProduct("")
    setQuantity(1)
  }

  const handleRemoveItem = (id: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== id))
  }

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + item.total, 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.05 // Assuming 5% tax
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Here you would implement actual order update logic
    // For now, we'll just simulate it
    setTimeout(() => {
      setIsSaving(false)
      router.push(`/dashboard/orders/${params.id}`)
    }, 1000)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading order data...</p>
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
        <h2 className="text-3xl font-bold tracking-tight">Edit Order #{params.id}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Customer Type</Label>
                  <RadioGroup value={customerType} onValueChange={setCustomerType} className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="retail" id="retail" />
                      <Label htmlFor="retail">Retail Customer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="wholesale" id="wholesale" />
                      <Label htmlFor="wholesale">Wholesale Customer</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer">Select Customer</Label>
                  <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers
                        .filter((customer) => customer.type === customerType)
                        .map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name} - {customer.phone}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 mb-4">
                <div className="sm:col-span-6">
                  <Label htmlFor="product">Product</Label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id} disabled={product.stock <= 0}>
                          {product.name} - ₹{customerType === "wholesale" ? product.wholesalePrice : product.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="sm:col-span-3">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="sm:col-span-3 flex items-end">
                  <Button
                    type="button"
                    onClick={handleAddItem}
                    disabled={!selectedProduct || quantity <= 0}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.length > 0 ? (
                      orderItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>₹{item.price.toFixed(2)}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>₹{item.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No items added to the order.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="orderStatus">Order Status</Label>
                  <Select value={orderStatus} onValueChange={setOrderStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentStatus">Payment Status</Label>
                  <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="credit">Credit (For Wholesale)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this order"
                  rows={3}
                />
              </div>

              <div className="flex justify-between py-2">
                <span>Subtotal:</span>
                <span>₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Tax (5%):</span>
                <span>₹{calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 font-bold">
                <span>Total:</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving || orderItems.length === 0 || !selectedCustomer}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}

