"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Formik, Field, Form, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Barcode, Box, Boxes, Calendar, Delete, Edit, FileText, IndianRupee, Layers, List, Package, Percent, Tag } from "lucide-react"
import { serverGetActiveCategory, serverGetProduct, serverUpdateProduct } from "@/services/serverApi"
import { ICategory } from "@/types/category"
import { IProduct } from "@/types/product"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { units, packingSizesByUnit } from "@/utils/consts/product"
import { getProducts } from "@/lib/features/productSlice"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/lib/store"
import { formatCurrency, formatIndianNumber } from "@/utils/helpers/general"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

const newVariantSchema = Yup.object({
  packingSize: Yup.string().required("Packing size is required"),
  sku: Yup.string().required("SKU is required"),
  barcode: Yup.string().required("Barcode is required"),
  unit: Yup.string().required("Unit is required"),
  mrp: Yup.number()
    .typeError("MRP must be a number")
    .required("MRP is required")
    .positive("Must be positive")
    .test(
      "mrp-greater",
      "MRP must be greater than Retail, Wholesale, and Purchase Price",
      function (value) {
        const { retailPrice, wholesalePrice, purchasePrice } = this.parent;
        if (
          value === undefined ||
          retailPrice === undefined ||
          wholesalePrice === undefined ||
          purchasePrice === undefined
        )
          return true;
        return (
          value > Number(retailPrice) &&
          value > Number(wholesalePrice) &&
          value > Number(purchasePrice)
        );
      }
    ),
  retailPrice: Yup.number()
    .typeError("Retail price must be a number")
    .required("Retail price is required")
    .positive("Must be positive")
    .test(
      "retail-greater",
      "Retail price must be greater than Wholesale and Purchase Price",
      function (value) {
        const { wholesalePrice, purchasePrice } = this.parent;
        if (
          value === undefined ||
          wholesalePrice === undefined ||
          purchasePrice === undefined
        )
          return true;
        return (
          value > Number(wholesalePrice) &&
          value > Number(purchasePrice)
        );
      }
    ),
  wholesalePrice: Yup.number()
    .typeError("Wholesale price must be a number")
    .required("Wholesale price is required")
    .positive("Must be positive")
    .test(
      "wholesale-greater",
      "Wholesale price must be greater than Purchase Price",
      function (value) {
        const { purchasePrice } = this.parent;
        if (value === undefined || purchasePrice === undefined) return true;
        return value > Number(purchasePrice);
      }
    ),
  purchasePrice: Yup.number()
    .typeError("Purchase price must be a number")
    .required("Purchase price is required")
    .positive("Must be positive"),
  minStockLevel: Yup.number()
    .typeError("Minimum stock level must be a number")
    .required("Minimum stock level is required")
    .min(0, "Cannot be negative"),
  taxRate: Yup.number()
    .typeError("Tax rate must be a number")
    .required("Tax rate is required")
    .min(0, "Tax rate must be at least 0")
    .max(100, "Tax rate cannot exceed 100"),
})

