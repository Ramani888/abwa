"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"

// Mock data for products
const products = [
  { id: "1", name: "Organic Fertilizer", stock: 120, unit: "kg" },
  { id: "2", name: "Wheat Seeds (Premium)", stock: 85, unit: "kg" },
  { id: "3", name: "Pesticide Spray", stock: 42, unit: "l" },
  { id: "4", name: "Garden Tools Set", stock: 18, unit: "pcs" },
  { id: "5", name: "Drip Irrigation Kit", stock: 0, unit: "set" },
]

export default function StockInPage() {
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    purchasePrice: "",
    supplier: "",
    invoiceNumber: "",
    notes: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Here you would implement actual stock in logic
    // For now, we'll just simulate it
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard/stock")
    }, 1000)
  }

  const selectedProduct = products.find((p) => p.id === formData.productId)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Stock In</h2>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Add Stock</CardTitle>
            <CardDescription>Add new stock to your inventory</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productId">Product</Label>
              <Select value={formData.productId} onValueChange={(value) => handleSelectChange("productId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} (Current: {product.stock} {product.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <div className="flex items-center">
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    placeholder="10"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                  />
                  {selectedProduct && <span className="ml-2">{selectedProduct.unit}</span>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Purchase Price (₹)</Label>
                <Input
                  id="purchasePrice"
                  name="purchasePrice"
                  type="number"
                  placeholder="650"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  name="supplier"
                  placeholder="Supplier name"
                  value={formData.supplier}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  name="invoiceNumber"
                  placeholder="INV-12345"
                  value={formData.invoiceNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Additional notes about this stock entry"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.productId || !formData.quantity}>
              {isLoading ? "Processing..." : "Add Stock"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

