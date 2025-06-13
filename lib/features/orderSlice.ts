import { serverGetOrder, serverGetProduct } from '@/services/serverApi'
import { IOrder } from '@/types/order'
import { IProduct } from '@/types/product'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface OrderState {
  orders: IOrder[]
  loading: boolean
  error: string | null
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
}

// Async thunk to fetch orders
export const getOrders = createAsyncThunk(
  'getOrders',
  async () => {
    try {
      const res = await serverGetOrder();
      return res?.data as IOrder[];
    } catch (error) {
      console.error("Error fetching orders:", error)
      throw error;
    }
  }
)

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(getOrders    .rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error'
      })
  },
})

export default orderSlice.reducer