export interface ISupplier {
    _id?: string;
    ownerId?: string;
    userId?: string;
    name: string;
    number: string;
    email?: string;
    address?: string;
    gstNumber?: string;
    captureDate?: Date;
    isDeleted?: boolean;
    totalOrder?: number;
    totalSpent?: number;
    createdAt?: Date;
    updatedAt?: Date;
}