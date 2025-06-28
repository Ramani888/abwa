"use client"

import { useEffect, useRef, useState } from "react"
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
import { serverGetOrder } from "@/services/serverApi"
import { IOrder } from "@/types/order"
import { useAuth } from "@/components/auth-provider"

export default function InvoicePage({ params }: { params: { id: string } }) {
  const { owner } = useAuth();
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const printRef = useRef<HTMLDivElement>(null)
  const [orderData, setOrderData] = useState<IOrder | null>(null)

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
      pdf.save(`invoice-${orderData?._id}.pdf`)
    }
    setIsLoading(false)
  }

  // Share as PDF using Web Share API Level 2
  const handleShare = async () => {
    if (!navigator.canShare || !navigator.canShare({ files: [] })) {
      alert("Sharing PDF is not supported in this browser. Please download the PDF and share manually.");
      return;
    }
    setIsLoading(true);
    try {
      if (printRef.current) {
        const canvas = await html2canvas(printRef.current, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "pt",
          format: "a4",
        });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pageWidth;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

        // Get PDF as Blob
        const pdfBlob = pdf.output("blob");
        const file = new File(
          [pdfBlob],
          `invoice-${orderData?._id}.pdf`,
          { type: "application/pdf" }
        );

        await navigator.share({
          files: [file],
          title: orderData?.customerType === "retail" ? "Retail Invoice" : "Delivery Challan",
          text: "Here is your invoice PDF.",
        });
      }
    } catch (error) {
      alert("Failed to share PDF: " + error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await serverGetOrder();
        const findOrderData = res?.data?.find((order: any) => order?._id?.toString() === params?.id);
        setOrderData(findOrderData || null);
      } catch (error) {
        console.error("Error fetching order data:", error);
        setOrderData(null);
      }
      setIsLoading(false)
    }
    fetchData()
  }, [params.id])

  // Loading UI
  if (isLoading && !orderData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-emerald-700 text-xl font-bold animate-pulse">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading invoice...</p>
        </div>
      </div>
    )
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
            {orderData?.customerType === "retail" ? "Retail Invoice" : "Delivery Challan"} #{1}
          </span>
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePrint} variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleShare} variant="outline">
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
                {orderData?.customerType === "retail" ? "Retail Invoice" : "Delivery Challan"}
              </h2>
              {/* Underline removed */}
            </div>

            {/* Agro Details and Logo Row */}
            <div className="flex flex-col md:flex-row items-center border-b pb-8 mb-8 gap-8">
              {/* Agro Details Left */}
              <div className="flex-1 text-left">
                <h1 className="text-3xl font-extrabold uppercase text-emerald-900 tracking-wider">{owner?.shop?.name}</h1>
                <p className="text-base text-gray-700 mt-2">{owner?.shop?.address}</p>
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <span className="text-base text-gray-700">Phone: <span className="font-semibold">{owner?.shop?.number}</span></span>
                  <span className="text-base text-gray-700">GST: <span className="font-semibold">{owner?.shop?.gst}</span></span>
                </div>
                <div className="mt-4">
                  <div className="text-base font-bold text-emerald-900">{owner?.name}: {owner?.number}</div>
                  <div className="text-xs mt-2 text-emerald-800">Pesticide Licence No: 123456-PL-2025</div>
                  <div className="text-xs text-emerald-800">Seeds Licence No: 654321-SL-2025</div>
                </div>
              </div>
              {/* Logo Right */}
              <div className="flex-shrink-0 flex items-center">
                <img
                  src="/logo.png"
                  alt="Company Logo"
                  className="h-28 w-auto object-contain bg-white"
                  style={{ maxWidth: 140 }}
                />
              </div>
            </div>

            {/* Bill & Date */}
            <div className="flex flex-col md:flex-row justify-between gap-8 mt-2 border-b pb-6">
              <div>
                <p className="font-bold text-emerald-900"><span className="text-gray-700">Bill To:</span> {orderData?.customerData?.name}</p>
                <p className="text-base text-gray-700">{orderData?.customerData?.address}</p>
                <p className="text-base text-gray-700">Phone: {orderData?.customerData?.number}</p>
                {orderData?.customerType !== 'retail' && (
                  <p className="text-base text-gray-700">GST: {orderData?.customerData?.gstNumber}</p>
                )}
              </div>
              <div className="text-right space-y-1">
                <div className="flex justify-start gap-2">
                  <span className="font-bold text-emerald-900">
                    <span className="text-gray-700">
                      {orderData?.customerType === "retail" ? "Invoice No:" : "Challan No:"}
                    </span>
                  </span>
                  <span>{1}</span>
                </div>
                <div className="flex justify-start gap-2">
                  <span className="font-bold text-emerald-900">Date:</span>
                  <span>
                    {orderData?.captureDate
                      ? new Date(orderData.captureDate).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-start gap-2">
                  <span className="font-bold text-emerald-900">Payment:</span>
                  <span className="capitalize">{orderData?.paymentMethod || "-"}</span>
                </div>
                <div className="flex justify-start gap-2">
                  <span className="font-bold text-emerald-900">Status:</span>
                  <span className="capitalize">{orderData?.paymentStatus || "-"}</span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="mt-8 rounded-xl overflow-x-auto border border-emerald-300 bg-emerald-50/60">
              <Table>
                <TableHeader>
                  <TableRow className="bg-emerald-100">
                    <TableHead className="font-bold text-emerald-900">Product</TableHead>
                    <TableHead className="font-bold text-emerald-900">Size</TableHead>
                    <TableHead className="text-center font-bold text-emerald-900">MRP</TableHead>
                    <TableHead className="text-center font-bold text-emerald-900">Price</TableHead>
                    <TableHead className="text-center font-bold text-emerald-900">Unit</TableHead>
                    <TableHead className="text-center font-bold text-emerald-900">Carton</TableHead>
                    <TableHead className="text-center font-bold text-emerald-900">Qty</TableHead>
                    <TableHead className="text-center font-bold text-emerald-900">GST %</TableHead>
                    <TableHead className="text-center font-bold text-emerald-900">GST Amount</TableHead>
                    <TableHead className="text-right font-bold text-emerald-900">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderData?.products?.map((item, idx) => (
                    <TableRow key={item?._id} className={idx % 2 === 0 ? "bg-white" : "bg-emerald-50"}>
                      <TableCell>{item?.productData?.name}</TableCell>
                      <TableCell>{item?.variantData?.packingSize}</TableCell>
                      <TableCell className="text-center">₹{item?.mrp || item?.variantData?.mrp}</TableCell>
                      <TableCell className="text-center">₹{item?.price}</TableCell>
                      <TableCell className="text-center">{item?.unit}</TableCell>
                      <TableCell className="text-center">{item?.carton}</TableCell>
                      <TableCell className="text-center">{item?.quantity}</TableCell>
                      <TableCell className="text-center">{item?.gstRate}%</TableCell>
                      <TableCell className="text-center">₹{item?.gstAmount?.toFixed(2)}</TableCell>
                      <TableCell className="text-right">₹{item?.total?.toFixed(2)}</TableCell>
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
                  <span>₹{orderData?.subTotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-900 text-base">
                  <span>Total GST:</span>
                  <span>₹{((orderData?.totalGst ?? 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-900 text-base">
                  <span>Round Off:</span>
                  <span>₹{((orderData?.roundOff ?? 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-xl mt-3 border-t pt-3 text-emerald-900">
                  <span>Total:</span>
                  <span>₹{orderData?.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Signature */}
            <div className="flex justify-end mt-6">
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
              {orderData?.customerType === "retail" ? (
                <>
                  <p>We always try to provide genuine and trustworthy information, but since these claims are not prepared under our supervision, we will not be responsible in any way, and no monetary compensation will be given.</p>
                  <p className="mt-1">E. & O.E. | Subject to Junagadh Jurisdiction</p>
                </>
              ) : (
                <>
                  <p className="font-bold">This is a delivery challan for wholesale customer.</p>
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
