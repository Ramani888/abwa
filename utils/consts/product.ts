export const units = [
  { name: "Kilogram", symbol: "kg", description: "For solids like fertilizers, seeds, etc." },
  { name: "Gram", symbol: "g", description: "For small packs of seeds or pesticides." },
  { name: "Quintal", symbol: "q", description: "Commonly used in bulk trading." },
  { name: "Litre", symbol: "L", description: "For liquids like pesticides, insecticides." },
  { name: "Millilitre", symbol: "ml", description: "For small chemical doses." },
  { name: "Box", symbol: "box", description: "For packed tools or grouped items." },
  { name: "Bottle", symbol: "bottle", description: "For bottled liquids like tonics, etc." },
  { name: "Bag", symbol: "bag", description: "For items like 50kg fertilizer bags." },
  { name: "Packet", symbol: "pkt", description: "For seed packets." },
  { name: "Unit", symbol: "unit", description: "Used for tools/equipment (e.g., pump)." },
  { name: "Piece", symbol: "pcs", description: "For individual small items." }
];

export const packingSizesByUnit = [
  {
    unit: "Kilogram",
    symbol: "kg",
    packingSizes: [
      { label: "500 g", value: 500 },         // 0.5 kg
      { label: "1 kg", value: 1000 },
      { label: "2 kg", value: 2000 },
      { label: "5 kg", value: 5000 },
      { label: "10 kg", value: 10000 },
      { label: "25 kg", value: 25000 },
      { label: "50 kg", value: 50000 }
    ]
  },
  {
    unit: "Gram",
    symbol: "g",
    packingSizes: [
      { label: "10 g", value: 10 },
      { label: "50 g", value: 50 },
      { label: "100 g", value: 100 },
      { label: "250 g", value: 250 },
      { label: "500 g", value: 500 }
    ]
  },
  {
    unit: "Quintal",
    symbol: "q",
    packingSizes: [
      { label: "1 Quintal", value: 100000 },
      { label: "2 Quintal", value: 200000 },
      { label: "5 Quintal", value: 500000 }
    ]
  },
  {
    unit: "Litre",
    symbol: "L",
    packingSizes: [
      { label: "500 ml", value: 500 },
      { label: "1 L", value: 1000 },
      { label: "2 L", value: 2000 },
      { label: "5 L", value: 5000 },
      { label: "10 L", value: 10000 },
      { label: "20 L", value: 20000 }
    ]
  },
  {
    unit: "Millilitre",
    symbol: "ml",
    packingSizes: [
      { label: "50 ml", value: 50 },
      { label: "100 ml", value: 100 },
      { label: "250 ml", value: 250 },
      { label: "500 ml", value: 500 }
    ]
  },
  {
    unit: "Box",
    symbol: "box",
    packingSizes: [
      { label: "1 Box", value: 1 },
      { label: "2 Box", value: 2 },
      { label: "5 Box", value: 5 },
      { label: "10 Box", value: 10 }
    ]
  },
  {
    unit: "Bottle",
    symbol: "bottle",
    packingSizes: [
      { label: "100 ml", value: 100 },
      { label: "250 ml", value: 250 },
      { label: "500 ml", value: 500 },
      { label: "1000 ml", value: 1000 }
    ]
  },
  {
    unit: "Bag",
    symbol: "bag",
    packingSizes: [
      { label: "5 kg", value: 5000 },
      { label: "10 kg", value: 10000 },
      { label: "25 kg", value: 25000 },
      { label: "40 kg", value: 40000 },
      { label: "50 kg", value: 50000 }
    ]
  },
  {
    unit: "Packet",
    symbol: "pkt",
    packingSizes: [
      { label: "10 g", value: 10 },
      { label: "50 g", value: 50 },
      { label: "100 g", value: 100 },
      { label: "250 g", value: 250 }
    ]
  },
  {
    unit: "Unit",
    symbol: "unit",
    packingSizes: [
      { label: "1 Unit", value: 1 }
    ]
  },
  {
    unit: "Piece",
    symbol: "pcs",
    packingSizes: [
      { label: "1 pc", value: 1 },
      { label: "2 pcs", value: 2 },
      { label: "5 pcs", value: 5 },
      { label: "10 pcs", value: 10 },
      { label: "20 pcs", value: 20 }
    ]
  }
];

// export const paymentMethods = [
//   { label: "Cash", value: "cash", note: "Walk-in or cash-based transactions" },
//   { label: "Card", value: "card", note: "Credit/debit card via POS machine" },
//   { label: "UPI", value: "upi", note: "Google Pay, PhonePe, etc." },
//   { label: "NEFT/RTGS", value: "neft_rtgs", note: "Bank transfer methods" },
//   { label: "Cheque", value: "cheque", note: "Used by traders for bulk orders" },
//   { label: "Credit", value: "credit", note: "No immediate payment; buy now, pay later" },
//   { label: "Online Payment", value: "online_payment", note: "Generic for Razorpay/Paytm/etc. gateways" },
//   { label: "Wallet", value: "wallet", note: "Paytm wallet, Amazon Pay, etc." },
//   { label: "Other", value: "other", note: "Fallback for unsupported types" }
// ];

export const paymentMethods = [
  {
    label: "Cash",
    value: "cash",
    note: "For walk-in customers or direct cash payments.",
    extraFieldName: null,
    extraFieldLabel: null
  },
  {
    label: "Card (Credit/Debit)",
    value: "card",
    note: "Payments via POS machine using credit or debit card.",
    extraFieldName: "cardNumber",
    extraFieldLabel: "Card Number (Last 4 Digits)"
  },
  {
    label: "UPI",
    value: "upi",
    note: "Unified Payments Interface - Google Pay, PhonePe, BHIM, etc.",
    extraFieldName: "upiTransactionId",
    extraFieldLabel: "UPI Transaction ID"
  },
  {
    label: "Bank Transfer (NEFT/RTGS)",
    value: "neft_rtgs",
    note: "Direct bank transfers via NEFT or RTGS.",
    extraFieldName: "bankReferenceNumber",
    extraFieldLabel: "Bank Reference No. / UTR"
  },
  {
    label: "Cheque",
    value: "cheque",
    note: "Used by customers for post-dated or bulk order payments.",
    extraFieldName: "chequeNumber",
    extraFieldLabel: "Cheque Number"
  },
  {
    label: "Online Payment Gateway",
    value: "online_payment",
    note: "Payments through gateways like Razorpay, Paytm, etc.",
    extraFieldName: "gatewayTransactionId",
    extraFieldLabel: "Transaction ID"
  }
];

export const paymentStatuses = [
  { label: "Paid", value: "paid", description: "Full amount has been paid" },
  { label: "Unpaid", value: "unpaid", description: "No payment has been made yet" },
  { label: "Partial", value: "partial", description: "Partially paid; some balance remains" },
  { label: "Overpaid", value: "overpaid", description: "Paid more than required (rare but may occur)" },
  // { label: "Refunded", value: "refunded", description: "Payment has been returned (for returns/cancellations)" }
];
