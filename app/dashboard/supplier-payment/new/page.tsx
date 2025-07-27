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
import { ArrowLeft, User, FileText, List, IndianRupeeIcon, CreditCard, Landmark, QrCode, Receipt, Banknote } from "lucide-react"
import { useState, useEffect, use } from "react"
import { set } from "date-fns"
import { serverAddCustomerPayment, serverAddSupplierPayment, serverGetCustomers, serverGetSupplier } from "@/services/serverApi"
import { paymentMethods } from "@/utils/consts/product"
import { getSupplierPayments } from "@/lib/features/supplierPaymentSlice"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "@/lib/store"
import { formatCurrency, formatIndianNumber } from "@/utils/helpers/general"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { RootState } from "@/lib/store"

const paymentModeIcons: Record<string, React.ReactNode> = {
  card: <CreditCard className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />,
  upi: <QrCode className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />,
  neft_rtgs: <Landmark className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />,
  cheque: <Receipt className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />,
  online_payment: <Banknote className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />,
};

export default function NewSupplierPaymentPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const [supplierData, setSupplierData] = useState<any[]>([])
  const [selectedSupplier, setSelectedSupplier] = useState("")
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState<any>(null);
  const { supplierPayment } = useSelector((state: RootState) => state.supplierPayment || { supplierPayment: [] });
  const { purchaseOrders } = useSelector((state: RootState) => state.purchaseOrders || { purchaseOrders: [] });
  const [dueAmount, setDueAmount] = useState<number | null>(null);

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

  useEffect(() => {
    if (!selectedSupplier) {
      setDueAmount(null);
      return;
    }
    // Filter payments and orders for the selected supplier
    const filteredSupplierPayment = supplierPayment?.filter((data: any) => data.supplierId === selectedSupplier);
    const filteredSupplierOrders = purchaseOrders?.filter((order: any) => order.supplierId === selectedSupplier);

    const paidTotal = filteredSupplierPayment?.reduce(
      (sum: number, data: any) => sum + (data.amount || 0),
      0
    ) || 0;

    const totalAmount = filteredSupplierOrders?.reduce(
      (sum: number, order: any) => sum + (order.total || 0),
      0
    ) || 0;

    const pendingTotal = totalAmount - paidTotal;
    setDueAmount(pendingTotal ?? null);
  }, [selectedSupplier, supplierPayment, purchaseOrders]);

  const today = new Date().toISOString().split("T")[0];

  const initialValues = {
    supplierId: "",
    captureDate: today,
    amount: "",
    paymentType: "",
    paymentMode: "",
    cardNumber: "",
    upiTransactionId: "",
    bankReferenceNumber: "",
    chequeNumber: "",
    gatewayTransactionId: "",
  }

  const validationSchema = Yup.object({
    supplierId: Yup.string().required("Supplier is required"),
    captureDate: Yup.string().required("Date is required"), // changed from date
    amount: Yup.number().required("Amount is required"),
    paymentType: Yup.string().required("Payment Type is required"),
    paymentMode: Yup.string().required("Payment Mode is required"),
  })

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const selectedMethod = paymentMethods.find(pm => pm.value === values.paymentMode);
      const dataToSubmit: any = {
        ...values,
        amount: Number(values.amount),
        captureDate: new Date(values.captureDate),
      };
      delete dataToSubmit.cardNumber;
      delete dataToSubmit.upiTransactionId;
      delete dataToSubmit.bankReferenceNumber;
      delete dataToSubmit.chequeNumber;
      delete dataToSubmit.gatewayTransactionId;
      if (selectedMethod && selectedMethod.extraFieldName) {
        dataToSubmit[selectedMethod.extraFieldName] = (values as Record<string, any>)[selectedMethod.extraFieldName];
      }
      const res = await serverAddSupplierPayment(dataToSubmit);
      if (res?.success) {
        router.push("/dashboard/supplier-payment");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
    } finally {
      dispatch(getSupplierPayments());
      setSubmitting(false);
    }
  };

  // Handler for Formik's onSubmit
  const handleFormSubmit = (values: typeof initialValues, actions: any) => {
    setPendingSubmit({ values, actions });
    setShowConfirm(true);
  };

  // Handler for confirming dialog
  const handleConfirm = () => {
    if (pendingSubmit) {
      handleSubmit(pendingSubmit.values, pendingSubmit.actions);
      setPendingSubmit(null);
      setShowConfirm(false);
    }
  };

  // Handler for canceling dialog
  const handleCancel = () => {
    if (pendingSubmit?.actions) {
      pendingSubmit.actions.setSubmitting(false);
    }
    setPendingSubmit(null);
    setShowConfirm(false);
  };

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
          onSubmit={handleFormSubmit}
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
                  {/* Amount with icon and due amount */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="amount">Amount (₹)</Label>
                      {dueAmount !== null && (
                        <div
                          className={
                            "ml-4 whitespace-nowrap text-sm font-semibold " +
                            (dueAmount > 0
                              ? "text-red-500"
                              : dueAmount < 0
                              ? "text-green-500"
                              : "text-gray-500")
                          }
                        >
                          {dueAmount > 0
                            ? `Due Amount: ${formatCurrency(dueAmount)}`
                            : dueAmount < 0
                            ? `Credit Amount: ${formatCurrency(Math.abs(dueAmount))}`
                            : "No Due"}
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <IndianRupeeIcon className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                      <Field name="amount">
                        {({ field, form }: any) => (
                          <Input
                            id="amount"
                            type="text"
                            placeholder="Enter amount"
                            className="pl-8"
                            value={field.value ? formatIndianNumber(field.value) : ""}
                            onChange={e => {
                              // Remove commas for raw value
                              const rawValue = e.target.value.replace(/,/g, "");
                              // Only allow numbers
                              if (/^\d*$/.test(rawValue)) {
                                form.setFieldValue("amount", rawValue);
                              }
                            }}
                          />
                        )}
                      </Field>
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
                          {paymentMethods?.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <ErrorMessage name="paymentMode" component="p" className="text-red-500 text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Extra field for payment mode with icon */}
                  <div className="space-y-2">
                    {(() => {
                      const selectedMethod = paymentMethods.find(pm => pm.value === values.paymentMode);
                      if (selectedMethod && selectedMethod.extraFieldName) {
                        return (
                          <div>
                            <Label htmlFor={selectedMethod.extraFieldName}>{selectedMethod.extraFieldLabel}</Label>
                            <div className="relative mt-2">
                              {paymentModeIcons[selectedMethod.value] || null}
                              <Field
                                as={Input}
                                id={selectedMethod.extraFieldName}
                                name={selectedMethod.extraFieldName}
                                placeholder={selectedMethod.extraFieldLabel}
                                className="pl-8"
                              />
                              <ErrorMessage name={selectedMethod.extraFieldName} component="p" className="text-red-500 text-sm" />
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
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
              {/* Confirmation Dialog */}
              <Dialog
                open={showConfirm}
                onOpenChange={(open) => {
                  if (!open) handleCancel();
                }}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Submission</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to add this supplier payment?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleConfirm}>
                      Confirm
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