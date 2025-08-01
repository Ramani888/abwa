"use client"

import type React from "react"
import { useState } from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Tag, FileText } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { serverAddCategory } from "@/services/serverApi"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function NewCategoryPage() {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingSubmit, setPendingSubmit] = useState<any>(null)
  const [confirmLoading, setConfirmLoading] = useState(false) // <-- add this

  const initialValues = {
    name: "",
    description: "",
    isActive: true,
    captureDate: new Date().toISOString().split("T")[0], // Default to today's date
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Category name is required"),
    description: Yup.string().required("Description is required"),
    isActive: Yup.boolean(),
    captureDate: Yup.date()
      .required("Capture date is required")
  })

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    setPendingSubmit({ values, setSubmitting })
    setShowConfirm(true)
  }

  const handleConfirm = async () => {
    if (!pendingSubmit) return
    const { values, setSubmitting } = pendingSubmit
    setConfirmLoading(true) // <-- set loading
    setShowConfirm(false)
    try {
      const payload = {
        ...values,
        captureDate: new Date(values.captureDate),
      }
      const res = await serverAddCategory(payload)
      if (res?.success) {
        router.push("/dashboard/categories")
      }
    } catch (error) {
      console.error("Error creating category:", error)
    } finally {
      setSubmitting(false)
      setPendingSubmit(null)
      setConfirmLoading(false) // <-- reset loading
    }
  }

  const handleCancel = () => {
    if (pendingSubmit) pendingSubmit.setSubmitting(false)
    setShowConfirm(false)
    setPendingSubmit(null)
    setConfirmLoading(false) // <-- reset loading
  }

  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Add New Category</h2>
      </div>

      <Card className="w-full mx-auto">
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <CardHeader>
                <CardTitle>Category Information</CardTitle>
                <CardDescription>Add a new product category to your inventory</CardDescription>
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
              <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-between">
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
                      <span>Add Category</span>
                    </div>
                  )}
                </Button>
              </CardFooter>
            </Form>
          )}
        </Formik>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Category Submission</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to add this category?</div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={confirmLoading}
            >
              {confirmLoading ? "Adding..." : "Yes, Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

