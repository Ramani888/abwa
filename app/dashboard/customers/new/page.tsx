"use client"

import type React from "react"

import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, Mail, Phone, MapPin, DollarSign, FileText, List } from "lucide-react"
import { serverAddCustomer } from "@/services/serverApi"
import { Switch } from "@/components/ui/switch"

export default function NewCustomerPage() {
  const router = useRouter()

  const initialValues = {
    name: "",
    email: "",
    number: "",
    address: "",
    customerType: "retail", // retail or wholesale
    gstNumber: "",
    creditLimit: "",
    paymentTerms: "cod",
    captureDate: new Date().toISOString().slice(0, 10), // default to today
    isActive: true,    // new field
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    number: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone Number is required"),
    address: Yup.string().required("Address is required"),
    gstNumber: Yup.string().when("customerType", {
      is: "wholesale",
      then: (schema) => schema.required("GST Number is required for wholesale customers"),
    }),
    creditLimit: Yup.number().when("customerType", {
      is: (value: string) => value === "wholesale",
      then: (schema) => schema.required("Credit Limit is required for wholesale customers"),
    }),
    paymentTerms: Yup.string().required("Payment Terms are required"),
    captureDate: Yup.string().required("Capture Date is required"), // new validation
    isActive: Yup.boolean(), // new field
  })

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      const res = await serverAddCustomer({
        ...values,
        number: Number(values.number),
        creditLimit: Number(values.creditLimit),
        captureDate: new Date(values.captureDate),
        isActive: values.isActive,
      })
      if (res?.success) {
        router.push("/dashboard/customers")
      }
    } catch (error) {
      console.error("Error creating customer:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Add New Customer</h2>
      </div>

      <Card className="w-full">
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>Add a new customer to your agro shop</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerType">Customer Type</Label>
                  <RadioGroup
                    value={values.customerType}
                    onValueChange={(value) => setFieldValue("customerType", value)}
                    className="flex flex-col space-y-1"
                  >
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
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      className="pl-10"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                  <ErrorMessage name="name" component="p" className="text-red-500 text-sm" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        className="pl-10"
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    </div>
                    <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="number">Phone Number</Label>
                    <div className="relative">
                      <Field
                        as={Input}
                        id="number"
                        name="number"
                        type="number"
                        placeholder="+91 9876543210"
                        className="pl-10"
                      />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    </div>
                    <ErrorMessage name="number" component="p" className="text-red-500 text-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <Field
                      as={Textarea}
                      id="address"
                      name="address"
                      placeholder="123 Main St, City"
                      className="pl-10"
                    />
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  </div>
                  <ErrorMessage name="address" component="p" className="text-red-500 text-sm" />
                </div>

                {values.customerType === "wholesale" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="gstNumber">GST Number</Label>
                      <div className="relative">
                        <Field
                          as={Input}
                          id="gstNumber"
                          name="gstNumber"
                          placeholder="22AAAAA0000A1Z5"
                          className="pl-10"
                        />
                        <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      </div>
                      <ErrorMessage name="gstNumber" component="p" className="text-red-500 text-sm" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="creditLimit">Credit Limit (₹)</Label>
                        <div className="relative">
                          <Field
                            as={Input}
                            id="creditLimit"
                            name="creditLimit"
                            type="number"
                            placeholder="10000"
                            className="pl-10"
                          />
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        </div>
                        <ErrorMessage name="creditLimit" component="p" className="text-red-500 text-sm" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="paymentTerms">Payment Terms</Label>
                        <div className="relative">
                          <List className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Select
                            value={values.paymentTerms}
                            onValueChange={(value) => setFieldValue("paymentTerms", value)}
                          >
                            <SelectTrigger className="pl-10">
                              <SelectValue placeholder="Select payment terms" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cod">Cash on Delivery</SelectItem>
                              <SelectItem value="net15">Net 15 Days</SelectItem>
                              <SelectItem value="net30">Net 30 Days</SelectItem>
                              <SelectItem value="net45">Net 45 Days</SelectItem>
                              <SelectItem value="net60">Net 60 Days</SelectItem>
                              <SelectItem value="advance">Advance Payment</SelectItem>
                              <SelectItem value="credit">Credit</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Capture Date Field */}
                <div className="space-y-2">
                  <Label htmlFor="captureDate">Capture Date</Label>
                  <Field
                    as={Input}
                    id="captureDate"
                    name="captureDate"
                    type="date"
                  />
                  <ErrorMessage name="captureDate" component="p" className="text-red-500 text-sm" />
                </div>

                {/* Active Switch */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={values.isActive}
                    onCheckedChange={(checked) => setFieldValue("isActive", checked)}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding....</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Add Customer</span>
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

