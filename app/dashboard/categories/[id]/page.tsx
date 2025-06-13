"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, FileText, Tag } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { serverGetCategory, serverUpdateCategory } from "@/services/serverApi"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    description: "",
    isActive: true,
    captureDate: '' // Default to today's date
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const validationSchema = Yup.object({
    name: Yup.string().required("Category name is required"),
    description: Yup.string().required("Description is required"),
    isActive: Yup.boolean(),
    captureDate: Yup.date()
      .required("Capture date is required")
  })

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await serverGetCategory();
        const categoryData = res?.data?.find((category: any) => category?._id === params?.id);
  
        setFormData({
          _id: categoryData?._id,
          name: categoryData.name,
          description: categoryData.description,
          isActive: categoryData.isActive,
          captureDate: categoryData.captureDate ? new Date(categoryData.captureDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0] // Format date for input
        })

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching category:", error);
        setIsLoading(false);
      }
    };
  
    fetchCategory();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading category data...</p>
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
        <h2 className="text-3xl font-bold tracking-tight">Edit Category</h2>
      </div>

      <Card className="w-full">
        <Formik
          enableReinitialize // Allows Formik to update initialValues when they change
          initialValues={formData} // Use formData as initialValues
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              setIsSaving(true);
              const res = await serverUpdateCategory({
                ...values,
                captureDate: new Date(values.captureDate),
              }); // Use Formik's values, convert captureDate to Date
              if (res?.success) {
                router.push(`/dashboard/categories`);
              }
            } catch (error) {
              console.error("Error updating category:", error);
            } finally {
              setIsSaving(false);
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <CardHeader>
                <CardTitle>Category Information</CardTitle>
                <CardDescription>Update the category details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="name"
                      name="name"
                      placeholder="Fertilizers"
                      className="pl-10"
                    />
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <div className="relative">
                    <Field
                      as={Textarea}
                      id="description"
                      name="description"
                      placeholder="All types of fertilizers for crops"
                      rows={3}
                      className="pl-10"
                    />
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  </div>
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                </div>

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
                <Button type="submit" disabled={isSaving}>
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
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  )
}

