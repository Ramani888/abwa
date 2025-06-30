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
import { ArrowLeft, Calendar } from "lucide-react"
import { User, Phone, Mail, MapPin, Landmark } from "lucide-react"
import { serverAddSupplier } from "@/services/serverApi"

const initialValues = {
  name: "",
  number: "",
  email: "",
  address: "",
  gstNumber: "",
  captureDate: new Date().toISOString().split("T")[0], // Default to today's date
}

const validationSchema = Yup.object({
  name: Yup.string().required("Supplier name is required"),
  number: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
  email: Yup.string().email("Invalid email address"),
  address: Yup.string(),
  gstNumber: Yup.string(),
  captureDate: Yup.date()
    .typeError("Invalid date format")
    .max(new Date(), "Date cannot be in the future"),
})

export default function NewSupplierPage() {
  const router = useRouter()
  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="w-10 h-10 mr-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Add New Supplier</h2>
      </div>
      <Card className="w-full mx-auto">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              await serverAddSupplier({
                ...values,
                captureDate: new Date(values.captureDate),
              })
              router.push("/dashboard/suppliers")
            } catch (error: any) {
              setErrors({ name: error?.message || "Failed to add supplier" })
            } finally {
              setSubmitting(false)
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <CardHeader>
                <CardTitle>Supplier Information</CardTitle>
                <CardDescription>Add a new supplier to your inventory</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Field
                      as={Input}
                      id="name"
                      name="name"
                      placeholder="Supplier Name"
                      className="pl-10"
                    />
                  </div>
                  <ErrorMessage name="name" component="p" className="text-red-500 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Field
                      as={Input}
                      id="number"
                      name="number"
                      placeholder="10 digit number"
                      className="pl-10"
                      type="number"
                    />
                  </div>
                  <ErrorMessage name="number" component="p" className="text-red-500 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      placeholder="supplier@email.com"
                      className="pl-10"
                    />
                  </div>
                  <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Field
                      as={Textarea}
                      id="address"
                      name="address"
                      placeholder="Supplier address"
                      className="pl-10"
                    />
                  </div>
                  <ErrorMessage name="address" component="p" className="text-red-500 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstNumber">GST Number</Label>
                  <div className="relative">
                    <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Field
                      as={Input}
                      id="gstNumber"
                      name="gstNumber"
                      placeholder="22AAAAA0000A1Z5"
                      className="pl-10"
                    />
                  </div>
                  <ErrorMessage name="gstNumber" component="p" className="text-red-500 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="captureDate">Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Field
                      as={Input}
                      type='date'
                      id="captureDate"
                      name="captureDate"
                      className="pl-10"
                    />
                  </div>
                  <ErrorMessage name="captureDate" component="p" className="text-red-500 text-sm" />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <Button type="button" variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding....</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Add Supplier</span>
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