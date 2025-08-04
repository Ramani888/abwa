"use client"

import React, { useState } from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Tag, FileText, CalendarDays, CreditCard, IndianRupee } from "lucide-react"
import { serverAddExpense } from "@/services/serverApi"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { expenseTypes, paymentMethods } from "@/utils/consts/product"

function formatIndianNumber(num: string | number) {
  if (!num) return "";
  const [integer, decimal] = num.toString().split(".");
  const formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimal ? `${formatted}.${decimal}` : formatted;
}

export default function NewExpensePage() {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingSubmit, setPendingSubmit] = useState<any>(null)
  const [confirmLoading, setConfirmLoading] = useState(false) // <-- add this

  const initialValues = {
    captureDate: new Date().toISOString().split("T")[0],
    type: "",
    amount: "",
    paymentMode: "",
    notes: ""
  }

  const validationSchema = Yup.object({
    captureDate: Yup.date()
      .required("Capture date is required"),
    type: Yup.string()
      .required("Expense type is required"),
    amount: Yup.number()
      .typeError("Amount must be a number")
      .positive("Amount must be greater than zero")
      .required("Amount is required"),
    paymentMode: Yup.string()
      .required("Payment mode is required"),
    notes: Yup.string()
      .max(500, "Notes must be at most 500 characters")
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
      const res = await serverAddExpense(payload)
      if (res?.success) {
        router.push("/dashboard/expense")
      }
    } catch (error) {
      console.error("Error creating expense:", error)
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
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Add New Expense</h2>
      </div>

      <Card className="w-full mx-auto">
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <CardHeader>
                <CardTitle>Expense Information</CardTitle>
                <CardDescription>Add a new expense to your records</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Capture Date & Expense Type in one row */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="captureDate">Capture Date</Label>
                    <div className="relative">
                      <Field
                        as={Input}
                        id="captureDate"
                        name="captureDate"
                        type="date"
                        className="pl-10"
                      />
                      <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    </div>
                    <ErrorMessage name="captureDate" component="p" className="text-red-500 text-sm" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="type">Expense Type</Label>
                    <div className="relative">
                      <Select
                        value={values.type}
                        onValueChange={(value) => setFieldValue("type", value)}
                      >
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select expense type" />
                        </SelectTrigger>
                        <SelectContent>
                            {expenseTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    </div>
                    <ErrorMessage name="type" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>

                {/* Amount & Payment Mode in one row */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Field name="amount">
                        {({ field, form }: any) => (
                          <Input
                            type="text"
                            id="amount"
                            placeholder="Enter amount"
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
                    <ErrorMessage name="amount" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="paymentMode">Payment Mode</Label>
                    <div className="relative">
                      <Select
                        value={values.paymentMode}
                        onValueChange={(value) => setFieldValue("paymentMode", value)}
                      >
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select payment mode" />
                        </SelectTrigger>
                        <SelectContent>
                            {paymentMethods.map((method) => (
                              <SelectItem key={method.value} value={method.value}>
                                {method.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    </div>
                    <ErrorMessage name="paymentMode" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <div className="relative">
                    <Field
                      as={Textarea}
                      id="notes"
                      name="notes"
                      placeholder="Additional notes about the expense"
                      rows={3}
                      className="pl-10"
                    />
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  </div>
                  <ErrorMessage name="notes" component="div" className="text-red-500 text-sm" />
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
                      <span>Add Expense</span>
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
            <DialogTitle>Confirm Expense Submission</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to add this expense?</div>
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