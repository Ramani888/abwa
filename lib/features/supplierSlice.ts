import { serverGetSupplier } from '@/services/serverApi'
import { ISupplier } from '@/types/supplier'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface SupplierState {
  supplier: ISupplier[]
  loading: boolean
  error: string | null
}

const initialState: SupplierState = {
  supplier: [],
  loading: false,
  error: null,
}

// Async thunk to fetch supplier
export const getSuppliers = createAsyncThunk(
  'getSuppliers',
  async () => {
    try {
      const res = await serverGetSupplier();
      return res?.data as ISupplier[];
    } catch (error) {
      console.error("Error fetching supplier:", error)
      throw error;
    }
  }
)

const supplierSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSuppliers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getSuppliers.fulfilled, (state, action) => {
        state.loading = false
        state.supplier = action.payload
      })
      .addCase(getSuppliers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error'
      })
  },
})

export default supplierSlice.reducer