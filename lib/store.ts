import { configureStore } from '@reduxjs/toolkit'
import customerReducer from './features/customerSlice'
import productReducer from './features/productSlice'
import orderReducer from './features/orderSlice'
import supplierPaymentReducer from './features/supplierPaymentSlice'
import customerPaymentReducer from './features/customerPaymentSlice'
import supplier from './features/supplierSlice'

export const store = configureStore({
  reducer: {
    customers: customerReducer,
    products: productReducer,
    orders: orderReducer,
    supplierPayment: supplierPaymentReducer,
    customerPayment: customerPaymentReducer,
    suppliers: supplier
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch