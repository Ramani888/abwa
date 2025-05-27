"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash, Plus, Search, ArrowLeft } from "lucide-react"
import { serverAddOrder, serverGetCustomers, serverGetProduct } from "@/services/serverApi"
import { ICustomer } from "@/types/customer"
import { IProduct } from "@/types/product"

export default function NewOrderPage() {
  const [activeTab, setActiveTab] = useState("retail")
  const [orderItems, setOrderItems] = useState<
    Array<{
      id: string
      productId: string
      name: string
      price: number
      quantity: number
      gstRate: number | undefined
      gstAmount: number
      total: number
      size: string // <-- added
    }>
  >([])
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notes, setNotes] = useState("") // For optional notes/delivery instructions
  const [manualRoundOff, setManualRoundOff] = useState<number | "">(0) // Editable round-off
  const [customerData, setCustomerData] = useState<ICustomer[]>([])
  const [productData, setProductData] = useState<IProduct[]>([])
  const [paymentStatus, setPaymentStatus] = useState("paid") // Added paymentStatus state
  const router = useRouter()

  const filteredProducts = productData?.filter((product) => product?.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredCustomers = customerData?.filter(
    (customer) =>
      customer?.customerType === activeTab &&
      (customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) || String(customer?.number).includes(searchQuery)),
  )

  const getCustomerData = async () => {
    try {
      setIsLoading(true)
      const res = await serverGetCustomers()
      setCustomerData(res?.data)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      setCustomerData([]);
      console.error("Error fetching customer data:", error)
    }
  }

  const getProductData = async () => {
    try {
      setIsLoading(true)
      const res = await serverGetProduct();
      setProductData(res?.data);
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      setProductData([]);
      console.error("Error fetching product data:", error)
    }
  }

  useEffect(() => {
    getCustomerData();
    getProductData();
  }, [])

  // When selecting a product, set quantity to its current value if already in order
  const handleSelectProduct = (productId: string) => {
    setSelectedProduct(productId)
    const existing = orderItems.find((item) => item.productId === productId)
    setQuantity(existing ? existing.quantity : 1)
  }

  // Add or update product in order
  const handleAddItem = () => {
    if (!selectedProduct || quantity <= 0) return

    const product = productData?.find((p) => p?._id === selectedProduct)
    if (!product) return

    const price = activeTab === "wholesale" ? product.wholesalePrice : product?.retailPrice
    const gstRate = product?.taxRate ?? 0 // If undefined, treat as 0

    const existingIndex = orderItems.findIndex((item) => item.productId === product?._id)
    if (existingIndex !== -1) {
      // Replace quantity, gstAmount, and total for the existing item
      const updatedItems = [...orderItems]
      const gstAmount = ((price * quantity) * gstRate) / 100
      const total = price * quantity + gstAmount

      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity,
        gstRate: product?.taxRate,
        gstAmount,
        total,
        size: product?.packingSize, // <-- added
      }
      setOrderItems(updatedItems)
    } else {
      // Add as new item
      const gstAmount = ((price * quantity) * gstRate) / 100
      const total = price * quantity + gstAmount

      const newItem = {
        id: Date.now().toString(),
        productId: product._id as string,
        name: product.name,
        price,
        quantity,
        gstRate: product?.taxRate, // Keep original value (could be undefined)
        gstAmount,
        total,
        size: product.packingSize ? String(product.packingSize) : "", // ensure string
      }
      setOrderItems([...orderItems, newItem])
    }

    setSelectedProduct("")
    setQuantity(1)
  }

  const handleRemoveItem = (id: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== id))
  }

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const calculateTotalGST = () => {
    return orderItems.reduce((sum, item) => sum + item.gstAmount, 0)
  }

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.total, 0)
  }

  // Calculate round-off for total
  const calculateAutoRoundOff = () => {
    const total = calculateTotal()
    return Math.round(total) - total
  }

  // Set manualRoundOff to auto value when orderItems change and user hasn't edited it
  useEffect(() => {
    if (manualRoundOff === "" || manualRoundOff === 0) {
      const auto = calculateAutoRoundOff()
      setManualRoundOff(auto)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderItems])

  useEffect(() => {
    setSelectedCustomer("");
  }, [activeTab])

  const calculateFinalTotal = () => {
    const total = calculateTotal()
    const roundOff = manualRoundOff === "" ? 0 : Number(manualRoundOff)
    return total + roundOff
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const bodyData = {
      customerType: activeTab,
      customerId: selectedCustomer,
      subTotal: calculateSubtotal(),
      totalGst: calculateTotalGST(),
      roundOff: manualRoundOff,
      total: calculateFinalTotal(),
      paymentMethod,
      paymentStatus,
      notes,
      products: orderItems
    }

    try {
      setIsSubmitting(true)
      const res = await serverAddOrder(bodyData);
      if (res?.success) {
        router.push("/dashboard/orders")
      }
      setIsSubmitting(false)
    } catch (error) {
      console.error("Error creating order:", error)
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading Order Form...</p>
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
                        {filteredCustomers?.map((customer) => (
                          <SelectItem key={customer?._id} value={customer?._id}>
                            {customer?.name} - {customer?.number}
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
                        {filteredCustomers?.map((customer) => (
                          <SelectItem key={customer?._id} value={customer?._id}>
                            {customer?.name} - {customer?.number}
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
              <div className="mb-2 text-sm text-muted-foreground">
                Use <b>+/−</b> to quickly adjust quantity.
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                <div className="sm:col-span-6">
                  <Label htmlFor="product">Product</Label>
                  <Select value={selectedProduct} onValueChange={handleSelectProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredProducts.map((product) => (
                        <SelectItem key={product?._id ?? ""} value={product?._id ?? ""}>
                          {/* disabled={product.stock <= 0} */}
                          {product.name} - ₹{activeTab === "wholesale" ? product.wholesalePrice : product.retailPrice}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="sm:col-span-3">
                  <Label htmlFor="quantity">Quantity</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      tabIndex={-1}
                    >−</Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 0)}
                      className="w-20"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(q => q + 1)}
                      tabIndex={-1}
                    >+</Button>
                  </div>
                </div>

                <div className="sm:col-span-3 flex items-end">
                  <Button
                    type="button"
                    onClick={handleAddItem}
                    disabled={!selectedProduct || quantity <= 0}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {orderItems.some((item) => item.productId === selectedProduct) ? "Update Item" : "Add Item"}
                  </Button>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>GST %</TableHead>
                      <TableHead>GST Amount</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.length > 0 ? (
                      orderItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.size}</TableCell>
                          <TableCell>₹{item.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  const newQty = Math.max(1, item.quantity - 1)
                                  setOrderItems(orderItems.map(oi =>
                                    oi.productId === item.productId
                                      ? {
                                          ...oi,
                                          quantity: newQty,
                                          gstAmount: ((oi.price * newQty) * (oi.gstRate ?? 0)) / 100,
                                          total: oi.price * newQty + (((oi.price * newQty) * (oi.gstRate ?? 0)) / 100),
                                        }
                                      : oi
                                  ))
                                }}
                                tabIndex={-1}
                              >−</Button>
                              <Input
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={e => {
                                  const newQty = Number(e.target.value) || 1
                                  setOrderItems(orderItems.map(oi =>
                                    oi.productId === item.productId
                                      ? {
                                          ...oi,
                                          quantity: newQty,
                                          gstAmount: ((oi.price * newQty) * (oi.gstRate ?? 0)) / 100,
                                          total: oi.price * newQty + (((oi.price * newQty) * (oi.gstRate ?? 0)) / 100),
                                        }
                                      : oi
                                  ))
                                }}
                                className="w-16"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  const newQty = item.quantity + 1
                                  setOrderItems(orderItems.map(oi =>
                                    oi.productId === item.productId
                                      ? {
                                          ...oi,
                                          quantity: newQty,
                                          gstAmount: ((oi.price * newQty) * (oi.gstRate ?? 0)) / 100,
                                          total: oi.price * newQty + (((oi.price * newQty) * (oi.gstRate ?? 0)) / 100),
                                        }
                                      : oi
                                  ))
                                }}
                                tabIndex={-1}
                              >+</Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={0}
                              value={item.gstRate ?? ""}
                              onChange={e => {
                                const newGst = Number(e.target.value)
                                setOrderItems(orderItems.map(oi =>
                                  oi.productId === item.productId
                                    ? {
                                        ...oi,
                                        gstRate: isNaN(newGst) ? undefined : newGst,
                                        gstAmount: ((oi.price * oi.quantity) * (isNaN(newGst) ? 0 : newGst)) / 100,
                                        total: oi.price * oi.quantity + (((oi.price * oi.quantity) * (isNaN(newGst) ? 0 : newGst)) / 100),
                                      }
                                    : oi
                                ))
                              }}
                              className="w-16"
                              step="0.01"
                            />
                          </TableCell>
                          <TableCell>
                            {item.gstRate !== undefined && item.gstRate !== null ? `₹${item.gstAmount.toFixed(2)}` : <span className="text-muted-foreground">N/A</span>}
                          </TableCell>
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
                        <TableCell colSpan={8} className="h-24 text-center">
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
                  <span>Total GST:</span>
                  <span>₹{calculateTotalGST().toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 items-center">
                  <span>Round-off:</span>
                  <div className="flex flex-col ml-auto items-end">
                    <span className="mb-1 text-xs text-muted-foreground">
                      Auto round-off: {calculateAutoRoundOff().toFixed(2)}
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      className="w-24 text-right"
                      value={manualRoundOff}
                      onChange={e => {
                        const val = e.target.value;
                        setManualRoundOff(val === "" ? "" : Number(val));
                      }}
                      placeholder={calculateAutoRoundOff().toFixed(2)}
                    />
                  </div>
                </div>
                <div className="flex justify-between py-2 font-bold">
                  <span>Total (after round-off):</span>
                  <span>₹{calculateFinalTotal().toFixed(2)}</span>
                </div>
                <div className="mb-2 text-xs text-muted-foreground">
                  Round-off is editable. Leave blank for zero. Auto suggestion shown.
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

                <div className="space-y-2 mt-4">
                  <Label htmlFor="notes">Notes / Delivery Instructions (optional)</Label>
                  <Input
                    id="notes"
                    type="text"
                    placeholder="Add any notes or delivery instructions..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || orderItems.length === 0 || !selectedCustomer}>
                {isSubmitting ? "Creating..." : "Create Order"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}

