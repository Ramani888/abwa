import { StatusCodes } from "http-status-codes";
import axios, { AxiosError, Method } from "axios";
import { ILogin, IRegister } from "@/types/user";
import { ICustomer } from "@/types/customer";

const serverUrl = 'https://abb-i6cd.vercel.app/api';
// const serverUrl = 'http://localhost:3000/api';
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
      // headers.authorization = TOKEN;
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
  
      if (errorCodes.includes(response.status)) {
        throw res;
      }
  
      return res;
    } catch (e) {
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

/// Category ///

