"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowLeft, Download, Printer, Share2 } from "lucide-react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import printJS from "print-js"

// Sample invoice data
type InvoiceItem = {
  id: string
  name: string
  batch: string
  expiry: string
  packing: string
  mrp: number
  rate: number
  quantity: number
  total: number
}

type Invoice = {
  id: string
  date: string
  customer: {
    name: string
    address: string
    gst: string
  }
  shop: {
    name: string
    address: string
    phone: string
    gst: string
  }
  items: InvoiceItem[]
  taxPercent: number
  paymentMethod: string
  paymentStatus: string
  subtotal: number
  tax: number
  total: number
}

const baseInvoice = {
  id: "10",
  date: "14-07-2020",
  customer: {
    name: "Rakeshbhai P. Bhutdiya",
    address: "P.O. & Village: Podi, Ta. Maliya Hatina, Dist. Junagadh",
    gst: "24AEDRF1245N1ZW",
  },
  shop: {
    name: "MANAN AGRO AGENCY",
    address: "Shop No. 12, Green Park, Center Point, Kodinar, Gujarat - 362720",
    phone: "9876543210",
    gst: "24AKPPP1434N1ZR",
  },
  items: [
    {
      id: "1",
      name: "Phosphorus Fertilizer",
      batch: "RX39",
      expiry: "10/2024",
      packing: "10 kg",
      mrp: 1500,
      rate: 1000,
      quantity: 10,
      total: 10000,
    },
    {
      id: "2",
      name: "Bio Potash 50%",
      batch: "RX45",
      expiry: "05/2024",
      packing: "500 ml",
      mrp: 1050,
      rate: 1050,
      quantity: 10,
      total: 10500,
    },
    {
      id: "3",
      name: "Microbial Power Gel",
      batch: "RX51",
      expiry: "04/2023",
      packing: "1 L",
      mrp: 2500,
      rate: 2500,
      quantity: 10,
      total: 25000,
    },
  ],
  taxPercent: 5,
  paymentMethod: "Cash",
  paymentStatus: "Paid",
}

const subtotal = baseInvoice.items.reduce((sum, item) => sum + item.total, 0)
const tax = +(subtotal * (baseInvoice.taxPercent / 100)).toFixed(2)
const total = subtotal + tax

const invoice: Invoice = {
  ...baseInvoice,
  subtotal,
  tax,
  total,
}

// Place your logo image in the public folder, e.g. /public/logo.png
// Place your signature image in the public folder, e.g. /public/signature.png

