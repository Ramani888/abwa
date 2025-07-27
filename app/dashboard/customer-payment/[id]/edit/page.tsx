"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, User, FileText, List, IndianRupeeIcon, CreditCard, Landmark, QrCode, Receipt, Banknote } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { serverGetCustomerPayment, serverGetCustomers, serverUpdateCustomerPayment } from "@/services/serverApi";
import { paymentMethods } from "@/utils/consts/product";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { getCustomerPayments } from "@/lib/features/customerPaymentSlice";
import { formatCurrency, formatIndianNumber } from "@/utils/helpers/general";
import { RootState } from "@/lib/store";

interface CustomerPaymentData {
  _id: string;
  customerId: string;
  captureDate: string;
  amount: number;
  paymentType: string;
  paymentMode: string;
  cardNumber?: string;
  upiTransactionId?: string;
  bankReferenceNumber?: string;
  chequeNumber?: string;
  gatewayTransactionId?: string;
}

const defaultFormState: CustomerPaymentData = {
  _id: "",
  customerId: "",
  captureDate: "",
  amount: 0,
  paymentType: "",
  paymentMode: "",
  cardNumber: "",
  upiTransactionId: "",
  bankReferenceNumber: "",
  chequeNumber: "",
  gatewayTransactionId: "",
};

const validationSchema = Yup.object({
  customerId: Yup.string().required("Customer is required"),
  captureDate: Yup.string().required("Date is required"),
  amount: Yup.number().required("Amount is required"),
  paymentType: Yup.string().required("Payment Type is required"),
  paymentMode: Yup.string().required("Payment Mode is required"),
});

// Payment mode icons
const paymentModeIcons: Record<string, React.ReactNode> = {
  card: <CreditCard className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />,
  upi: <QrCode className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />,
  neft_rtgs: <Landmark className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />,
  cheque: <Receipt className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />,
  online_payment: <Banknote className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />,
};

export default function EditCustomerPaymentPage({ params }: { params: { id: string } }) {
  const dispatch = useDispatch<AppDispatch>()
  const [initialValues, setInitialValues] = useState<CustomerPaymentData>(defaultFormState);
  const [customerData, setCustomerData] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState<any>(null);
  const router = useRouter();
  const { customerPayment } = useSelector((state: RootState) => state.customerPayment);
  const { orders } = useSelector((state: RootState) => state.orders || { orders: [] });
  const [dueAmount, setDueAmount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCustomerPayment = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await serverGetCustomerPayment();
        const customerPaymentData = res?.data?.find((item: any) => item?._id === params?.id);

        if (!customerPaymentData) {
          setError("Customer payment not found");
          setIsLoading(false);
          return;
        }

        setInitialValues({
          _id: customerPaymentData?._id || "",
          customerId: customerPaymentData?.customerId || "",
          captureDate: customerPaymentData?.captureDate?.slice(0, 10) || "",
          amount: customerPaymentData?.amount || 0,
          paymentType: customerPaymentData?.paymentType || "",
          paymentMode: customerPaymentData?.paymentMode || "",
          cardNumber: customerPaymentData?.cardNumber || "",
          upiTransactionId: customerPaymentData?.upiTransactionId || "",
          bankReferenceNumber: customerPaymentData?.bankReferenceNumber || "",
          chequeNumber: customerPaymentData?.chequeNumber || "",
          gatewayTransactionId: customerPaymentData?.gatewayTransactionId || "",
        });
        setSelectedCustomer(customerPaymentData?.customerId || "");
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching customer:", error);
        setError("Failed to load customer data");
        setIsLoading(false);
      }
    };

    fetchCustomerPayment();
  }, [params.id]);

  const getCustomerData = async () => {
    try {
      setIsLoading(true);
      const res = await serverGetCustomers();
      setCustomerData(res?.data || []);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setCustomerData([]);
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    getCustomerData();
  }, []);

  // Update due amount when customer is selected or data changes
  useEffect(() => {
    if (!selectedCustomer) {
      setDueAmount(null);
      return;
    }
    const filteredCustomerPayment = customerPayment?.filter((data: any) => data.customerId === selectedCustomer);
    const filteredCustomerOrders = orders?.filter((order: any) => order.customerId === selectedCustomer);

    const paidTotal = filteredCustomerPayment?.reduce(
      (sum: number, data: any) => sum + (data.amount || 0),
      0
    ) || 0;

    const totalAmount = filteredCustomerOrders?.reduce(
      (sum: number, order: any) => sum + (order.total || 0),
      0
    ) || 0;

    const pendingTotal = totalAmount - paidTotal;
    setDueAmount(pendingTotal ?? null);
  }, [selectedCustomer, customerPayment, orders]);

  const handleSubmit = async (
    values: CustomerPaymentData,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setError(null);

    try {
      const selectedMethod = paymentMethods.find(pm => pm.value === values.paymentMode);
      const dataToSubmit: any = {
        ...values,
        amount: values.amount ? Number(values.amount) : 0,
        captureDate: values.captureDate ? new Date(values.captureDate) : new Date(),
      };
      // Remove all possible extra fields first
      delete dataToSubmit.cardNumber;
      delete dataToSubmit.upiTransactionId;
      delete dataToSubmit.bankReferenceNumber;
      delete dataToSubmit.chequeNumber;
      delete dataToSubmit.gatewayTransactionId;
      // Add only the relevant extra field if present
      if (selectedMethod && selectedMethod.extraFieldName) {
        dataToSubmit[selectedMethod.extraFieldName] = values[selectedMethod.extraFieldName as keyof CustomerPaymentData];
      }

      const res = await serverUpdateCustomerPayment(dataToSubmit);

      if (res?.success) {
        toast({
          title: "Success",
          description: "Customer payment updated successfully",
          variant: "default",
        });
        router.push(`/dashboard/customer-payment`);
      } else {
        setError("Failed to update customer payment");
      }
      dispatch(getCustomerPayments())
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      setError("An error occurred while updating the customer payment");
      console.error("Error updating customer payment:", error);
    }
  };

  // Confirmation dialog handlers
  const handleFormSubmit = (values: CustomerPaymentData, actions: any) => {
    setPendingSubmit({ values, actions });
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (pendingSubmit) {
      handleSubmit(pendingSubmit.values, pendingSubmit.actions);
      setPendingSubmit(null);
      setShowConfirm(false);
    }
  };

  const handleCancel = () => {
    if (pendingSubmit?.actions) {
      pendingSubmit.actions.setSubmitting(false);
    }
    setPendingSubmit(null);
    setShowConfirm(false);
  };

  if (error) {
    return (
      <div className="w-full">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Edit Customer Payment</h2>
        </div>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading customer payment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Edit Customer Payment</h2>
      </div>

      <Card className="w-full mx-auto">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <CardHeader>
                <CardTitle>Customer Payment Information</CardTitle>
                <CardDescription>Edit customer payment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Customer Dropdown with icon */}
                <div className="space-y-2">
                  <Label htmlFor="customerId">Select Customer</Label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                    <Select
                      value={values.customerId}
                      onValueChange={(val) => {
                        setSelectedCustomer(val);
                        setFieldValue("customerId", val);
                      }}
                    >
                      <SelectTrigger className="pl-8">
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customerData?.map((customer) => (
                          <SelectItem key={customer?._id} value={customer?._id}>
                            {customer?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <ErrorMessage name="customerId" component="p" className="text-red-500 text-sm" />
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

                {/* Extra field for payment mode with icon */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <Button type="button" variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Update Payment</span>
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
                    <DialogTitle>Confirm Update</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to update this customer payment?
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
  );
}

