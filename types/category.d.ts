export interface ICategory {
    _id?: ObjectId;
    ownerId?: string;
    userId?: string;
    name: string;
    description?: string;
    isActive?: boolean;
    captureDate?: Date;
    productCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
}