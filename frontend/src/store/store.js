import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice.js";
import cartReducer from "./slices/cartSlice.js";
import categoryReducer from "./slices/categorySlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    categories: categoryReducer,
  },
});