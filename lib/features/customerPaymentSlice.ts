import { serverGetCustomerPayment } from '@/services/serverApi'
import { ICustomerPayment } from '@/types/customer'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface CustomerPaymentState {
  customerPayment: ICustomerPayment[]
  loading: boolean
  error: string | null
}

const initialState: CustomerPaymentState = {
  customerPayment: [],
  loading: false,
  error: null,
}

// Async thunk to fetch customer payments
export const getCustomerPayments = createAsyncThunk(
  'getCustomerPayments',
  async () => {
    try {
      const res = await serverGetCustomerPayment();
      return res?.data as ICustomerPayment[];
    } catch (error) {
      console.error("Error fetching customer payments:", error)
      throw error;
    }
  }
)

const customerPaymentSlice = createSlice({
  name: 'customerPayments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCustomerPayments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCustomerPayments.fulfilled, (state, action) => {
        state.loading = false
        state.customerPayment = action.payload
      })
      .addCase(getCustomerPayments.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error'
      })
  },
})

export default customerPaymentSlice.reducer