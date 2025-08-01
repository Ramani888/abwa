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
import { Trash, Plus, Search, ArrowLeft, Calendar } from "lucide-react"
import { serverAddCustomerPayment, serverAddOrder, serverGetCustomers, serverGetProduct } from "@/services/serverApi"
import { ICustomer } from "@/types/customer"
import { IProduct } from "@/types/product"
import { paymentMethods, paymentStatuses } from "@/utils/consts/product"
import { getOrders } from "@/lib/features/orderSlice"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/lib/store"
import { formatCurrency } from "@/utils/helpers/general"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PaymentStatus, PaymentType } from "@/utils/consts/order"
import { getPaymentType } from "@/utils/helpers/order"

export default function NewOrderPage() {
  const dispatch = useDispatch<AppDispatch>()
  const [activeTab, setActiveTab] = useState("retail")
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
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [selectedProduct, setSelectedProduct] = useState("")
  const [selectedVariant, setSelectedVariant] = useState("")
  const [unit, setUnit] = useState(1)
  const [carton, setCarton] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notes, setNotes] = useState("")
  const [manualRoundOff, setManualRoundOff] = useState<number | "">(0)
  const [customerData, setCustomerData] = useState<ICustomer[]>([])
  const [productData, setProductData] = useState<IProduct[]>([])
  const [paymentStatus, setPaymentStatus] = useState("paid")
  const [captureDate, setCaptureDate] = useState(new Date().toISOString().slice(0, 10)) // <-- Add state for captureDate
  const [cardNumber, setCardNumber] = useState("")
  const [upiTransactionId, setUpiTransactionId] = useState("")
  const [bankReferenceNumber, setBankReferenceNumber] = useState("")
  const [chequeNumber, setChequeNumber] = useState("")
  const [gatewayTransactionId, setGatewayTransactionId] = useState("")
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

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
      setCustomerData([])
      console.error("Error fetching customer data:", error)
    }
  }

  const getProductData = async () => {
    try {
      setIsLoading(true)
      const res = await serverGetProduct()
      setProductData(res?.data)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      setProductData([])
      console.error("Error fetching product data:", error)
    }
  }

  useEffect(() => {
    getCustomerData()
    getProductData()
  }, [])

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
    const price = activeTab === "wholesale" ? variant.wholesalePrice : variant.retailPrice
    const gstRate = variant.taxRate ?? 0
    const mrp = variant.mrp ?? 0 // <-- Get MRP

    const existingIndex = orderItems.findIndex((item) => item.productId === product._id && item.variantId === variant._id)
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
    setSelectedCustomer("")
  }, [activeTab])

  const calculateFinalTotal = () => {
    const total = calculateTotal()
    const roundOff = manualRoundOff === "" ? 0 : Number(manualRoundOff)
    return total + roundOff
  }

  // Remove form event, just a plain function
  const handleSubmit = async () => {
    const bodyData: any = {
      customerType: activeTab,
      customerId: selectedCustomer,
      subTotal: calculateSubtotal(),
      totalGst: calculateTotalGST(),
      roundOff: manualRoundOff,
      total: calculateFinalTotal(),
      paymentMethod,
      paymentStatus,
      notes,
      captureDate,
      products: orderItems,
    }

    const paymentData: {
      customerId: string;
      amount: number;
      paymentType: string;
      paymentMode: string;
      captureDate: Date;
      [key: string]: any; // Allow dynamic keys
    } = {
      customerId: selectedCustomer,
      // amount is gone only number with round off
      amount: Number(calculateFinalTotal()),
      paymentType: getPaymentType(paymentStatus),
      paymentMode: paymentMethod,
      captureDate: new Date(captureDate)
    }

    const selectedMethod = paymentMethods.find(pm => pm.value === paymentMethod);
    if (selectedMethod && selectedMethod.extraFieldName) {
      const fieldValueMap: Record<string, string> = {
        cardNumber,
        upiTransactionId,
        bankReferenceNumber,
        chequeNumber,
        gatewayTransactionId,
      };
      bodyData[selectedMethod.extraFieldName] = fieldValueMap[selectedMethod.extraFieldName];
      paymentData[selectedMethod.extraFieldName] = fieldValueMap[selectedMethod.extraFieldName];
    }

    try {
      setIsSubmitting(true)
      const res = await serverAddOrder(bodyData)
      if (res?.success) {
        if (paymentStatus !== PaymentStatus?.Unpaid) {
          await serverAddCustomerPayment({...paymentData, refOrderId: res?.data?._id?.toString()});
        }
        router.push("/dashboard/orders")
      }
      dispatch(getOrders())
      setIsSubmitting(false)
    } catch (error) {
      console.error("Error creating order:", error)
      setIsSubmitting(false)
    }
  }

  // When payment status changes, clear payment method if unpaid
  useEffect(() => {
    if (paymentStatus === "unpaid") {
      setPaymentMethod("");
    }
  }, [paymentStatus]);

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
    <main className="w-full px-2 sm:px-0">
      <header className="flex items-center mb-4 sm:mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="mr-3 sm:mr-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Create New Order</h2>
      </header>

      <section className="space-y-4 sm:space-y-6 mb-4 sm:mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="retail">Retail Customer</TabsTrigger>
            <TabsTrigger value="wholesale">Wholesale Customer</TabsTrigger>
          </TabsList>
          <TabsContent value="retail" className="mt-3 sm:mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Select Retail Customer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search customers..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={selectedCustomer}
                  onValueChange={(val) => {
                    if (val === "__add_new__") {
                      router.push("/dashboard/customers/new");
                    } else {
                      setSelectedCustomer(val);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCustomers?.map((customer) => (
                      <SelectItem key={customer?._id} value={customer?._id}>
                        {customer?.name} - {customer?.number}
                      </SelectItem>
                    ))}
                    <SelectItem value="__add_new__" className="text-primary font-semibold">
                      + Add New Customer
                    </SelectItem>
                    {filteredCustomers?.length === 0 && (
                      <SelectItem value="-1" disabled>
                        No customers found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="wholesale" className="mt-3 sm:mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Select Wholesale Customer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
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
                    {filteredCustomers?.length === 0 && (
                      <SelectItem value="-1" disabled>
                        No customers found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Add Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-sm text-muted-foreground">
              Use <b>+/−</b> to quickly adjust unit and carton.
            </p>
            <form
              className="grid grid-cols-1 gap-3 sm:grid-cols-12"
              onSubmit={e => {
                e.preventDefault()
                handleAddItem()
              }}
            >
              <div className="col-span-1 sm:col-span-6">
                <Label htmlFor="product">Product</Label>
                <Select
                  value={selectedProduct}
                  onValueChange={(val) => {
                    if (val === "__add_new_product__") {
                      router.push("/dashboard/products/new");
                    } else {
                      handleSelectProduct(val);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {productData?.map((product) => (
                      <SelectItem key={product?._id ?? ""} value={product?._id ?? ""}>
                        {product.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="__add_new_product__" className="text-primary font-semibold">
                      + Add New Product
                    </SelectItem>
                    {productData?.length === 0 && (
                      <SelectItem value="-1" disabled>
                        No products found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1 sm:col-span-6">
                <Label htmlFor="variant">Variant</Label>
                <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {productData.find(p => p._id === selectedProduct)?.variants?.map((variant: any) => (
                      <SelectItem key={variant._id} value={variant._id}>
                        {variant.name || variant.packingSize} - ₹{activeTab === "wholesale" ? variant.wholesalePrice : variant.retailPrice}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col xs:flex-row gap-2 col-span-1 sm:col-span-2">
                <Label className="xs:w-16">Unit</Label>
                <div className="flex w-full xs:w-auto items-center gap-2">
                  <Button type="button" variant="outline" size="icon" onClick={() => setUnit(u => Math.max(1, u - 1))}>−</Button>
                  <Input type="number" min="1" value={unit} onChange={e => setUnit(Number(e.target.value) || 1)} className="w-full xs:w-16" />
                  <Button type="button" variant="outline" size="icon" onClick={() => setUnit(u => u + 1)}>+</Button>
                </div>
              </div>
              <div className="flex flex-col xs:flex-row gap-2 col-span-1 sm:col-span-2">
                <Label className="xs:w-16">Carton</Label>
                <div className="flex w-full xs:w-auto items-center gap-2">
                  <Button type="button" variant="outline" size="icon" onClick={() => setCarton(c => Math.max(1, c - 1))}>−</Button>
                  <Input type="number" min="1" value={carton} onChange={e => setCarton(Number(e.target.value) || 1)} className="w-full xs:w-16" />
                  <Button type="button" variant="outline" size="icon" onClick={() => setCarton(c => c + 1)}>+</Button>
                </div>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <Label>Quantity</Label>
                <Input type="number" value={unit * carton} readOnly className="w-full bg-muted" />
              </div>
              <div className="col-span-1 sm:col-span-3 flex items-end">
                <Button
                  type="submit"
                  disabled={!selectedProduct || !selectedVariant || unit <= 0 || carton <= 0}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {orderItems.some((item) => item.productId === selectedProduct && item.variantId === selectedVariant) ? "Update Item" : "Add Item"}
                </Button>
              </div>
            </form>

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
                        <TableCell>{formatCurrency(item.mrp)}</TableCell>
                        <TableCell>{formatCurrency(item.price)}</TableCell>
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
                          {item.gstRate !== undefined && item.gstRate !== null ? formatCurrency(item.gstAmount) : <span className="text-muted-foreground">N/A</span>}
                        </TableCell>
                        <TableCell>{formatCurrency(item.total)}</TableCell>
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

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between py-2">
                <span>Subtotal:</span>
                <span>{formatCurrency(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Total GST:</span>
                <span>{formatCurrency(calculateTotalGST())}</span>
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
                <span>{formatCurrency(calculateFinalTotal())}</span>
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
                      {paymentStatuses?.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    disabled={paymentStatus === "unpaid"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods?.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(() => {
                const selectedMethod = paymentMethods.find(pm => pm.value === paymentMethod);
                if (selectedMethod && selectedMethod.extraFieldName) {
                  // Map field name to state/setter
                  const fieldMap: Record<string, [string, React.Dispatch<React.SetStateAction<string>>]> = {
                    cardNumber: [cardNumber, setCardNumber],
                    upiTransactionId: [upiTransactionId, setUpiTransactionId],
                    bankReferenceNumber: [bankReferenceNumber, setBankReferenceNumber],
                    chequeNumber: [chequeNumber, setChequeNumber],
                    gatewayTransactionId: [gatewayTransactionId, setGatewayTransactionId],
                  };
                  const [fieldValue, setFieldValue] = fieldMap[selectedMethod.extraFieldName] || ["", () => {}];
                  return (
                    <div className="space-y-2">
                      <Label htmlFor={selectedMethod.extraFieldName}>
                        {selectedMethod.extraFieldLabel}
                      </Label>
                      <Input
                        id={selectedMethod.extraFieldName}
                        type="text"
                        placeholder={selectedMethod.extraFieldLabel || ""}
                        value={fieldValue}
                        onChange={e => setFieldValue(e.target.value)}
                      />
                    </div>
                  );
                }
                return null;
              })()}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes / Delivery Instructions (optional)</Label>
                  <Input
                    id="notes"
                    type="text"
                    placeholder="Add any notes or delivery instructions..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>

                {/* --- Move date input here, below notes --- */}
                <div className="space-y-2">
                  <Label htmlFor="captureDate">Order Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="captureDate"
                      name="captureDate"
                      type="date"
                      className="pl-8"
                      value={captureDate}
                      onChange={e => setCaptureDate(e.target.value)}
                    />
                  </div>
                </div>
                {/* --- End date input --- */}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isSubmitting || orderItems.length === 0 || !selectedCustomer}
              onClick={() => setShowConfirm(true)}
            >
              {isSubmitting ? "Creating..." : "Create Order"}
            </Button>
          </CardFooter>
        </Card>
      </section>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Order Submission</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to create this order?</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                setShowConfirm(false);
                await handleSubmit();
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Yes, Create Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}

