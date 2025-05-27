"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Formik, Field, Form, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Tag, Barcode, DollarSign, Layers, Box, Percent, List } from "lucide-react"
import { serverAddProduct, serverGetActiveCategory } from "@/services/serverApi"
import { ICategory } from "@/types/category"

export default function NewProductPage() {
  const [categoryData, setCategoryData] = useState<ICategory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const getCustomerData = async () => {
    try {
      setIsLoading(true)
      const res = await serverGetActiveCategory()
      setCategoryData(res?.data)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error("Error fetching category data:", error)
    }
  }

  useEffect(() => {
    getCustomerData()
  }, [])

  const validationSchema = Yup.object({
    name: Yup.string().required("Product name is required"),
    categoryId: Yup.string().required("Category is required"),
    description: Yup.string().required("Description is required"),
    sku: Yup.string().required("SKU is required"),
    barcode: Yup.string().required("Barcode is required"),
    retailPrice: Yup.number().required("Retail price is required").positive("Must be positive"),
    wholesalePrice: Yup.number().required("Wholesale price is required").positive("Must be positive"),
    purchasePrice: Yup.number().required("Purchase price is required").positive("Must be positive"),
    quantity: Yup.number().required("Quantity is required").min(1, "Must be at least 1"),
    minStockLevel: Yup.number().required("Minimum stock level is required").min(0, "Cannot be negative"),
    taxRate: Yup.string().required("Tax rate is required"),
    unit: Yup.string().required("Unit is required"),
    packingSize: Yup.string().required("Packing size is required"), // <-- Add this line
  })

  const handleSubmit = async (values: any, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      const res = await serverAddProduct({
        ...values,
        retailPrice: Number(values.retailPrice),
        wholesalePrice: Number(values.wholesalePrice),
        purchasePrice: Number(values.purchasePrice),
        quantity: Number(values.quantity),
        minStockLevel: Number(values.minStockLevel),
        taxRate: Number(values.taxRate),
        packingSize: values.packingSize, // <-- Add this line
      })
      if (res?.success) {
        router.push("/dashboard/products")
      }
      setSubmitting(false)
    } catch (error) {
      console.error("Error creating product:", error)
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Add New Product</h2>
      </div>

      <Card className="w-full">
        <Formik
          initialValues={{
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
            packingSize: "", // <-- Add this line
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Add a new product to your inventory</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Field
                      as={Input}
                      id="name"
                      name="name"
                      placeholder="Organic Fertilizer"
                      className="pl-10"
                    />
                  </div>
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Category</Label>
                    <div className="relative">
                      <List className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Select
                        value={values.categoryId}
                        onValueChange={(value) => setFieldValue("categoryId", value)}
                      >
                        <SelectTrigger className="pl-10">
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
                    <ErrorMessage name="categoryId" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <div className="relative">
                      <Box className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Select
                        value={values.unit}
                        onValueChange={(value) => setFieldValue("unit", value)}
                      >
                        <SelectTrigger className="pl-10">
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
                    <ErrorMessage name="unit" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>

                {/* Packing Size Field */}
                <div className="space-y-2">
                  <Label htmlFor="packingSize">Packing Size</Label>
                  <div className="relative">
                    <Box className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Field
                      as={Input}
                      id="packingSize"
                      name="packingSize"
                      placeholder="e.g. 5kg, 10L, 1 box"
                      className="pl-10"
                    />
                  </div>
                  <ErrorMessage name="packingSize" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <div className="relative">
                    <Field
                      as={Textarea}
                      id="description"
                      name="description"
                      placeholder="Product description"
                      rows={3}
                      className="pl-10"
                    />
                    <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  </div>
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <div className="relative">
                      <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Field
                        as={Input}
                        id="sku"
                        name="sku"
                        placeholder="FERT-ORG-001"
                        className="pl-10"
                      />
                    </div>
                    <ErrorMessage name="sku" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="barcode">Barcode</Label>
                    <div className="relative">
                      <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Field
                        as={Input}
                        id="barcode"
                        name="barcode"
                        placeholder="8901234567890"
                        className="pl-10"
                      />
                    </div>
                    <ErrorMessage name="barcode" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="retailPrice">Retail Price (₹)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Field
                        as={Input}
                        id="retailPrice"
                        name="retailPrice"
                        type="number"
                        placeholder="850"
                        className="pl-10"
                      />
                    </div>
                    <ErrorMessage name="retailPrice" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wholesalePrice">Wholesale Price (₹)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Field
                        as={Input}
                        id="wholesalePrice"
                        name="wholesalePrice"
                        type="number"
                        placeholder="750"
                        className="pl-10"
                      />
                    </div>
                    <ErrorMessage name="wholesalePrice" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purchasePrice">Purchase Price (₹)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Field
                        as={Input}
                        id="purchasePrice"
                        name="purchasePrice"
                        type="number"
                        placeholder="650"
                        className="pl-10"
                      />
                    </div>
                    <ErrorMessage name="purchasePrice" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Stock Quantity</Label>
                    <div className="relative">
                      <Box className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Field
                        as={Input}
                        id="quantity"
                        name="quantity"
                        type="number"
                        placeholder="100"
                        className="pl-10"
                      />
                    </div>
                    <ErrorMessage name="quantity" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minStockLevel">Min Stock Level</Label>
                    <div className="relative">
                      <Box className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Field
                        as={Input}
                        id="minStockLevel"
                        name="minStockLevel"
                        type="number"
                        placeholder="10"
                        className="pl-10"
                      />
                    </div>
                    <ErrorMessage name="minStockLevel" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Select
                        value={values.taxRate}
                        onValueChange={(value) => setFieldValue("taxRate", value)}
                      >
                        <SelectTrigger className="pl-10">
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
                    <ErrorMessage name="taxRate" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>

                {/* ...rest of your fields... */}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {/* {isLoading ? "Adding..." : "Add Product"} */}
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding....</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Add Category</span>
                    </div>
                  )}
                </Button>
              </CardFooter>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  )
}

