"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Printer, Download } from "lucide-react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import printJS from "print-js"
import { useRouter } from "next/navigation"

// Helper to convert amount to words (simple version)
function numberToWords(num: number): string {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ]
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

  if (num === 0) return "Zero"
  if (num < 20) return a[num]
  if (num < 100) return b[Math.floor(num / 10)] + (num % 10 ? " " + a[num % 10] : "")
  if (num < 1000) return a[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " and " + numberToWords(num % 100) : "")
  if (num < 100000) return numberToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + numberToWords(num % 1000) : "")
  if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + " Lakh" + (num % 100000 ? " " + numberToWords(num % 100000) : "")
  return num.toString()
}

const AGRO_INFO = {
  logo: "/logo.png", // Replace with your logo path
  name: "Agro Seeds Pvt. Ltd.",
  address: "123 Agro Street, Ahmedabad, Gujarat, 380001",
  phone: "+91 98765 43210",
  email: "info@agroseeds.com"
}

const staticSlip = {
  _id: "PAY123456",
  slipNo: "301",
  slipName: "Payment Slip",
  customerName: "Raman Kumar",
  customerNumber: "9876543210",
  customerAddress: "Ahmedabad",
  paymentDate: "2025-07-24",
  amount: 10000,
  paymentMethod: "Cash",
  reference: "TXN001234",
  remarks: "Advance Payment for Seeds",
  byName: "Raman Kumar",
  byCity: "Ahmedabad"
}

export default function CustomerPaymentSlipPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const printRef = useRef<HTMLDivElement>(null)

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
          .font-bold { font-weight: bold; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .slip-table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; }
          .slip-table th, .slip-table td { padding: 8px 12px; border-bottom: 1px solid #e5e7eb; text-align: left; }
          .slip-table th { background: #f9fafb; font-weight: 600; }
        `
      })
    }
  }

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
      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pageWidth
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
      pdf.save(`payment-slip-${staticSlip._id}.pdf`)
    }
    setIsLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 print:p-2 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 print:hidden">
        <div className="flex gap-2 items-center">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <span className="text-lg sm:text-2xl font-extrabold text-emerald-900 tracking-wide">
            Customer Payment Slip
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button onClick={handlePrint} variant="outline" className="w-full sm:w-auto">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownload} disabled={isLoading} className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            {isLoading ? "Preparing..." : "Download PDF"}
          </Button>
        </div>
      </div>

      {/* Printable Card */}
      <div ref={printRef} className="payment-slip-print-area">
        <Card className="rounded-xl sm:rounded-2xl bg-white border border-gray-300 shadow-md">
          <CardContent className="p-8 text-base text-gray-900 leading-relaxed">
            {/* Agro Logo and Name in One Line with Border */}
            <div className="flex items-center border border-emerald-200 rounded-lg px-4 py-2 mb-4 bg-emerald-50 shadow-sm">
              <img src={AGRO_INFO.logo} alt="Agro Logo" className="h-10 w-10 object-contain mr-3" />
              <span className="text-xl font-bold text-emerald-900">{AGRO_INFO.name}</span>
            </div>
            {/* Address and Contact */}
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="text-xs text-gray-700">
                  {AGRO_INFO.address}
                </div>
                <div className="text-xs text-gray-700">
                  {AGRO_INFO.phone} | {AGRO_INFO.email}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-800 text-sm">
                  Slip No: <span className="font-mono">{staticSlip.slipNo}</span>
                </div>
                <div className="text-xs text-gray-600">
                  Date: {new Date(staticSlip.paymentDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Slip Title */}
            <div className="text-center text-2xl font-bold uppercase mb-6 tracking-wide text-emerald-900 letter-spacing-wider">
              {staticSlip.slipName}
            </div>

            {/* Details Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-8">
              <div>
                <div className="text-xs text-gray-500 font-semibold">Customer Name</div>
                <div className="text-base font-medium text-gray-900">{staticSlip.customerName}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">By Name</div>
                <div className="text-base font-medium text-gray-900">{staticSlip.byName}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">By Name City</div>
                <div className="text-base font-medium text-gray-900">{staticSlip.byCity}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">Phone</div>
                <div className="text-base font-medium text-gray-900">{staticSlip.customerNumber}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">City/Village</div>
                <div className="text-base font-medium text-gray-900">{staticSlip.customerAddress}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">Payment Mode</div>
                <div className="text-base font-medium text-gray-900">{staticSlip.paymentMethod}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">Reference No</div>
                <div className="text-base font-medium text-gray-900">{staticSlip.reference}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">Remarks</div>
                <div className="text-base font-medium text-gray-900">{staticSlip.remarks}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-xs text-gray-500 font-semibold">Amount in Words</div>
                <div className="text-base font-medium text-gray-900">{numberToWords(staticSlip.amount)} Rupees Only</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-xs text-gray-500 font-semibold">Amount</div>
                <div className="text-lg font-bold text-emerald-900">₹{staticSlip.amount.toLocaleString()} /-</div>
              </div>
            </div>

            <div className="flex justify-between items-end mt-10">
              <div className="text-xs text-gray-500">
                <strong>Note:</strong> This is a system generated slip. Please keep it for your records.
              </div>
              <span className="border-t border-black px-8 text-base font-semibold text-gray-700">Authorized Signature</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
