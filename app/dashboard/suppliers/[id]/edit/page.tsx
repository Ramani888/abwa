"use client"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, User, Phone, Mail, MapPin, Landmark, Calendar } from "lucide-react"
import { serverGetSupplier, serverUpdateSupplier } from "@/services/serverApi"

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

export default function EditSupplierPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [initialValues, setInitialValues] = useState({
    name: "",
    number: "",
    email: "",
    address: "",
    gstNumber: "",
    captureDate: "",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSupplier() {
      try {
        const res = await serverGetSupplier();
        const supplierData = res?.data?.find((supplier: any) => supplier?._id === params.id)

        if (supplierData) {
          setInitialValues({
            name: supplierData.name || "",
            number: supplierData.number || "",
            email: supplierData.email || "",
            address: supplierData.address || "",
            gstNumber: supplierData.gstNumber || "",
            captureDate: supplierData.captureDate ? new Date(supplierData.captureDate).toISOString().split("T")[0] : "",
          })
          setLoading(false)
        } else {
          console.error("Supplier not found")
        }
      } catch (error) {
        console.error("Error fetching supplier data:", error)
        setLoading(false)
      }
    }
    fetchSupplier()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading supplier data...</p>
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
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Edit Supplier</h2>
      </div>
      <Card className="w-full mx-auto">
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              await serverUpdateSupplier({
                ...values,
                _id: params.id,
                captureDate: values.captureDate ? new Date(values.captureDate) : undefined
              })
              router.push("/dashboard/suppliers")
            } catch (error: any) {
              setErrors({ name: error?.message || "Failed to update supplier" })
            } finally {
              setSubmitting(false)
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <CardHeader>
                <CardTitle>Supplier Information</CardTitle>
                <CardDescription>Update the supplier details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Field as={Input} id="name" name="name" placeholder="Supplier Name" className="pl-10" />
                  </div>
                  <ErrorMessage name="name" component="p" className="text-red-500 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Field as={Input} id="number" type="number" name="number" placeholder="10 digit number" className="pl-10" />
                  </div>
                  <ErrorMessage name="number" component="p" className="text-red-500 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Field as={Input} id="email" name="email" placeholder="supplier@email.com" className="pl-10" />
                  </div>
                  <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Field as={Textarea} id="address" name="address" placeholder="Supplier address" className="pl-10" />
                  </div>
                  <ErrorMessage name="address" component="p" className="text-red-500 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstNumber">GST Number</Label>
                  <div className="relative">
                    <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Field as={Input} id="gstNumber" name="gstNumber" placeholder="22AAAAA0000A1Z5" className="pl-10" />
                  </div>
                  <ErrorMessage name="gstNumber" component="p" className="text-red-500 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="captureDate">Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Field as={Input} type="date" id="captureDate" name="captureDate" className="pl-10" />
                  </div>
                  <ErrorMessage name="captureDate" component="p" className="text-red-500 text-sm" />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <Button type="button" variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  )
}