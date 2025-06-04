"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash, Plus, Search, ArrowLeft } from "lucide-react"
import { serverGetProduct, serverGetPurchaseOrder, serverGetSupplier, serverUpdatePurchaseOrder } from "@/services/serverApi"
import { IProduct } from "@/types/product"
import { ISupplier } from "@/types/supplier"

export default function EditPurchaseOrderPage({ params }: { params: { id: string } }) {
  const [orderItems, setOrderItems] = useState<
    Array<{
      id: string
      productId: string
      variantId: string
      name: string
      price: number
      mrp: number // <-- Added MRP
      unit: number
      carton: number
      quantity: number
      gstRate: number | undefined
      gstAmount: number
      total: number
      size: string
    }>
  >([])
  const [selectedSupplier, setSelectedSupplier] = useState("")
  const [selectedProduct, setSelectedProduct] = useState("")
  const [selectedVariant, setSelectedVariant] = useState("")
  const [unit, setUnit] = useState(1)
  const [carton, setCarton] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notes, setNotes] = useState("")
  const [manualRoundOff, setManualRoundOff] = useState<number | "">(0)
  const [supplierData, setSupplierData] = useState<ISupplier[]>([])
  const [productData, setProductData] = useState<IProduct[]>([])
  const [paymentStatus, setPaymentStatus] = useState("paid")
  const router = useRouter()

  // Fetch suppliers and products
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await serverGetPurchaseOrder();
        const orderData = res?.data?.find((order: any) => order?._id?.toString() === params?.id);

        if (orderData) {
          setSelectedSupplier(orderData?.supplierId || "")
          setPaymentMethod(orderData?.paymentMethod)
          setPaymentStatus(orderData?.paymentStatus)
          setNotes(orderData?.notes || "")
          setManualRoundOff(orderData?.roundOff ?? 0)
          setOrderItems(
            orderData?.products?.map((item: any) => {
              return {
                id: item?._id?.toString() || Date.now().toString(),
                productId: item?.productId,
                variantId: item?.variantId || "",
                name: item?.productData?.name + (item?.variantData?.packingSize ? " - " + item?.variantData?.packingSize : ""),
                price: item?.price,
                mrp: item?.mrp ?? item?.variantData?.mrp ?? 0, // <-- Add MRP here
                unit: item?.unit ?? 1,
                carton: item?.carton ?? 1,
                quantity: item?.quantity ?? ((item?.unit ?? 1) * (item?.carton ?? 1)),
                gstRate: item?.gstRate ?? 0,
                gstAmount: item?.gstAmount ?? 0,
                total: item?.total ?? 0,
                size: item?.variantData?.packingSize ? String(item?.variantData?.packingSize) : "",
              }
            })
          )
        }
      } catch (error) {
        setSupplierData([])
        setProductData([])
      }
      setIsLoading(false)
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const getSupplierData = async () => {
    try {
      setIsLoading(true)
      const res = await serverGetSupplier()
      setSupplierData(res?.data)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      setSupplierData([])
      console.error("Error fetching supplier data:", error)
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
    getSupplierData();
    getProductData();
  }, [])

  const filteredProducts = productData?.filter((product) =>
    product?.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredSuppliers = supplierData?.filter(
    (supplier) =>
      supplier?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(supplier?.number).includes(searchQuery)
  )

  // When selecting a product, reset variant and unit/carton
  const handleSelectProduct = (productId: string) => {
    setSelectedProduct(productId)
    setSelectedVariant("")
    setUnit(1)
    setCarton(1)
  }

  // Add or update product in order
  const handleAddItem = () => {
    if (!selectedProduct || !selectedVariant || unit <= 0 || carton <= 0) return

    const product = productData?.find((p) => p?._id === selectedProduct)
    if (!product) return

    const variant = product.variants?.find((v: any) => v._id === selectedVariant)
    if (!variant) return

    const quantity = unit * carton
    const price = variant.purchasePrice ?? 0
    const mrp = variant.mrp ?? 0 // <-- Add MRP
    const gstRate = variant.taxRate ?? 0

    const existingIndex = orderItems.findIndex(
      (item) => item.productId === product._id && item.variantId === variant._id
    )
    if (existingIndex !== -1) {
      // Update existing item
      const updatedItems = [...orderItems]
      const gstAmount = ((price * quantity) * gstRate) / 100
      const total = price * quantity + gstAmount

      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        unit,
        carton,
        quantity,
        gstRate: variant.taxRate,
        gstAmount,
        total,
        size: variant.packingSize ? String(variant.packingSize) : "",
        mrp, // <-- Add MRP
      }
      setOrderItems(updatedItems)
    } else {
      // Add as new item
      const gstAmount = ((price * quantity) * gstRate) / 100
      const total = price * quantity + gstAmount

      const newItem = {
        id: Date.now().toString(),
        productId: product._id as string,
        variantId: String(variant._id),
        name: product.name + " - " + (variant.packingSize || ""),
        price,
        mrp, // <-- Add MRP
        unit,
        carton,
        quantity,
        gstRate: variant.taxRate,
        gstAmount,
        total,
        size: variant.packingSize ? String(variant.packingSize) : "",
      }
      setOrderItems([...orderItems, newItem])
    }

    setSelectedProduct("")
    setSelectedVariant("")
    setUnit(1)
    setCarton(1)
  }

  const handleRemoveItem = (id: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== id))
  }

  // Update unit/carton for an item in the table
  const updateOrderItemUnitCarton = (id: string, newUnit: number, newCarton: number) => {
    setOrderItems(orderItems.map(item =>
      item.id === id
        ? {
            ...item,
            unit: newUnit,
            carton: newCarton,
            quantity: newUnit * newCarton,
            gstAmount: ((item.price * newUnit * newCarton) * (item.gstRate ?? 0)) / 100,
            total: item.price * newUnit * newCarton + (((item.price * newUnit * newCarton) * (item.gstRate ?? 0)) / 100),
          }
        : item
    ))
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

  const calculateFinalTotal = () => {
    const total = calculateTotal()
    const roundOff = manualRoundOff === "" ? 0 : Number(manualRoundOff)
    return total + roundOff
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const bodyData = {
      _id: params?.id,
      supplierId: selectedSupplier,
      subTotal: calculateSubtotal(),
      totalGst: calculateTotalGST(),
      roundOff: manualRoundOff,
      total: calculateFinalTotal(),
      paymentMethod,
      paymentStatus,
      notes,
      products: orderItems,
    }
    try {
      setIsSubmitting(true)
      const res = await serverUpdatePurchaseOrder(bodyData)
      if (res?.success) {
        router.push(`/dashboard/purchase-order`)
      }
      setIsSubmitting(false)
    } catch (error) {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading Purchase Order Data...</p>
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
        <h2 className="text-3xl font-bold tracking-tight">Edit Purchase Order #{params.id}</h2>
      </div>

      <div>
        <div className="grid gap-6 mb-6">  
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Select Supplier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search supplier..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSuppliers?.map((supplier) => (
                      <SelectItem key={supplier?._id ?? ""} value={supplier?._id ?? ""}>
                        {supplier?.name} - {supplier?.number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Add Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 text-sm text-muted-foreground">
                Use <b>+/−</b> to quickly adjust unit and carton.
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
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="sm:col-span-6">
                  <Label htmlFor="variant">Variant</Label>
                  <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a variant" />
                    </SelectTrigger>
                    <SelectContent>
                      {productData.find(p => p._id === selectedProduct)?.variants?.map((variant: any) => (
                        <SelectItem key={variant._id} value={variant._id}>
                          {variant.name || variant.packingSize} - ₹{variant.purchasePrice}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>


                <div className="sm:col-span-2">
                  <Label>Unit</Label>
                  <div className="flex items-center space-x-2">
                    <Button type="button" variant="outline" size="icon" onClick={() => setUnit(u => Math.max(1, u - 1))}>−</Button>
                    <Input type="number" min="1" value={unit} onChange={e => setUnit(Number(e.target.value) || 1)} className="w-16" />
                    <Button type="button" variant="outline" size="icon" onClick={() => setUnit(u => u + 1)}>+</Button>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <Label>Carton</Label>
                  <div className="flex items-center space-x-2">
                    <Button type="button" variant="outline" size="icon" onClick={() => setCarton(c => Math.max(1, c - 1))}>−</Button>
                    <Input type="number" min="1" value={carton} onChange={e => setCarton(Number(e.target.value) || 1)} className="w-16" />
                    <Button type="button" variant="outline" size="icon" onClick={() => setCarton(c => c + 1)}>+</Button>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <Label>Quantity</Label>
                  <Input type="number" value={unit * carton} readOnly className="w-20 bg-muted" />
                </div>

                <div className="sm:col-span-3 flex items-end">
                  <Button
                    type="button"
                    onClick={handleAddItem}
                    disabled={!selectedProduct || !selectedVariant || unit <= 0 || carton <= 0}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {orderItems.some((item) => item.productId === selectedProduct && item.variantId === selectedVariant) ? "Update Item" : "Add Item"}
                  </Button>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>MRP</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Carton</TableHead>
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
                          <TableCell>₹{item.mrp?.toFixed(2)}</TableCell>
                          <TableCell>₹{item.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => updateOrderItemUnitCarton(item.id, Math.max(1, item.unit - 1), item.carton)}
                                tabIndex={-1}
                              >−</Button>
                              <Input
                                type="number"
                                min={1}
                                value={item.unit}
                                onChange={e => {
                                  const newUnit = Number(e.target.value) || 1
                                  updateOrderItemUnitCarton(item.id, newUnit, item.carton)
                                }}
                                className="w-12"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => updateOrderItemUnitCarton(item.id, item.unit + 1, item.carton)}
                                tabIndex={-1}
                              >+</Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => updateOrderItemUnitCarton(item.id, item.unit, Math.max(1, item.carton - 1))}
                                tabIndex={-1}
                              >−</Button>
                              <Input
                                type="number"
                                min={1}
                                value={item.carton}
                                onChange={e => {
                                  const newCarton = Number(e.target.value) || 1
                                  updateOrderItemUnitCarton(item.id, item.unit, newCarton)
                                }}
                                className="w-12"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => updateOrderItemUnitCarton(item.id, item.unit, item.carton + 1)}
                                tabIndex={-1}
                              >+</Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.quantity}
                              readOnly
                              className="w-16 bg-muted"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={0}
                              value={item.gstRate ?? ""}
                              onChange={e => {
                                const newGst = Number(e.target.value)
                                setOrderItems(orderItems.map(oi =>
                                  oi.id === item.id
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
                        <TableCell colSpan={11} className="h-24 text-center">
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
                        const val = e.target.value
                        setManualRoundOff(val === "" ? "" : Number(val))
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
              <Button
                type="button"
                disabled={isSubmitting || orderItems.length === 0 || !selectedSupplier}
                onClick={handleSubmit}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

