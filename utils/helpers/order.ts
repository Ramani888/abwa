import { PaymentStatus, PaymentType } from "../consts/order";

export const getPaymentType = (paymentStatus: string) => {
    switch (paymentStatus) {
    case PaymentStatus.Paid:
        return PaymentType.Full;
    case PaymentStatus.Overpaid:
        return PaymentType.Advance;
    case PaymentStatus.Partial:
        return PaymentType.Partial;
    case PaymentStatus.Refunded:
        return PaymentType.Partial;
    default:
        return PaymentType.Full;
    }
}