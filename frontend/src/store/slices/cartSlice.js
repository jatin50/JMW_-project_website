import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosClient.js";

const GUEST_CART_KEY = "guest_cart";

const loadGuestCart = () => {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveGuestCart = (products) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(products));
};

const unitPriceOf = (product) =>
  product.discount > 0 ? Math.round(product.price - (product.price * product.discount) / 100) : product.price;

const computeTotal = (products) =>
  products.reduce((sum, item) => sum + unitPriceOf(item.productId) * item.quantity, 0);

export const fetchCart = createAsyncThunk("cart/fetch", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/products/cart");
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch cart");
  }
});

export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ productId, variantId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/products/cart/${productId}`, { variantId, quantity });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add to cart");
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async ({ productId, variantId }, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/products/cart/${productId}/${variantId}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to remove from cart");
    }
  }
);

export const decreaseCartQuantity = createAsyncThunk(
  "cart/decrease",
  async ({ productId, variantId }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/products/cart/${productId}/${variantId}/decrease`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update cart");
    }
  }
);

// merges whatever is sitting in the guest (localStorage) cart into the now-logged-in user's real cart
export const mergeGuestCartIntoAccount = createAsyncThunk(
  "cart/mergeGuest",
  async (_, { rejectWithValue }) => {
    const guestItems = loadGuestCart();
    if (guestItems.length === 0) return null;

    try {
      for (const item of guestItems) {
        await api.post(`/products/cart/${item.productId._id}`, {
          variantId: item.variantId,
          quantity: item.quantity,
        });
      }
      saveGuestCart([]); // clear guest cart now that it's merged
      const { data } = await api.get("/products/cart");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to merge guest cart");
    }
  }
);

const initialState = {
  products: [],
  totalPrice: 0,
  status: "idle",
  error: null,
  isGuest: true, // flips to false once we know the user is authenticated
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ----- guest cart: everything below is synchronous, localStorage-backed -----
    loadGuestCartFromStorage: (state) => {
      state.products = loadGuestCart();
      state.totalPrice = computeTotal(state.products);
      state.isGuest = true;
    },
    addGuestItem: (state, action) => {
      const { product, variantId, color, size, quantity = 1 } = action.payload;
      const existing = state.products.find(
        (p) => p.productId._id === product._id && p.variantId === variantId
      );
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.products.push({
          productId: { _id: product._id, name: product.name, price: product.price, imageUrl: product.imageUrl, discount: product.discount },
          variantId,
          color,
          size,
          quantity,
        });
      }
      state.totalPrice = computeTotal(state.products);
      saveGuestCart(state.products);
    },
    removeGuestItem: (state, action) => {
      const { productId, variantId } = action.payload;
      state.products = state.products.filter(
        (p) => !(p.productId._id === productId && p.variantId === variantId)
      );
      state.totalPrice = computeTotal(state.products);
      saveGuestCart(state.products);
    },
    decreaseGuestItem: (state, action) => {
      const { productId, variantId } = action.payload;
      const line = state.products.find((p) => p.productId._id === productId && p.variantId === variantId);
      if (line) {
        if (line.quantity > 1) line.quantity -= 1;
        else state.products = state.products.filter((p) => p !== line);
      }
      state.totalPrice = computeTotal(state.products);
      saveGuestCart(state.products);
    },
    clearCartState: (state) => {
      state.products = [];
      state.totalPrice = 0;
      saveGuestCart([]);
    },
  },
  extraReducers: (builder) => {
    const applyCart = (state, action) => {
      state.status = "succeeded";
      state.products = action.payload.products;
      state.totalPrice = action.payload.TotalPrice;
      state.isGuest = false;
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
      .addCase(decreaseCartQuantity.rejected, setError)
      .addCase(mergeGuestCartIntoAccount.fulfilled, (state, action) => {
        if (action.payload) applyCart(state, action);
      });
  },
});

export const { loadGuestCartFromStorage, addGuestItem, removeGuestItem, decreaseGuestItem, clearCartState } = cartSlice.actions;
export default cartSlice.reducer;