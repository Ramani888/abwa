import { serverGetPurchaseOrder } from '@/services/serverApi'
import { IPurchaseOrder } from '@/types/purchaseOrder'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface PurchaseOrderState {
  purchaseOrders: IPurchaseOrder[]
  loading: boolean
  error: string | null
}

const initialState: PurchaseOrderState = {
  purchaseOrders: [],
  loading: false,
  error: null,
}

// Async thunk to fetch purchase orders
export const getPurchaseOrders = createAsyncThunk(
  'getPurchaseOrders',
  async () => {
    try {
      const res = await serverGetPurchaseOrder();
      return res?.data as IPurchaseOrder[];
    } catch (error) {
      console.error("Error fetching purchase orders:", error)
      throw error;
    }
  }
)

const purchaseOrderSlice = createSlice({
  name: 'purchaseOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPurchaseOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getPurchaseOrders.fulfilled, (state, action) => {
        state.loading = false
        state.purchaseOrders = action.payload
      })
      .addCase(getPurchaseOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error'
      })
  },
})

export default purchaseOrderSlice.reducer