import { serverGetProduct } from '@/services/serverApi'
import { IProduct } from '@/types/product'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface ProductState {
  products: IProduct[]
  loading: boolean
  error: string | null
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
}

// Async thunk to fetch products
export const getProducts = createAsyncThunk(
  'getProducts',
  async () => {
    try {
      const res = await serverGetProduct();
      return res?.data as IProduct[];
    } catch (error) {
      console.error("Error fetching products:", error)
      throw error;
    }
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error'
      })
  },
})

export default productSlice.reducer