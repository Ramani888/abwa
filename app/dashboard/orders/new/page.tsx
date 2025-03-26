"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash, Plus, Search, ArrowLeft } from "lucide-react"

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

export default function NewOrderPage() {
  const [activeTab, setActiveTab] = useState("retail")
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
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.type === activeTab &&
      (customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || customer.phone.includes(searchQuery)),
  )

  const handleAddItem = () => {
    if (!selectedProduct || quantity <= 0) return

    const product = products.find((p) => p.id === selectedProduct)
    if (!product) return

    const price = activeTab === "wholesale" ? product.wholesalePrice : product.price

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
    setIsLoading(true)

    // Here you would implement actual order creation logic
    // For now, we'll just simulate it
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard/orders")
    }, 1000)
  }

  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Create New Order</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="retail">Retail Customer</TabsTrigger>
              <TabsTrigger value="wholesale">Wholesale Customer</TabsTrigger>
            </TabsList>
            <TabsContent value="retail" className="space-y-4 mt-4">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Select Retail Customer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search customers..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredCustomers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name} - {customer.phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="wholesale" className="space-y-4 mt-4">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Select Wholesale Customer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search wholesale customers..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a wholesale customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredCustomers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name} - {customer.phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Add Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                <div className="sm:col-span-6">
                  <Label htmlFor="product">Product</Label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id} disabled={product.stock <= 0}>
                          {product.name} - ₹{activeTab === "wholesale" ? product.wholesalePrice : product.price}
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

              <div className="mt-6 overflow-x-auto">
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
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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

                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash">Cash</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi">UPI</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card">Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit" id="credit" />
                      <Label htmlFor="credit">Credit (For Wholesale)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || orderItems.length === 0 || !selectedCustomer}>
                {isLoading ? "Creating..." : "Create Order"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}

