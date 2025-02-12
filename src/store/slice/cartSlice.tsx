import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ICartState {
  cartItems: Item[];
  shopInfo?: Shop | null;
}

const initialState: ICartState = {
  cartItems: [],
  shopInfo: null,
}

interface CartPayload {
  cartItems: Item[];
  shopInfo?: Shop | null;
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartState: (state, action: PayloadAction<CartPayload>) => {
      state.cartItems = action.payload.cartItems;
      state.shopInfo = action.payload.shopInfo;
    },
  },
});

export const { setCartState } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;