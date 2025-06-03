import { serverGetCustomers } from '@/services/serverApi'
import { ICustomer } from '@/types/customer'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface CustomerState {
  customers: ICustomer[]
  loading: boolean
  error: string | null
}

const initialState: CustomerState = {
  customers: [],
  loading: false,
  error: null,
}

// Async thunk to fetch customers
export const getCustomers = createAsyncThunk(
  'getCustomers',
  async () => {
    try {
      const res = await serverGetCustomers();
      return res?.data as ICustomer[];
    } catch (error) {
      console.error("Error fetching customers:", error)
      throw error;
    }
  }
)

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCustomers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.loading = false
        state.customers = action.payload
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error'
      })
  },
})

export default customerSlice.reducer