export default function EditProductPage({ params }: { params: { id: string } }) {
  const dispatch = useDispatch<AppDispatch>()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [categoryData, setCategoryData] = useState<ICategory[]>([])
  const [productData, setProductData] = useState<IProduct | null>(null)
  const [showVariantForm, setShowVariantForm] = useState(false)
  const [variantErrors, setVariantErrors] = useState<any>({})
  const [editVariantIndex, setEditVariantIndex] = useState<number | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteVariantIndex, setDeleteVariantIndex] = useState<number | null>(null)
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const router = useRouter()

  const validationSchema = Yup.object({
    name: Yup.string().required("Product name is required"),
    categoryId: Yup.string().required("Category is required"),
    description: Yup.string().required("Description is required"),
    captureDate: Yup.string().required("Date is required"),
    variants: Yup.array()
      .of(
        Yup.object({
          packingSize: Yup.string().required("Packing size is required"),
          sku: Yup.string().required("SKU is required"),
          barcode: Yup.string().required("Barcode is required"),
          unit: Yup.string().required("Unit is required"),
          mrp: Yup.number()
            .required("MRP is required")
            .positive("Must be positive")
            .test(
              "mrp-greater",
              "MRP must be greater than Retail, Wholesale, and Purchase Price",
              function (value) {
                const { retailPrice, wholesalePrice, purchasePrice } = this.parent;
                if (
                  value === undefined ||
                  retailPrice === undefined ||
                  wholesalePrice === undefined ||
                  purchasePrice === undefined
                )
                  return true;
                return (
                  value > Number(retailPrice) &&
                  value > Number(wholesalePrice) &&
                  value > Number(purchasePrice)
                );
              }
            ),
          retailPrice: Yup.number()
            .required("Retail price is required")
            .positive("Must be positive")
            .test(
              "retail-greater",
              "Retail price must be greater than Wholesale and Purchase Price",
              function (value) {
                const { wholesalePrice, purchasePrice } = this.parent;
                if (
                  value === undefined ||
                  wholesalePrice === undefined ||
                  purchasePrice === undefined
                )
                  return true;
                return (
                  value > Number(wholesalePrice) &&
                  value > Number(purchasePrice)
                );
              }
            ),
          wholesalePrice: Yup.number()
            .required("Wholesale price is required")
            .positive("Must be positive")
            .test(
              "wholesale-greater",
              "Wholesale price must be greater than Purchase Price",
              function (value) {
                const { purchasePrice } = this.parent;
                if (value === undefined || purchasePrice === undefined) return true;
                return value > Number(purchasePrice);
              }
            ),
          purchasePrice: Yup.number().required("Purchase price is required").positive("Must be positive"),
          minStockLevel: Yup.number().required("Minimum stock level is required").min(0, "Cannot be negative"),
          taxRate: Yup.number()
            .required("Tax rate is required")
            .min(0, "Tax rate must be at least 0")
            .max(100, "Tax rate cannot exceed 100"),
        })
      )
      .min(1, "At least one variant is required"),
    newVariant: Yup.object({
      packingSize: Yup.string(),
      sku: Yup.string(),
      barcode: Yup.string(),
      unit: Yup.string(),
      mrp: Yup.string(),
      retailPrice: Yup.string(),
      wholesalePrice: Yup.string(),
      purchasePrice: Yup.string(),
      minStockLevel: Yup.string(),
      taxRate: Yup.string(),
    }),
  })

  const fetchProduct = async () => {
    try {
      const res = await serverGetProduct()
      const product = res?.data?.find((p: any) => p?._id === params?.id)
      setProductData(product)
    } catch (error) {
      console.error("Error fetching product:", error)
    }
  }

  const getCustomerData = async () => {
    try {
      const res = await serverGetActiveCategory()
      setCategoryData(res?.data)
    } catch (error) {
      console.error("Error fetching category data:", error)
    }
  }

  const handleDelete = (idx: number) => {
    setDeleteVariantIndex(idx)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = (values: any, setFieldValue: any) => {
    if (deleteVariantIndex === null) return
    const newVariants = [...values.variants]
    newVariants.splice(deleteVariantIndex, 1)
    setFieldValue("variants", newVariants)
    if (editVariantIndex === deleteVariantIndex) {
      setShowVariantForm(false)
      setEditVariantIndex(null)
      setFieldValue("newVariant", {
        packingSize: "",
        sku: "",
        barcode: "",
        unit: "",
        mrp: "",
        retailPrice: "",
        wholesalePrice: "",
        purchasePrice: "",
        minStockLevel: "",
        taxRate: "",
        quantity: "",
      })
      setVariantErrors({})
    }
    setDeleteDialogOpen(false)
    setDeleteVariantIndex(null)
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
    setDeleteVariantIndex(null)
  }

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await Promise.all([fetchProduct(), getCustomerData()])
      setIsLoading(false)
    }
    loadData()
  }, [])

  if (isLoading || !productData) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading product data...</p>
        </div>
      </div>
    )
  }

  console.log("Product Data:", productData)

  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Edit Product</h2>
      </div>

      <Card className="w-full mx-auto">
        <Formik
          initialValues={{
            _id: productData?._id || "",
            name: productData?.name || "",
            categoryId: productData?.categoryId || "",
            description: productData?.description || "",
            captureDate: productData?.captureDate
              ? new Date(productData.captureDate).toISOString().slice(0, 10)
              : new Date().toISOString().slice(0, 10), // <-- Default to product or today
            variants: productData?.variants || [],
            newVariant: {
              packingSize: "",
              sku: "",
              barcode: "",
              unit: "",
              mrp: "",
              retailPrice: "",
              wholesalePrice: "",
              purchasePrice: "",
              minStockLevel: "",
              taxRate: "",
              quantity: "",
            },
          }}
          validationSchema={validationSchema}
          onSubmit={() => { /* handled in form's onSubmit */ }}
        >
          {({ setFieldValue, values, isSubmitting, setSubmitting, validateForm, submitForm }) => (
            <Form
              onSubmit={async e => {
                e.preventDefault();
                const errors = await validateForm();
                if (Object.keys(errors).length === 0) {
                  setShowUpdateConfirm(true);
                } else {
                  submitForm(); // show validation errors
                }
              }}
            >
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Update product details and inventory information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product fields */}
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <div className="relative">
                    <Tag className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Field as={Input} id="name" name="name" placeholder="Organic Fertilizer" className="pl-8" />
                  </div>
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category</Label>
                  <div className="relative">
                    <List className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Select
                      value={values.categoryId}
                      onValueChange={(value) => setFieldValue("categoryId", value)}
                    >
                      <SelectTrigger className="pl-8">
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
                  <Label htmlFor="description">Description</Label>
                  <div className="relative">
                    <FileText className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                    <Field as={Textarea} id="description" name="description" placeholder="Product description" rows={3} className="pl-8" />
                  </div>
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Capture Date input */}
                <div className="space-y-2">
                  <Label htmlFor="captureDate">Select Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Field
                      as={Input}
                      id="captureDate"
                      name="captureDate"
                      type="date"
                      className="pl-8"
                    />
                  </div>
                  <ErrorMessage name="captureDate" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Variants Table */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <h3 className="text-xl font-semibold">Variants</h3>
                    <Button
                      type="button"
                      onClick={() => {
                        setShowVariantForm(true)
                        setEditVariantIndex(null)
                        setFieldValue("newVariant", {
                          packingSize: "",
                          sku: "",
                          barcode: "",
                          unit: "",
                          mrp: "",
                          retailPrice: "",
                          wholesalePrice: "",
                          purchasePrice: "",
                          minStockLevel: "",
                          taxRate: "",
                          quantity: "",
                        })
                        setVariantErrors({})
                      }}
                      disabled={showVariantForm}
                      className="w-full sm:w-auto"
                    >
                      Add Variant
                    </Button>
                  </div>
                  {/* Table of added variants */}
                  <div className="overflow-x-auto">
                    <Table className="min-w-[900px] border text-sm">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="border px-2 py-1 text-left whitespace-nowrap">Packing Size</TableHead>
                          <TableHead className="border px-2 py-1 text-left whitespace-nowrap">SKU</TableHead>
                          <TableHead className="border px-2 py-1 text-left whitespace-nowrap">Barcode</TableHead>
                          <TableHead className="border px-2 py-1 text-left whitespace-nowrap">Unit</TableHead>
                          <TableHead className="border px-2 py-1 text-left whitespace-nowrap">MRP</TableHead>
                          <TableHead className="border px-2 py-1 text-left whitespace-nowrap">Retail Price</TableHead>
                          <TableHead className="border px-2 py-1 text-left whitespace-nowrap">Wholesale Price</TableHead>
                          <TableHead className="border px-2 py-1 text-left whitespace-nowrap">Purchase Price</TableHead>
                          <TableHead className="border px-2 py-1 text-left whitespace-nowrap">Min Stock</TableHead>
                          <TableHead className="border px-2 py-1 text-left whitespace-nowrap">Tax Rate</TableHead>
                          <TableHead className="border px-2 py-1 text-left whitespace-nowrap">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {values.variants.length > 0 ? (
                          values.variants.map((variant: any, idx: number) => (
                            <TableRow key={idx}>
                              <TableCell className="border px-2 py-1">{variant.packingSize}</TableCell>
                              <TableCell className="border px-2 py-1">{variant.sku}</TableCell>
                              <TableCell className="border px-2 py-1">{variant.barcode}</TableCell>
                              <TableCell className="border px-2 py-1">{variant.unit}</TableCell>
                              <TableCell className="border px-2 py-1">{formatCurrency(variant.mrp)}</TableCell>
                              <TableCell className="border px-2 py-1">{formatCurrency(variant.retailPrice)}</TableCell>
                              <TableCell className="border px-2 py-1">{formatCurrency(variant.wholesalePrice)}</TableCell>
                              <TableCell className="border px-2 py-1">{formatCurrency(variant.purchasePrice)}</TableCell>
                              <TableCell className="border px-2 py-1">{formatCurrency(variant.minStockLevel, false, false)}</TableCell>
                              <TableCell className="border px-2 py-1">{formatCurrency(variant.taxRate, false, false)}</TableCell>
                              <TableCell className="border px-2 py-1">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="mr-2"
                                  onClick={() => {
                                    setShowVariantForm(true)
                                    setEditVariantIndex(idx)
                                    setFieldValue("newVariant", { ...variant })
                                    setVariantErrors({})
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDelete(idx)}
                                >
                                  <Delete className="h-4 w-4" />
                                </Button>
                              </TableCell>

                              <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete this variant. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleConfirmDelete(values, setFieldValue)}
                                      className="bg-destructive text-destructive-foreground"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell className="border px-2 py-1 text-center" colSpan={11}>
                              No Data
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Add/Edit Variant Form */}
                {showVariantForm && (
                  <div className="border p-4 rounded space-y-2 mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <div className="relative">
                          <Package className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Field name="newVariant.unit">
                            {({ field }: any) => (
                              <Select
                                value={field.value}
                                onValueChange={(value) => field.onChange({ target: { name: field.name, value } })}
                              >
                                <SelectTrigger className="pl-8 border rounded w-full h-10">
                                  <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                                <SelectContent>
                                  {units?.map((item) => {
                                    return (
                                      <SelectItem key={item.symbol} value={item.symbol}>
                                        {item.name} ({item.symbol})
                                      </SelectItem>
                                    )
                                  })}
                                </SelectContent>
                              </Select>
                            )}
                          </Field>
                        </div>
                        {variantErrors.unit && (
                          <div className="text-red-500 text-sm">{variantErrors.unit}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Packing Size</Label>
                        <div className="relative">
                          <Package className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Field name="newVariant.packingSize">
                            {({ field, form }: any) => {
                              // Find the selected unit
                              const selectedUnit = form.values.newVariant.unit;
                              console.log("Selected unit:", selectedUnit);
                              const unitObj = packingSizesByUnit.find(
                                (u) => u.symbol === selectedUnit
                              );
                              console.log("Unit object:", unitObj);
                              const sizes = unitObj ? unitObj.packingSizes : [];
                              console.log("Packing sizes:", sizes);
                              return (
                                <Select
                                  value={field.value}
                                  onValueChange={(value) => form.setFieldValue(field.name, value)}
                                  disabled={!selectedUnit}
                                >
                                  <SelectTrigger className="pl-8 border rounded w-full h-10">
                                    <SelectValue placeholder="Select packing size" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {sizes.map((size: any) => (
                                      <SelectItem key={size.value} value={String(size.label)}>
                                        {size.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              );
                            }}
                          </Field>
                        </div>
                        {variantErrors.packingSize && (
                          <div className="text-red-500 text-sm">{variantErrors.packingSize}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>SKU</Label>
                        <div className="relative">
                          <Layers className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Field as={Input} name="newVariant.sku" placeholder="SKU" className="pl-8" />
                        </div>
                        {variantErrors.sku && (
                          <div className="text-red-500 text-sm">{variantErrors.sku}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Barcode</Label>
                        <div className="relative">
                          <Barcode className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Field as={Input} name="newVariant.barcode" placeholder="Barcode" className="pl-8" />
                        </div>
                        {variantErrors.barcode && (
                          <div className="text-red-500 text-sm">{variantErrors.barcode}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>MRP</Label>
                        <div className="relative">
                          <IndianRupee className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Field name="newVariant.mrp">
                            {({ field, form }: any) => (
                              <Input
                                type="text"
                                placeholder="MRP"
                                className="pl-8"
                                value={field.value ? formatIndianNumber(field.value) : ""}
                                onChange={e => {
                                  const rawValue = e.target.value.replace(/,/g, "");
                                  if (/^\d*\.?\d*$/.test(rawValue)) {
                                    form.setFieldValue(field.name, rawValue);
                                  }
                                }}
                              />
                            )}
                          </Field>
                        </div>
                        {variantErrors.mrp && (
                          <div className="text-red-500 text-sm">{variantErrors.mrp}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Retail Price</Label>
                        <div className="relative">
                          <IndianRupee className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Field name="newVariant.retailPrice">
                            {({ field, form }: any) => (
                              <Input
                                type="text"
                                placeholder="Retail Price"
                                className="pl-8"
                                value={field.value ? formatIndianNumber(field.value) : ""}
                                onChange={e => {
                                  const rawValue = e.target.value.replace(/,/g, "");
                                  if (/^\d*\.?\d*$/.test(rawValue)) {
                                    form.setFieldValue(field.name, rawValue);
                                  }
                                }}
                              />
                            )}
                          </Field>
                        </div>
                        {variantErrors.retailPrice && (
                          <div className="text-red-500 text-sm">{variantErrors.retailPrice}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Wholesale Price</Label>
                        <div className="relative">
                          <IndianRupee className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Field name="newVariant.wholesalePrice">
                            {({ field, form }: any) => (
                              <Input
                                type="text"
                                placeholder="Wholesale Price"
                                className="pl-8"
                                value={field.value ? formatIndianNumber(field.value) : ""}
                                onChange={e => {
                                  const rawValue = e.target.value.replace(/,/g, "");
                                  if (/^\d*\.?\d*$/.test(rawValue)) {
                                    form.setFieldValue(field.name, rawValue);
                                  }
                                }}
                              />
                            )}
                          </Field>
                        </div>
                        {variantErrors.wholesalePrice && (
                          <div className="text-red-500 text-sm">{variantErrors.wholesalePrice}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Purchase Price</Label>
                        <div className="relative">
                          <IndianRupee className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Field name="newVariant.purchasePrice">
                            {({ field, form }: any) => (
                              <Input
                                type="text"
                                placeholder="Purchase Price"
                                className="pl-8"
                                value={field.value ? formatIndianNumber(field.value) : ""}
                                onChange={e => {
                                  const rawValue = e.target.value.replace(/,/g, "");
                                  if (/^\d*\.?\d*$/.test(rawValue)) {
                                    form.setFieldValue(field.name, rawValue);
                                  }
                                }}
                              />
                            )}
                          </Field>
                        </div>
                        {variantErrors.purchasePrice && (
                          <div className="text-red-500 text-sm">{variantErrors.purchasePrice}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Min Stock Level</Label>
                        <div className="relative">
                          <Boxes className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Field name="newVariant.minStockLevel">
                            {({ field, form }: any) => (
                              <Input
                                type="text"
                                placeholder="Min Stock Level"
                                className="pl-8"
                                value={field.value ? formatIndianNumber(field.value) : ""}
                                onChange={e => {
                                  const rawValue = e.target.value.replace(/,/g, "");
                                  if (/^\d*\.?\d*$/.test(rawValue)) {
                                    form.setFieldValue(field.name, rawValue);
                                  }
                                }}
                              />
                            )}
                          </Field>
                        </div>
                        {variantErrors.minStockLevel && (
                          <div className="text-red-500 text-sm">{variantErrors.minStockLevel}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Tax Rate (%)</Label>
                        <div className="relative">
                          <Percent className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Field name="newVariant.taxRate">
                            {({ field, form }: any) => (
                              <Input
                                type="text"
                                placeholder="Tax Rate"
                                className="pl-8"
                                value={field.value ? formatIndianNumber(field.value) : ""}
                                onChange={e => {
                                  const rawValue = e.target.value.replace(/,/g, "");
                                  if (/^\d*\.?\d*$/.test(rawValue)) {
                                    form.setFieldValue(field.name, rawValue);
                                  }
                                }}
                              />
                            )}
                          </Field>
                        </div>
                        {variantErrors.taxRate && (
                          <div className="text-red-500 text-sm">{variantErrors.taxRate}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                      <Button
                        type="button"
                        onClick={async () => {
                          try {
                            await newVariantSchema.validate(values.newVariant, { abortEarly: false })
                            if (editVariantIndex !== null) {
                              const updatedVariants = [...values.variants]
                              updatedVariants[editVariantIndex] = {
                                ...values.newVariant,
                                mrp: Number(values.newVariant.mrp),
                                retailPrice: Number(values.newVariant.retailPrice),
                                wholesalePrice: Number(values.newVariant.wholesalePrice),
                                purchasePrice: Number(values.newVariant.purchasePrice),
                                minStockLevel: Number(values.newVariant.minStockLevel),
                                taxRate: Number(values.newVariant.taxRate),
                                quantity: Number(0),
                              }
                              setFieldValue("variants", updatedVariants)
                            } else {
                              setFieldValue("variants", [
                                ...values.variants,
                                {
                                  ...values.newVariant,
                                  mrp: Number(values.newVariant.mrp),
                                  retailPrice: Number(values.newVariant.retailPrice),
                                  wholesalePrice: Number(values.newVariant.wholesalePrice),
                                  purchasePrice: Number(values.newVariant.purchasePrice),
                                  minStockLevel: Number(values.newVariant.minStockLevel),
                                  taxRate: Number(values.newVariant.taxRate),
                                  quantity: Number(0),
                                },
                              ])
                            }
                            setFieldValue("newVariant", {
                              packingSize: "",
                              sku: "",
                              barcode: "",
                              unit: "",
                              mrp: "",
                              retailPrice: "",
                              wholesalePrice: "",
                              purchasePrice: "",
                              minStockLevel: "",
                              taxRate: "",
                              quantity: "",
                            })
                            setVariantErrors({})
                            setShowVariantForm(false)
                            setEditVariantIndex(null)
                          } catch (err: any) {
                            if (err.inner) {
                              const errors: any = {}
                              err.inner.forEach((e: any) => {
                                errors[e.path] = e.message
                              })
                              setVariantErrors(errors)
                            }
                          }
                        }}
                        className="w-full sm:w-auto"
                      >
                        {editVariantIndex !== null ? "Update Variant" : "Save Variant"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setFieldValue("newVariant", {
                            packingSize: "",
                            sku: "",
                            barcode: "",
                            unit: "",
                            mrp: "",
                            retailPrice: "",
                            wholesalePrice: "",
                            purchasePrice: "",
                            minStockLevel: "",
                            taxRate: "",
                            quantity: "",
                          })
                          setVariantErrors({})
                          setShowVariantForm(false)
                          setEditVariantIndex(null)
                        }}
                        className="w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
                <Button type="button" variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving || values.variants.length === 0} className="w-full sm:w-auto">
                  {isSaving ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving....</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Save Changes</span>
                    </div>
                  )}
                </Button>
              </CardFooter>

              {/* Confirmation Dialog */}
              <Dialog open={showUpdateConfirm} onOpenChange={setShowUpdateConfirm}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Update</DialogTitle>
                  </DialogHeader>
                  <div>
                    Are you sure you want to update this product and its variants?
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowUpdateConfirm(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={async () => {
                        setShowUpdateConfirm(false);
                        setIsSaving(true);
                        try {
                          const res = await serverUpdateProduct({
                            _id: values?._id,
                            name: values.name,
                            categoryId: values.categoryId,
                            description: values.description,
                            captureDate: new Date(values.captureDate),
                            variants: values.variants.map((v: any) => ({
                              ...v,
                              mrp: Number(v.mrp),
                              retailPrice: Number(v.retailPrice),
                              wholesalePrice: Number(v.wholesalePrice),
                              purchasePrice: Number(v.purchasePrice),
                              minStockLevel: Number(v.minStockLevel),
                              taxRate: Number(v.taxRate),
                              quantity: Number(0),
                            })),
                          });
                          if (res?.success) {
                            router.push(`/dashboard/products`);
                          }
                          dispatch(getProducts());
                        } catch (error) {
                          console.error("Error updating product:", error);
                        }
                        setIsSaving(false);
                        setSubmitting(false);
                      }}
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Yes, Update"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  )
}

