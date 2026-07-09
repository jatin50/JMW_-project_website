import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store/store.js";
import { fetchCurrentUser } from "./store/slices/userSlice.js";

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
import ProductReview from "./components/ProductReview.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="ProductReview" element={<ProductReview />} />
      </Route>
      <Route path="/cart" element={<Cart />} />
      <Route path="Address" element={<Address />} />
    </>
  )
);

// checks for an existing login session (via cookie) once, when the app first loads
function SessionBootstrap({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);
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