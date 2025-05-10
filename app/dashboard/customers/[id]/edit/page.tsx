"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"
import { serverGetCustomers, serverUpdateCustomer } from "@/services/serverApi"

interface CustomerData {
  _id: string
  name: string
  email: string
  number: string | number
  address: string
  customerType: "retail" | "wholesale"
  gstNumber: string
  creditLimit: string | number
  paymentTerms: "cod" | "net15" | "net30" | "net45"
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
}

export default function EditCustomerPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState<CustomerData>(defaultFormState)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchCustomer = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const res = await serverGetCustomers()
        const customerData = res?.data?.find((customer: any) => customer?._id === params?.id)

        if (!customerData) {
          setError("Customer not found")
          setIsLoading(false)
          return
        }

        setFormData({
          _id: customerData._id || "",
          name: customerData.name || "",
          email: customerData.email || "",
          number: customerData.number?.toString() || "",
          address: customerData.address || "",
          customerType: customerData.customerType || "retail",
          gstNumber: customerData.gstNumber || "",
          creditLimit: customerData.creditLimit?.toString() || "",
          paymentTerms: customerData.paymentTerms || "cod",
        })

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching customer:", error)
        setError("Failed to load customer data")
        setIsLoading(false)
      }
    }

    fetchCustomer()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: "retail" | "wholesale") => {
    setFormData((prev) => ({ ...prev, customerType: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      setIsSaving(true)

      const dataToSubmit = {
        ...formData,
        number: formData.number ? Number(formData.number) : 0,
        creditLimit: formData.creditLimit ? Number(formData.creditLimit) : 0,
      }

      const res = await serverUpdateCustomer(dataToSubmit)

      if (res?.success) {
        toast({
          title: "Success",
          description: "Customer updated successfully",
          variant: "default",
        })
        router.push(`/dashboard/customers`)
      } else {
        setError("Failed to update customer")
      }

      setIsSaving(false)
    } catch (error) {
      setIsSaving(false)
      setError("An error occurred while updating the customer")
      console.error("Error updating customer:", error)
    }
  }

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
    )
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" disabled className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Edit Customer</h2>
        </div>

        <Card className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2">Loading customer data...</p>
          </div>
        </Card>
      </div>
    )
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
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Update customer details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Customer Type</Label>
              <RadioGroup
                value={formData.customerType}
                onValueChange={(value) => handleRadioChange(value as "retail" | "wholesale")}
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
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="number">Phone Number</Label>
                <Input
                  id="number"
                  name="number"
                  type="tel"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  placeholder="+91 9876543210"
                  value={formData.number}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                placeholder="123 Main St, City, State"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            {formData.customerType === "wholesale" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="gstNumber">GST Number</Label>
                  <Input
                    id="gstNumber"
                    name="gstNumber"
                    placeholder="22AAAAA0000A1Z5"
                    value={formData.gstNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="creditLimit">Credit Limit (₹)</Label>
                    <Input
                      id="creditLimit"
                      name="creditLimit"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="10000"
                      value={formData.creditLimit}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Payment Terms</Label>
                    <Select
                      value={formData.paymentTerms}
                      onValueChange={(value) => handleSelectChange("paymentTerms", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cod">Cash on Delivery</SelectItem>
                        <SelectItem value="net15">Net 15 Days</SelectItem>
                        <SelectItem value="net30">Net 30 Days</SelectItem>
                        <SelectItem value="net45">Net 45 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

