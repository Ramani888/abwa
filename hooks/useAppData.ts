import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/lib/store"
import { getCustomers } from "@/lib/features/customerSlice"
import { getProducts } from "@/lib/features/productSlice"
import { getOrders } from "@/lib/features/orderSlice"
import { getSupplierPayments } from "@/lib/features/supplierPaymentSlice"
import { getSuppliers } from "@/lib/features/supplierSlice"
import { getCustomerPayments } from "@/lib/features/customerPaymentSlice"

export function useAppData() {
  const dispatch = useDispatch<AppDispatch>()

  const fetchAllData = useCallback(() => {
    dispatch(getCustomers())
    dispatch(getProducts())
    dispatch(getOrders())
    dispatch(getSupplierPayments())
    dispatch(getSuppliers())
    dispatch(getCustomerPayments())
  }, [dispatch])

  return { fetchAllData }
}