export default function InvoicePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [invoiceType, setInvoiceType] = useState<"retail" | "challan">("retail")
  const router = useRouter()
  const printRef = useRef<HTMLDivElement>(null)

  // Print using print-js library
  const handlePrint = () => {
    if (printRef.current) {
      printJS({
        printable: printRef.current.innerHTML,
        type: "raw-html",
        style: `
          body { background: white !important; }
          .rounded-2xl { border-radius: 1rem; }
          .bg-white { background: #fff; }
          .text-emerald-900 { color: #065f46; }
          .text-emerald-700 { color: #047857; }
          .border-emerald-300 { border-color: #6ee7b7; }
          .border-emerald-400 { border-color: #34d399; }
          .bg-emerald-50 { background: #ecfdf5; }
          .bg-emerald-100 { background: #d1fae5; }
          .font-bold { font-weight: bold; }
          .font-extrabold { font-weight: 800; }
          .uppercase { text-transform: uppercase; }
          .tracking-widest { letter-spacing: .1em; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px; border: 1px solid #e5e7eb; }
        `
      })
    }
  }

  // Download as PDF using jsPDF + html2canvas
  const handleDownload = async () => {
    setIsLoading(true)
    if (printRef.current) {
      const canvas = await html2canvas(printRef.current, { scale: 2 })
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      })
      const pageWidth = pdf.internal.pageSize.getWidth()
      // Calculate image dimensions to fit A4
      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pageWidth
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
      pdf.save(`invoice-${invoice.id}.pdf`)
    }
    setIsLoading(false)
  }

  return (
    <div className="max-w-5xl mx-auto p-6 print:p-2 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <div className="flex gap-2 items-center">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <span className="text-2xl font-extrabold text-emerald-900 tracking-wide">
            {invoiceType === "retail" ? "Retail Invoice" : "Delivery Challan"} #{invoice.id}
          </span>
        </div>
        <div className="flex gap-2">
          <select
            className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-emerald-300"
            value={invoiceType}
            onChange={e => setInvoiceType(e.target.value as "retail" | "challan")}
            disabled={isLoading}
          >
            <option value="retail">Retail Invoice</option>
            <option value="challan">Delivery Challan</option>
          </select>
          <Button onClick={handlePrint} variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button onClick={handleDownload} disabled={isLoading}>
            <Download className="mr-2 h-4 w-4" />
            {isLoading ? "Preparing..." : "Download PDF"}
          </Button>
        </div>
      </div>

      {/* Invoice Card */}
      <div ref={printRef} className="invoice-print-area">
        <Card className="rounded-2xl bg-white">
          <CardContent className="p-8">
            {/* Invoice Title at the very top, centered */}
            <div className="mb-6">
              <h2 className="text-3xl font-black text-emerald-700 text-center uppercase tracking-widest">
                {invoiceType === "retail" ? "Retail Invoice" : "Delivery Challan"}
              </h2>
              {/* Underline removed */}
            </div>

            {/* Agro Details and Logo Row */}
            <div className="flex flex-col md:flex-row items-center border-b pb-8 mb-8 gap-8">
              {/* Agro Details Left */}
              <div className="flex-1 text-left">
                <h1 className="text-3xl font-extrabold uppercase text-emerald-900 tracking-wider">{invoice.shop.name}</h1>
                <p className="text-base text-gray-700 mt-2">{invoice.shop.address}</p>
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <span className="text-base text-gray-700">Phone: <span className="font-semibold">{invoice.shop.phone}</span></span>
                  <span className="text-base text-gray-700">GSTIN: <span className="font-semibold">{invoice.shop.gst}</span></span>
                </div>
                <div className="mt-4">
                  <div className="text-base font-bold text-emerald-900">Owner: Manan Patel</div>
                  <div className="text-base font-bold text-emerald-900">+91 9876543210</div>
                  <div className="text-xs mt-2 text-emerald-800">Pesticide Licence No: 123456-PL-2025</div>
                  <div className="text-xs text-emerald-800">Seeds Licence No: 654321-SL-2025</div>
                </div>
              </div>
              {/* Logo Right */}
              <div className="flex-shrink-0 flex items-center">
                <img
                  src="/logo.png"
                  alt="Company Logo"
                  className="h-28 w-auto object-contain rounded border border-emerald-300 bg-white"
                  style={{ maxWidth: 140 }}
                />
              </div>
            </div>

            {/* Bill & Date */}
            <div className="flex flex-col md:flex-row justify-between gap-8 mt-2 border-b pb-6">
              <div>
                <p className="font-bold text-emerald-900"><span className="text-gray-700">Bill To:</span> {invoice.customer.name}</p>
                <p className="text-base text-gray-700">{invoice.customer.address}</p>
                <p className="text-base text-gray-700">GST: {invoice.customer.gst}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-emerald-900"><span className="text-gray-700">Invoice No:</span> {invoice.id}</p>
                <p className="text-base text-gray-700"><span className="font-bold text-emerald-900">Date:</span> {invoice.date}</p>
                <p className="text-base text-gray-700"><span className="font-bold text-emerald-900">Payment:</span> {invoice.paymentMethod}</p>
                <p className="text-base text-gray-700"><span className="font-bold text-emerald-900">Status:</span> {invoice.paymentStatus}</p>
              </div>
            </div>

            {/* Table */}
            <div className="mt-8 rounded-xl overflow-x-auto border border-emerald-300 bg-emerald-50/60">
              <Table>
                <TableHeader>
                  <TableRow className="bg-emerald-100">
                    <TableHead className="font-bold text-emerald-900">Product</TableHead>
                    <TableHead className="font-bold text-emerald-900">Batch</TableHead>
                    <TableHead className="font-bold text-emerald-900">Expiry</TableHead>
                    <TableHead className="font-bold text-emerald-900">Packing</TableHead>
                    <TableHead className="text-right font-bold text-emerald-900">MRP</TableHead>
                    <TableHead className="text-right font-bold text-emerald-900">Rate</TableHead>
                    <TableHead className="text-right font-bold text-emerald-900">Qty</TableHead>
                    <TableHead className="text-right font-bold text-emerald-900">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item, idx) => (
                    <TableRow key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-emerald-50"}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.batch}</TableCell>
                      <TableCell>{item.expiry}</TableCell>
                      <TableCell>{item.packing}</TableCell>
                      <TableCell className="text-right">₹{item.mrp}</TableCell>
                      <TableCell className="text-right">₹{item.rate}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">₹{item.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Totals */}
            <div className="mt-8 flex justify-end">
              <div className="w-full sm:w-1/2 md:w-1/3 border border-emerald-400 rounded-xl p-5 bg-emerald-50">
                <div className="flex justify-between text-emerald-900 text-base">
                  <span>Taxable Amount:</span>
                  <span>₹{invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-900 text-base">
                  <span>CGST ({invoice.taxPercent / 2}%):</span>
                  <span>₹{(invoice.tax / 2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-900 text-base">
                  <span>SGST ({invoice.taxPercent / 2}%):</span>
                  <span>₹{(invoice.tax / 2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-xl mt-3 border-t pt-3 text-emerald-900">
                  <span>Total:</span>
                  <span>₹{invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Signature */}
            <div className="flex justify-end mt-12">
              <div className="text-right">
                <div className="mb-2">
                  <img
                    src="/signature.png"
                    alt="Signature"
                    className="h-16 object-contain inline"
                    style={{ maxWidth: 150 }}
                  />
                </div>
                <div className="font-bold text-emerald-900">Authorized Signature</div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-10 text-center text-base border-t pt-5 text-emerald-700">
              {invoiceType === "retail" ? (
                <>
                  <p className="font-bold">Thank you for your business!</p>
                  <p>* Goods once sold will not be taken back or exchanged.</p>
                  <p className="mt-1">E. & O.E. | Subject to Junagadh Jurisdiction</p>
                </>
              ) : (
                <>
                  <p className="font-bold">This is a delivery challan for wholesale customer. No payment collected.</p>
                  <p className="mt-1">E. & O.E. | Subject to Junagadh Jurisdiction</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Add this to your global CSS (e.g., styles/globals.css):
/*
@media print {
  body * {
    visibility: hidden !important;
  }
  .invoice-print-area, .invoice-print-area * {
    visibility: visible !important;
  }
  .invoice-print-area {
    position: absolute !important;
    left: 0; top: 0; width: 100vw;
    background: white !important;
    z-index: 9999;
    padding: 0 !important;
    margin: 0 !important;
  }
  .print\:hidden {
    display: none !important;
  }
}
*/
