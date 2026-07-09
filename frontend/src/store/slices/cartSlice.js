import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosClient.js";

export const fetchCart = createAsyncThunk("cart/fetch", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/products/cart");
    return data.data; // { products: [...], TotalPrice }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch cart");
  }
});

export const addToCart = createAsyncThunk("cart/add", async (productId, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/products/cart/${productId}`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to add to cart");
  }
});

export const removeFromCart = createAsyncThunk("cart/remove", async (productId, { rejectWithValue }) => {
  try {
    const { data } = await api.delete(`/products/cart/${productId}`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to remove from cart");
  }
});

export const decreaseCartQuantity = createAsyncThunk("cart/decrease", async (productId, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/products/cart/${productId}/decrease`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update cart");
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    totalPrice: 0,
    status: "idle",
    error: null,
  },
  reducers: {
    clearCartState: (state) => {
      state.products = [];
      state.totalPrice = 0;
    },
  },
  extraReducers: (builder) => {
    const applyCart = (state, action) => {
      state.status = "succeeded";
      state.products = action.payload.products;
      state.totalPrice = action.payload.TotalPrice;
    };
    const setLoading = (state) => { state.status = "loading"; state.error = null; };
    const setError = (state, action) => { state.status = "failed"; state.error = action.payload; };

    builder
      .addCase(fetchCart.pending, setLoading)
      .addCase(fetchCart.fulfilled, applyCart)
      .addCase(fetchCart.rejected, setError)
      .addCase(addToCart.pending, setLoading)
      .addCase(addToCart.fulfilled, applyCart)
      .addCase(addToCart.rejected, setError)
      .addCase(removeFromCart.pending, setLoading)
      .addCase(removeFromCart.fulfilled, applyCart)
      .addCase(removeFromCart.rejected, setError)
      .addCase(decreaseCartQuantity.pending, setLoading)
      .addCase(decreaseCartQuantity.fulfilled, applyCart)
      .addCase(decreaseCartQuantity.rejected, setError);
  },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;