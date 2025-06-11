import { StatusCodes } from "http-status-codes";
import axios, { AxiosError, Method } from "axios";
import { ILogin, IRegister, IUser } from "@/types/user";
import { ICustomer, ICustomerPayment } from "@/types/customer";
import { ICategory } from "@/types/category";
import { IProduct } from "@/types/product";
import { toast } from "sonner";
import { ISupplier, ISupplierPayment } from "@/types/supplier";
import { IOrder } from "@/types/order";
import { IPurchaseOrder } from "@/types/purchaseOrder";

const serverUrl = 'https://abb-i6cd.vercel.app/api';
// const serverUrl = 'http://localhost:3010/api';
const TOKEN = "";

const errorCodes = [
  StatusCodes.INTERNAL_SERVER_ERROR,
  StatusCodes.BAD_REQUEST,
  StatusCodes.UNAUTHORIZED,
  StatusCodes.CONFLICT,
];

const serverRequest = async (
    url: string,
    command: Method,
    data: any,
    token?: boolean,
    isForm?: boolean
  ) => {
    const headers: HeadersInit = {
      Accept: "application/json, text/plain, */*",
    };
  
    if (token) {
      const user = JSON.parse(localStorage.getItem('user') ?? '{}')
      headers.authorization = `${user?.token}`
    }
  
    const params: RequestInit = {
      method: command,
      mode: "cors",
      cache: "no-cache",
      headers: headers,
    };
  
    if (data && !isForm) {
      (params.headers as any)["Content-Type"] = "application/json";
      params.body = JSON.stringify(data);
    } else if (isForm) {
      params.body = data;
    }
  
    try {
      const config = {
        url: serverUrl + url,
        headers: headers,
        method: command,
        timeout: 60000,
        data: data,
      };
      const response = await axios(config);
  
      let res = await response.data;

      if ((command === "DELETE" || command === "POST" || command === "PUT")) {
        toast.success(response?.data?.message ?? response?.data?.error);
      }
  
      if (errorCodes.includes(response.status)) {
        throw res;
      }
  
      return res;
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? e?.response?.data?.errors?.[0] ?? "something went wrong");
      throw e;
    }
};

/// Auth ///
export const serverLogin = async (data: ILogin) => {
  return await serverRequest("/login", "POST", data, false);
};

export const serverRegister = async (data: IRegister) => {
  return await serverRequest("/register", "POST", data, false);
}

/// User ///
export const serverGetUser = async () => {
  return await serverRequest("/user", "GET", null, true);
}

export const serverInsertUser = async (data: IUser) => {
  return await serverRequest("/user", "POST", data, true);
}

export const serverUpdateUser = async (data: IUser) => {
  return await serverRequest("/user", "PUT", data, true);
}

export const serverUpdateUserPassword = async (data: { _id: string; password: string }) => {
  return await serverRequest("/user/password", "PUT", data, true);
}

export const serverUpdateUserPasswordByCurrent = async (data: { _id: string; currentPassword: string, newPassword: string }) => {
  return await serverRequest("/user/password/current", "PUT", data, true);
}

export const serverGetAllPermission = async () => {
  return await serverRequest("/permission", "GET", null, true);
}

export const serverGetAllRole = async () => {
  return await serverRequest("/role", "GET", null, true);
}

export const serverGetUserRolePermissionData = async () => {
  return await serverRequest("/user/role/permission", "GET", null, true);
}

/// Customer ///
export const serverAddCustomer = async (data: ICustomer) => {
  return await serverRequest("/customer", "POST", data, true);
}

export const serverGetCustomers = async () => {
  return await serverRequest(`/customer`, "GET", null, true);
};

export const serverUpdateCustomer = async (data: ICustomer) => {
  return await serverRequest(`/customer`, "PUT", data, true);
}

export const serverDeleteCustomer = async (_id: string) => {
  return await serverRequest(`/customer?_id=${_id}`, "DELETE", null, true);
}

export const serverGetCustomerDetailOrder = async (_id: string) => {
  return await serverRequest(`/customer/detail/order?_id=${_id}`, "GET", null, true);
}

/// Category ///
export const serverGetCategory = async () => {
  return await serverRequest(`/category`, "GET", null, true);
};

export const serverGetActiveCategory = async () => {
  return await serverRequest(`/category/active`, "GET", null, true);
};
 
