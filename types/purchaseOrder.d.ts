import { IProduct } from "./product";
import { ISupplier } from "./supplier";

export interface IPurchaseOrder {
    _id?: string;
    ownerId?: string; // ID of the owner of the order
    userId?: string; // ID of the user who placed the order
    supplierId: string; // ID of the supplier
    supplierData?: ISupplier;
    subTotal: number; // Subtotal amount before GST
    totalGst: number; // Total GST amount
    roundOff: number; // Amount to round off the total
    total: number; // Total amount after GST and round off
    paymentMethod: string; // e.g., 'cash', 'card', 'upi'
    paymentStatus: string; // e.g., 'paid', 'pending', 'failed'
    products: Array<{
        _id?: string; // Optional ID for the product item
        productId: string; // ID of the product
        variantId: string; // ID of the product variant
        unit: number; // Unit of measurement for the product (e.g., kg, pcs)
        carton: number; // Number of cartons for the product
        quantity: number; // Quantity of the product ordered
        mrp: number; // Maximum Retail Price of the product
        price: number; // Price per unit of the product
        gstRate: number; // GST percentage applicable on the product
        gstAmount: number; // GST amount for this product
        total: number; // Total price for this product (price * quantity + gstAmount)
        productData?: IProduct;
        variantData?: IProduct["variants"][number]; // Optional variant data for the product
    }>;
    invoiceNumber?: string; // Optional invoice number for the order
    notes?: string; // Optional notes for the order
    isDeleted?: boolean; // Flag to indicate if the order is deleted
    captureDate?: Date; // Date when the order was captured
    createdAt?: Date;
    updatedAt?: Date;
}