export interface ILogin {
    number: number;
    password: string;
}

export interface IRegister {
    name: string;
    email: string;
    number: number;
    password: string;
    shopName: string;
    address: string;
    shopNumber: number;
    shopEmail: string;
    gst: string;
}

export interface IUser {
    _id?: ObjectId;
    name: string;
    email: string;
    number: number;
    roleName?: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IRole {
    _id?: ObjectId;
    name: string;
}

export interface IShop {
  _id?: ObjectId;
  name: string;
  address: string;
  number: number;
  email: string;
  gst: string;
}

export interface IOwner {
  _id?: ObjectId;
  name: string;
  email: string;
  number: number;
  password: string;
  shop: IShop;
  createdAt?: Date;
  updatedAt?: Date;
}