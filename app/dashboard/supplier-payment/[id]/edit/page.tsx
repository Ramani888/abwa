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
import { ArrowLeft, User, FileText, List, DollarSign } from "lucide-react";
import { serverGetCustomerPayment, serverGetCustomers, serverGetSupplier, serverGetSupplierPayment, serverUpdateCustomerPayment, serverUpdateSupplierPayment } from "@/services/serverApi";

interface SupplierPaymentData {
  _id: string;
  supplierId: string;
  captureDate: string;
  amount: number;
  paymentType: string;
  paymentMode: string;
}

const defaultFormState: SupplierPaymentData = {
  _id: "",
  supplierId: "",
  captureDate: "",
  amount: 0,
  paymentType: "",
  paymentMode: "",
};

const validationSchema = Yup.object({
  supplierId: Yup.string().required("Supplier is required"),
  captureDate: Yup.string().required("Date is required"),
  amount: Yup.number().required("Amount is required"),
  paymentType: Yup.string().required("Payment Type is required"),
  paymentMode: Yup.string().required("Payment Mode is required"),
});

export default function EditSupplierPaymentPage({ params }: { params: { id: string } }) {
  const [initialValues, setInitialValues] = useState<SupplierPaymentData>(defaultFormState);
  const [supplierData, setSupplierData] = useState<any[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSupplierPayment = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await serverGetSupplierPayment();
        const supplierPaymentData = res?.data?.find((item: any) => item?._id === params?.id);

        if (!supplierPaymentData) {
          setError("Supplier payment not found");
          setIsLoading(false);
          return;
        }

        setInitialValues({
          _id: supplierPaymentData?._id || "",
          supplierId: supplierPaymentData?.supplierId || "",
          captureDate: supplierPaymentData?.captureDate?.slice(0, 10) || "",
          amount: supplierPaymentData?.amount || 0,
          paymentType: supplierPaymentData?.paymentType || "",
          paymentMode: supplierPaymentData?.paymentMode || "",
        });
        setSelectedSupplier(supplierPaymentData?.supplierId || "");
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching supplier:", error);
        setError("Failed to load supplier  data");
        setIsLoading(false);
      }
    };

    fetchSupplierPayment();
  }, [params.id]);

  const getSupplierData = async () => {
    try {
      setIsLoading(true);
      const res = await serverGetSupplier();
      setSupplierData(res?.data || []);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setSupplierData([]);
      console.error("Error fetching suppliers:", error);
    }
  };

  useEffect(() => {
    getSupplierData();
  }, []);

  const handleSubmit = async (
    values: SupplierPaymentData,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setError(null);

    try {
      const dataToSubmit = {
        ...values,
        amount: values.amount ? Number(values.amount) : 0,
        captureDate: values.captureDate ? new Date(values.captureDate) : new Date(),
      };

      const res = await serverUpdateSupplierPayment(dataToSubmit);

      if (res?.success) {
        toast({
          title: "Success",
          description: "Supplier payment updated successfully",
          variant: "default",
        });
        router.push(`/dashboard/supplier-payment`);
      } else {
        setError("Failed to update supplier payment");
      }

      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      setError("An error occurred while updating the supplier payment");
      console.error("Error updating supplier payment:", error);
    }
  };

  if (error) {
    return (
      <div className="w-full">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Edit Supplier Payment</h2>
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
          <p className="mt-2">Loading supplier payment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-0">
      <div className="flex flex-row items-center mb-6 gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()
          }
          className="mr-0 sm:mr-4 mb-2 sm:mb-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Edit Supplier Payment</h2>
      </div>

      <Card className="w-full mx-auto">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <CardHeader>
                <CardTitle>Supplier Payment Information</CardTitle>
                <CardDescription>Edit supplier payment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Supplier Dropdown with icon */}
                <div className="space-y-2">
                  <Label htmlFor="supplierId">Select Supplier</Label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                    <Select
                      value={values.supplierId}
                      onValueChange={(val) => {
                        setSelectedSupplier(val);
                        setFieldValue("supplierId", val);
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
                      <DollarSign className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
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
                      <DollarSign className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                      <Select
                        value={values.paymentMode}
                        onValueChange={(val) => setFieldValue("paymentMode", val)}
                      >
                        <SelectTrigger className="pl-8">
                          <SelectValue placeholder="Select payment mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="card">Card</SelectItem>
                          <SelectItem value="upi">UPI</SelectItem>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
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
                      <span>Updating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Update Payment</span>
                    </div>
                  )}
                </Button>
              </CardFooter>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
}

