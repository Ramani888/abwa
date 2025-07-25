"use client"

import type React from "react"

import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, FileText, List, IndianRupeeIcon } from "lucide-react"
import { useState, useEffect, use } from "react"
import { set } from "date-fns"
import { serverAddCustomerPayment, serverAddSupplierPayment, serverGetCustomers, serverGetSupplier } from "@/services/serverApi"
import { paymentMethods } from "@/utils/consts/product"
import { getSupplierPayments } from "@/lib/features/supplierPaymentSlice"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/lib/store"

export default function NewSupplierPaymentPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const [supplierData, setSupplierData] = useState<any[]>([])
  const [selectedSupplier, setSelectedSupplier] = useState("")
  const [loading, setLoading] = useState(false);

  const getSupplierData = async () => {
    try {
      setLoading(true);
      const res = await serverGetSupplier();
      setSupplierData(res?.data || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setSupplierData([]);
      console.error("Error fetching suppliers:", error)
    }
  }

  useEffect(() => {
    getSupplierData();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const initialValues = {
    supplierId: "",
    captureDate: today, // set default to today
    amount: "",
    paymentType: "",
    paymentMode: "",
  }

  const validationSchema = Yup.object({
    supplierId: Yup.string().required("Supplier is required"),
    captureDate: Yup.string().required("Date is required"), // changed from date
    amount: Yup.number().required("Amount is required"),
    paymentType: Yup.string().required("Payment Type is required"),
    paymentMode: Yup.string().required("Payment Mode is required"),
  })

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      const res = await serverAddSupplierPayment({...values, amount: Number(values.amount), captureDate: new Date(values.captureDate)});
      if (res?.success) {
        router.push("/dashboard/supplier-payment")
      }
    } catch (error) {
      console.error("Error creating payment:", error)
    } finally {
      dispatch(getSupplierPayments())
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Add New Supplier Payment</h2>
      </div>

      <Card className="w-full mx-auto">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            // Use selectedSupplier for supplier field
            handleSubmit({ ...values, supplierId: selectedSupplier }, actions)
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              <CardHeader>
                <CardTitle>Supplier Payment Information</CardTitle>
                <CardDescription>
                  Add a new supplier payment to your agro shop
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Supplier Dropdown with icon */}
                <div className="space-y-2">
                  <Label htmlFor="supplierId">Select Supplier</Label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                    <Select
                      value={selectedSupplier}
                      onValueChange={(val) => {
                        setSelectedSupplier(val)
                        setFieldValue("supplierId", val)
                      }}
                    >
                      <SelectTrigger className="pl-8">
                        <SelectValue placeholder="Select a supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {supplierData?.map((supplier) => (
                          <SelectItem key={supplier?._id} value={supplier?._id}>
                            {supplier?.name} - {supplier?.number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <ErrorMessage name="supplierId" component="p" className="text-red-500 text-sm" />
                </div>

                {/* Amount and Date in one row, stack on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Date with icon */}
                  <div className="space-y-2">
                    <Label htmlFor="captureDate">Date</Label>
                    <div className="relative">
                      <FileText className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                      <Field
                        as={Input}
                        id="captureDate"
                        name="captureDate"
                        type="date"
                        className="pl-8"
                      />
                    </div>
                    <ErrorMessage name="captureDate" component="p" className="text-red-500 text-sm" />
                  </div>
                  {/* Amount with icon */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (₹)</Label>
                    <div className="relative">
                      <IndianRupeeIcon className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                      <Field
                        as={Input}
                        id="amount"
                        name="amount"
                        type="number"
                        placeholder="Enter amount"
                        className="pl-8"
                      />
                    </div>
                    <ErrorMessage name="amount" component="p" className="text-red-500 text-sm" />
                  </div>
                </div>

                {/* Payment Type and Payment Mode in one row, stack on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Payment Type with icon */}
                  <div className="space-y-2">
                    <Label htmlFor="paymentType">Payment Type</Label>
                    <div className="relative">
                      <List className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                      <Select
                        value={values.paymentType}
                        onValueChange={(val) => setFieldValue("paymentType", val)}
                      >
                        <SelectTrigger className="pl-8">
                          <SelectValue placeholder="Select payment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="advance">Advance</SelectItem>
                          <SelectItem value="full">Full</SelectItem>
                          <SelectItem value="partial">Partial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <ErrorMessage name="paymentType" component="p" className="text-red-500 text-sm" />
                  </div>
                  {/* Payment Mode with icon */}
                  <div className="space-y-2">
                    <Label htmlFor="paymentMode">Payment Mode</Label>
                    <div className="relative">
                      <IndianRupeeIcon className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                      <Select
                        value={values.paymentMode}
                        onValueChange={(val) => setFieldValue("paymentMode", val)}
                      >
                        <SelectTrigger className="pl-8">
                          <SelectValue placeholder="Select payment mode" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods?.map((item) => {
                            return (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <ErrorMessage name="paymentMode" component="p" className="text-red-500 text-sm" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding....</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Add Payment</span>
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