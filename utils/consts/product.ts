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

export const paymentMethods = [
  { label: "Cash", value: "cash", note: "Walk-in or cash-based transactions" },
  { label: "Card", value: "card", note: "Credit/debit card via POS machine" },
  { label: "UPI", value: "upi", note: "Google Pay, PhonePe, etc." },
  { label: "NEFT/RTGS", value: "neft_rtgs", note: "Bank transfer methods" },
  { label: "Cheque", value: "cheque", note: "Used by traders for bulk orders" },
  { label: "Credit", value: "credit", note: "No immediate payment; buy now, pay later" },
  { label: "Online Payment", value: "online_payment", note: "Generic for Razorpay/Paytm/etc. gateways" },
  { label: "Wallet", value: "wallet", note: "Paytm wallet, Amazon Pay, etc." },
  { label: "Other", value: "other", note: "Fallback for unsupported types" }
];

export const paymentStatuses = [
  { label: "Paid", value: "paid", description: "Full amount has been paid" },
  { label: "Unpaid", value: "unpaid", description: "No payment has been made yet" },
  { label: "Partial", value: "partial", description: "Partially paid; some balance remains" },
  { label: "Overpaid", value: "overpaid", description: "Paid more than required (rare but may occur)" },
  { label: "Refunded", value: "refunded", description: "Payment has been returned (for returns/cancellations)" }
];
