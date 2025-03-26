"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    shopName: "Green Harvest Agro Shop",
    currency: "inr",
    language: "en",
    timezone: "Asia/Kolkata",
  })

  const [invoiceSettings, setInvoiceSettings] = useState({
    invoicePrefix: "INV-",
    termsAndConditions:
      "1. All sales are final.\n2. Payment due within 30 days.\n3. Goods once sold cannot be returned.",
    showLogo: true,
    showSignature: true,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    lowStockAlerts: true,
    orderConfirmations: true,
    paymentReminders: true,
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (section: string, name: string, value: string) => {
    if (section === "general") {
      setGeneralSettings((prev) => ({ ...prev, [name]: value }))
    } else if (section === "invoice") {
      setInvoiceSettings((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSwitchChange = (section: string, name: string, checked: boolean) => {
    if (section === "invoice") {
      setInvoiceSettings((prev) => ({ ...prev, [name]: checked }))
    } else if (section === "notification") {
      setNotificationSettings((prev) => ({ ...prev, [name]: checked }))
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setInvoiceSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Here you would implement actual settings update logic
    // For now, we'll just simulate it
    setTimeout(() => {
      setIsLoading(false)
      alert("Settings updated successfully!")
    }, 1000)
  }

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Settings</h2>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="invoice">Invoice</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure basic settings for your shop</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shopName">Shop Name</Label>
                  <Input
                    id="shopName"
                    name="shopName"
                    value={generalSettings.shopName}
                    onChange={handleGeneralChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={generalSettings.currency}
                      onValueChange={(value) => handleSelectChange("general", "currency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inr">Indian Rupee (₹)</SelectItem>
                        <SelectItem value="usd">US Dollar ($)</SelectItem>
                        <SelectItem value="eur">Euro (€)</SelectItem>
                        <SelectItem value="gbp">British Pound (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={generalSettings.language}
                      onValueChange={(value) => handleSelectChange("general", "language", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="mr">Marathi</SelectItem>
                        <SelectItem value="gu">Gujarati</SelectItem>
                        <SelectItem value="ta">Tamil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={generalSettings.timezone}
                    onValueChange={(value) => handleSelectChange("general", "timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">India (GMT+5:30)</SelectItem>
                      <SelectItem value="America/New_York">New York (GMT-4)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT+1)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoice">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Settings</CardTitle>
                <CardDescription>Customize your invoice appearance and content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invoicePrefix">Invoice Number Prefix</Label>
                  <Input
                    id="invoicePrefix"
                    name="invoicePrefix"
                    value={invoiceSettings.invoicePrefix}
                    onChange={handleGeneralChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="termsAndConditions">Terms and Conditions</Label>
                  <textarea
                    id="termsAndConditions"
                    name="termsAndConditions"
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={invoiceSettings.termsAndConditions}
                    onChange={handleTextareaChange}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showLogo">Show Shop Logo on Invoice</Label>
                    <Switch
                      id="showLogo"
                      checked={invoiceSettings.showLogo}
                      onCheckedChange={(checked) => handleSwitchChange("invoice", "showLogo", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="showSignature">Show Signature on Invoice</Label>
                    <Switch
                      id="showSignature"
                      checked={invoiceSettings.showSignature}
                      onCheckedChange={(checked) => handleSwitchChange("invoice", "showSignature", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => handleSwitchChange("notification", "emailNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smsNotifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => handleSwitchChange("notification", "smsNotifications", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="lowStockAlerts">Low Stock Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified when products are running low</p>
                    </div>
                    <Switch
                      id="lowStockAlerts"
                      checked={notificationSettings.lowStockAlerts}
                      onCheckedChange={(checked) => handleSwitchChange("notification", "lowStockAlerts", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="orderConfirmations">Order Confirmations</Label>
                      <p className="text-sm text-muted-foreground">Get notified when new orders are placed</p>
                    </div>
                    <Switch
                      id="orderConfirmations"
                      checked={notificationSettings.orderConfirmations}
                      onCheckedChange={(checked) => handleSwitchChange("notification", "orderConfirmations", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="paymentReminders">Payment Reminders</Label>
                      <p className="text-sm text-muted-foreground">Get notified about pending payments</p>
                    </div>
                    <Switch
                      id="paymentReminders"
                      checked={notificationSettings.paymentReminders}
                      onCheckedChange={(checked) => handleSwitchChange("notification", "paymentReminders", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  )
}

