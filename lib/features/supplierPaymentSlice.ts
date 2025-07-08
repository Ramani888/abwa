import { serverGetSupplierPayment } from '@/services/serverApi'
import { ISupplierPayment } from '@/types/supplier'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface SupplierPaymentState {
  supplierPayment: ISupplierPayment[]
  loading: boolean
  error: string | null
}

const initialState: SupplierPaymentState = {
  supplierPayment: [],
  loading: false,
  error: null,
}

// Async thunk to fetch supplier payments
export const getSupplierPayments = createAsyncThunk(
  'getSupplierPayments',
  async () => {
    try {
      const res = await serverGetSupplierPayment();
      return res?.data as ISupplierPayment[];
    } catch (error) {
      console.error("Error fetching supplier payments:", error)
      throw error;
    }
  }
)

const supplierPaymentSlice = createSlice({
  name: 'supplierPayments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSupplierPayments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getSupplierPayments.fulfilled, (state, action) => {
        state.loading = false
        state.supplierPayment = action.payload
      })
      .addCase(getSupplierPayments.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error'
      })
  },
})

export default supplierPaymentSlice.reducer