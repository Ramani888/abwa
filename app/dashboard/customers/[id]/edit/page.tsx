"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Mail, Phone, MapPin, User, DollarSign, FileText, List } from "lucide-react";
import { serverGetCustomers, serverUpdateCustomer } from "@/services/serverApi";
import { Switch } from "@/components/ui/switch";

interface CustomerData {
  _id: string;
  name: string;
  email: string;
  number: string | number;
  address: string;
  customerType: "retail" | "wholesale";
  gstNumber: string;
  creditLimit: string | number;
  paymentTerms: "cod" | "net15" | "net30" | "net45";
  captureDate: string;
  isActive: boolean;
}

const defaultFormState: CustomerData = {
  _id: "",
  name: "",
  email: "",
  number: "",
  address: "",
  customerType: "retail",
  gstNumber: "",
  creditLimit: "",
  paymentTerms: "cod",
  captureDate: "",
  isActive: true,
};

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
  captureDate: Yup.string().required("Capture Date is required"),
  isActive: Yup.boolean(),
});

export default function EditCustomerPage({ params }: { params: { id: string } }) {
  const [initialValues, setInitialValues] = useState<CustomerData>(defaultFormState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchCustomer = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await serverGetCustomers();
      if (!res?.data || !Array.isArray(res.data)) {
        setError("Invalid server response");
        return;
      }
      const customerData = res.data.find((customer: any) => customer?._id === params?.id);
      if (!customerData) {
        setError("Customer not found");
        return;
      }
      setInitialValues({
        _id: customerData._id || "",
        name: customerData.name || "",
        email: customerData.email || "",
        number: customerData.number?.toString() || "",
        address: customerData.address || "",
        customerType: customerData.customerType || "retail",
        gstNumber: customerData.gstNumber || "",
        creditLimit: customerData.creditLimit?.toString() || "",
        paymentTerms: customerData.paymentTerms || "cod",
        captureDate: customerData.captureDate
          ? (typeof customerData.captureDate === "string"
              ? customerData.captureDate.slice(0, 10)
              : new Date(customerData.captureDate).toISOString().slice(0, 10))
          : "",
        isActive: typeof customerData.isActive === "boolean" ? customerData.isActive : true,
      });
    } catch (err: any) {
      setError("Failed to load customer data: " + (err?.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, [params?.id]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  const handleSubmit = useCallback(
    async (values: CustomerData, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
      setError(null);
      try {
        const dataToSubmit = {
          ...values,
          number: values.number ? Number(values.number) : 0,
          creditLimit: values.creditLimit ? Number(values.creditLimit) : 0,
          captureDate: values.captureDate ? new Date(values.captureDate) : new Date(),
          isActive: values.isActive,
        };
        const res = await serverUpdateCustomer(dataToSubmit);
        if (res?.success) {
          toast({
            title: "Success",
            description: "Customer updated successfully",
            variant: "default",
          });
          router.push(`/dashboard/customers`);
        } else {
          setError("Failed to update customer");
        }
      } catch (err: any) {
        setError("An error occurred while updating the customer: " + (err?.message || "Unknown error"));
      } finally {
        setSubmitting(false);
      }
    },
    [router]
  );

  if (error) {
    return (
      <div className="w-full">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Edit Customer</h2>
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
          <p className="mt-2">Loading customer data...</p>
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
        <h2 className="text-3xl font-bold tracking-tight">Edit Customer</h2>
      </div>

      <Card>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>Update customer details</CardDescription>
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
  );
}

