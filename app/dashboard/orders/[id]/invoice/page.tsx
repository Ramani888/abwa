"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Printer, Share2, ArrowLeft } from "lucide-react"

// Mock data for the invoice
const invoice = {
  id: "INV-001",
  orderId: "ORD-001",
  date: "2023-03-15",
  dueDate: "2023-03-30",
  customer: {
    name: "Rahul Sharma",
    address: "123 Main St, Agricity",
    phone: "+91 9876543210",
    email: "rahul@example.com",
  },
  shop: {
    name: "Green Harvest Agro Shop",
    address: "456 Farm Road, Agricity",
    phone: "+91 9876543200",
    email: "contact@greenharvest.com",
    gst: "22AAAAA0000A1Z5",
  },
  items: [
    {
      id: "1",
      name: "Organic Fertilizer",
      quantity: 2,
      price: 850,
      total: 1700,
    },
    {
      id: "2",
      name: "Garden Tools Set",
      quantity: 1,
      price: 800,
      total: 800,
    },
  ],
  subtotal: 2500,
  tax: 125,
  total: 2625,
  paymentMethod: "Cash",
  paymentStatus: "Paid",
}

export default function InvoicePage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    setIsLoading(true)

    // Here you would implement actual PDF generation and download
    // For now, we'll just simulate it
    setTimeout(() => {
      setIsLoading(false)
      alert("Invoice downloaded successfully!")
    }, 1000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Invoice #{invoice.id}</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={() => {}}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button onClick={handleDownload} disabled={isLoading}>
            <Download className="mr-2 h-4 w-4" />
            {isLoading ? "Downloading..." : "Download PDF"}
          </Button>
        </div>
      </div>

      <Card className="print:shadow-none">
        <CardContent className="p-6">
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex justify-between">
              <div>
                <h1 className="text-2xl font-bold">{invoice.shop.name}</h1>
                <p className="text-muted-foreground">{invoice.shop.address}</p>
                <p className="text-muted-foreground">{invoice.shop.phone}</p>
                <p className="text-muted-foreground">{invoice.shop.email}</p>
                {invoice.shop.gst && <p className="text-muted-foreground">GST: {invoice.shop.gst}</p>}
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold">INVOICE</h2>
                <p>#{invoice.id}</p>
                <p>Order: #{invoice.orderId}</p>
                <p>Date: {invoice.date}</p>
                <p>Due Date: {invoice.dueDate}</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-2">Bill To:</h3>
                <p>{invoice.customer.name}</p>
                <p>{invoice.customer.address}</p>
                <p>{invoice.customer.phone}</p>
                <p>{invoice.customer.email}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Payment Method:</h3>
                <p>{invoice.paymentMethod}</p>
                <h3 className="font-semibold mb-2 mt-4">Payment Status:</h3>
                <p>{invoice.paymentStatus}</p>
              </div>
            </div>

            {/* Items */}
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">₹{item.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Summary */}
            <div className="flex justify-end">
              <div className="w-1/2">
                <div className="flex justify-between py-2">
                  <span>Subtotal:</span>
                  <span>₹{invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Tax (5%):</span>
                  <span>₹{invoice.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-4 mt-4">
              <p className="text-center text-muted-foreground">Thank you for your business!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

