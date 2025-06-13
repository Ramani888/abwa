import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/lib/store"
import { getCustomers } from "@/lib/features/customerSlice"
import { getProducts } from "@/lib/features/productSlice"
import { getOrders } from "@/lib/features/orderSlice"

export function useAppData() {
  const dispatch = useDispatch<AppDispatch>()

  const fetchAllData = useCallback(() => {
    dispatch(getCustomers())
    dispatch(getProducts())
    dispatch(getOrders())
  }, [dispatch])

  return { fetchAllData }
}