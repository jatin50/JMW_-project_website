import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./store/store.js";
import { fetchCurrentUser } from "./store/slices/userSlice.js";
import { fetchCart, loadGuestCartFromStorage } from "./store/slices/cartSlice.js";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Cart from "./components/Cart.jsx";
import Address from "./components/Address.jsx";
import Payment from "./components/Payment.jsx";
import ProductReview from "./components/ProductReview.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="product/:productId" element={<ProductReview />} />
      <Route path="cart" element={<Cart />} />
      <Route path="address" element={<Address />} />
      <Route path="payment" element={<Payment />} />
    </Route>
  )
);

function SessionBootstrap({ children }) {
  const dispatch = useDispatch();
  const { authChecked, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (!authChecked) return; // wait until we know for sure
    if (isAuthenticated) {
      dispatch(fetchCart());
    } else {
      dispatch(loadGuestCartFromStorage());
    }
  }, [authChecked, isAuthenticated, dispatch]);

  return children;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <SessionBootstrap>
        <RouterProvider router={router} />
      </SessionBootstrap>
    </Provider>
  </StrictMode>
);