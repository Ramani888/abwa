"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { serverAddProduct, serverGetCategory } from "@/services/serverApi"
import { ICategory } from "@/types/category"

export default function NewProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    description: "",
    sku: "",
    barcode: "",
    retailPrice: "",
    wholesalePrice: "",
    purchasePrice: "",
    quantity: "",
    minStockLevel: "",
    taxRate: "5",
    unit: "kg",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [categoryData, setCategoryData] = useState<ICategory[]>([])
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
    try {
      setIsLoading(true)
      const res = await serverAddProduct({...formData, retailPrice: Number(formData.retailPrice), wholesalePrice: Number(formData.wholesalePrice), purchasePrice: Number(formData.purchasePrice), quantity: Number(formData.quantity), minStockLevel: Number(formData.minStockLevel), taxRate: Number(formData.taxRate)});
      if (res?.success) {
        router.push("/dashboard/products")
      }
      setIsLoading(false)
    } catch (error) {
      console.error("Error creating product:", error)
      setIsLoading(false)
    }
  }

  const getCustomerData = async () => {
    try {
      setIsLoading(true)
      const res = await serverGetCategory();
      setCategoryData(res?.data)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error("Error fetching category data:", error)
    }
  }

  useEffect(() => {
    getCustomerData();
  }, [])

  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Add New Product</h2>
      </div>

      <Card className="w-full">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Add a new product to your inventory</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Organic Fertilizer"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData?.categoryId} onValueChange={(value) => handleSelectChange("categoryId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryData?.map((category) => (
                      <SelectItem key={category?._id} value={category?._id}>
                        {category?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select value={formData.unit} onValueChange={(value) => handleSelectChange("unit", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                    <SelectItem value="g">Gram (g)</SelectItem>
                    <SelectItem value="l">Liter (L)</SelectItem>
                    <SelectItem value="ml">Milliliter (ml)</SelectItem>
                    <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                    <SelectItem value="bag">Bag</SelectItem>
                    <SelectItem value="box">Box</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Product description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" name="sku" placeholder="FERT-ORG-001" value={formData.sku} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  name="barcode"
                  placeholder="8901234567890"
                  value={formData.barcode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="retailPrice">Retail Price (₹)</Label>
                <Input
                  id="retailPrice"
                  name="retailPrice"
                  type="number"
                  placeholder="850"
                  value={formData.retailPrice}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wholesalePrice">Wholesale Price (₹)</Label>
                <Input
                  id="wholesalePrice"
                  name="wholesalePrice"
                  type="number"
                  placeholder="750"
                  value={formData.wholesalePrice}
                  onChange={handleChange}
                  required
                />
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="quantity">Stock Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  placeholder="100"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minStockLevel">Min Stock Level</Label>
                <Input
                  id="minStockLevel"
                  name="minStockLevel"
                  type="number"
                  placeholder="10"
                  value={formData.minStockLevel}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Select value={formData.taxRate} onValueChange={(value) => handleSelectChange("taxRate", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tax rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0%</SelectItem>
                    <SelectItem value="5">5%</SelectItem>
                    <SelectItem value="12">12%</SelectItem>
                    <SelectItem value="18">18%</SelectItem>
                    <SelectItem value="28">28%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Product"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