export const serverAddCategory = async (data: ICategory) => {
  return await serverRequest(`/category`, "POST", data, true);
} 

export const serverUpdateCategory = async (data: ICategory) => {
  return await serverRequest(`/category`, "PUT", data, true);
}

export const serverDeleteCategory = async (_id: string) => {
  return await serverRequest(`/category?_id=${_id}`, "DELETE", null, true);
}

/// Product ///
export const serverGetProduct = async () => {
  return await serverRequest(`/product`, "GET", null, true);
}

export const serverAddProduct = async (data: IProduct) => {
  return await serverRequest(`/product`, "POST", data, true);
}

export const serverUpdateProduct = async (data: IProduct) => {
  return await serverRequest(`/product`, "PUT", data, true);
}

export const serverDeleteProduct = async (_id: string) => {
  return await serverRequest(`/product?_id=${_id}`, "DELETE", null, true);
}

/// Order ///
export const serverGetOrder = async () => {
  return await serverRequest(`/order`, "GET", null, true);
}

export const serverAddOrder = async (data: any) => {
  return await serverRequest(`/order`, "POST", data, true);
}

export const serverUpdateOrder = async (data: any) => {
  return await serverRequest(`/order`, "PUT", data, true);
}

export const serverDeleteOrder = async (_id: string) => {
  return await serverRequest(`/order?_id=${_id}`, "DELETE", null, true);
}

export const serverGetAllOrdersByCustomerId = async (_id: string) => {
  return await serverRequest(`/order/customer/all?_id=${_id}`, "GET", null, true);
}

/// Supplier ///
export const serverAddSupplier = async (data: ISupplier) => {
  return await serverRequest(`/supplier`, "POST", data, true);
}

export const serverGetSupplier = async () => {
  return await serverRequest(`/supplier`, "GET", null, true);
}

export const serverUpdateSupplier = async (data: ISupplier) => {
  return await serverRequest(`/supplier`, "PUT", data, true);
}

export const serverDeleteSupplier = async (_id: string) => {
  return await serverRequest(`/supplier?_id=${_id}`, "DELETE", null, true);
}

export const serverGetSupplierDetailOrder = async (_id: string) => {
  return await serverRequest(`/supplier/detail/order?_id=${_id}`, "GET", null, true);
}

/// Purchase Order ///
export const serverGetPurchaseOrder = async () => {
  return await serverRequest(`/purchase-order`, "GET", null, true);
}

export const serverAddPurchaseOrder = async (data: any) => {
  return await serverRequest(`/purchase-order`, "POST", data, true);
}

export const serverUpdatePurchaseOrder = async (data: any) => {
  return await serverRequest(`/purchase-order`, "PUT", data, true);
}

export const serverDeletePurchaseOrder = async (_id: string) => {
  return await serverRequest(`/purchase-order?_id=${_id}`, "DELETE", null, true);
}

export const serverGetAllPurchaseOrdersBySupplierId = async (_id: string) => {
  return await serverRequest(`/purchase-order/supplier/all?_id=${_id}`, "GET", null, true);
}

/// Customer Payment ///
export const serverGetCustomerPayment = async () => {
  return await serverRequest(`/customer-payment`, "GET", null, true);
}

export const serverAddCustomerPayment = async (data: ICustomerPayment) => {
  return await serverRequest(`/customer-payment`, "POST", data, true);
}

export const serverUpdateCustomerPayment = async (data: ICustomerPayment) => {
  return await serverRequest(`/customer-payment`, "PUT", data, true);
}

export const serverDeleteCustomerPayment = async (_id: string) => {
  return await serverRequest(`/customer-payment?_id=${_id}`, "DELETE", null, true);
}

/// Supplier Payment ///
export const serverGetSupplierPayment = async () => {
  return await serverRequest(`/supplier-payment`, "GET", null, true);
}

export const serverAddSupplierPayment = async (data: ISupplierPayment) => {
  return await serverRequest(`/supplier-payment`, "POST", data, true);
}

export const serverUpdateSupplierPayment = async (data: ISupplierPayment) => {
  return await serverRequest(`/supplier-payment`, "PUT", data, true);
}

export const serverDeleteSupplierPayment = async (_id: string) => {
  return await serverRequest(`/supplier-payment?_id=${_id}`, "DELETE", null, true);
}