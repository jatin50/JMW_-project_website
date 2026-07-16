import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axiosClient.js";
import { clearCartState } from "../store/slices/cartSlice.js";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { totalPrice } = useSelector((state) => state.cart);
  const { currentUser } = useSelector((state) => state.user);

  const addressId = location.state?.addressId;
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");

  useEffect(() => {
    if (!addressId) navigate("/address");
  }, [addressId, navigate]);

  const handlePlaceCODOrder = async () => {
    setStatus("processing");
    setError("");
    try {
      await api.post("/orders/place-cod", { addressId });
      dispatch(clearCartState());
      setStatus("success");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
      setStatus("error");
    }
  };

  const handlePay = async () => {
    setStatus("processing");
    setError("");

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError("Failed to load payment gateway. Check your connection.");
      setStatus("error");
      return;
    }

    try {
      const { data } = await api.post("/orders/create-payment", { addressId });
      const { razorpayOrderId, amount, currency, keyId } = data.data;

      const razorpay = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        name: "Jatin Men's Wear",
        description: "Order payment",
        order_id: razorpayOrderId,
        prefill: {
          name: currentUser?.name,
          email: currentUser?.email,
          contact: currentUser?.phonenumber,
        },
        theme: { color: "#FF5A1F" },
        handler: async (response) => {
          try {
            await api.post("/orders/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              addressId,
            });
            dispatch(clearCartState());
            setStatus("success");
          } catch (err) {
            setError(err.response?.data?.message || "Payment verification failed");
            setStatus("error");
          }
        },
        modal: {
          ondismiss: () => setStatus("idle"),
        },
      });

      razorpay.open();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start payment");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-ink text-paper min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h2 className="font-display text-3xl uppercase text-acid mb-3">Order placed!</h2>
        <p className="text-paper/60 text-sm mb-8">
          {paymentMethod === "COD"
            ? "Your order is confirmed. Pay in cash when it arrives."
            : "Your payment was successful and your order is confirmed."}
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-paper text-ink font-bold px-6 py-3 rounded-full hover:bg-acid transition-colors"
        >
          Continue shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-ink text-paper min-h-screen px-6 md:px-10 py-10">
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className="px-4 py-1.5 rounded-full border border-[rgba(243,239,230,0.2)] text-paper/50 text-xs">1. CART</span>
        <span className="text-paper/30 text-xs">.......</span>
        <span className="px-4 py-1.5 rounded-full border border-[rgba(243,239,230,0.2)] text-paper/50 text-xs">2. ADDRESS</span>
        <span className="text-paper/30 text-xs">.......</span>
        <span className="px-4 py-1.5 rounded-full bg-acid text-ink text-xs font-bold">3. PAYMENT</span>
      </div>

      <div className="max-w-md mx-auto bg-[#1c1b22] border border-[rgba(243,239,230,0.14)] rounded-2xl p-7 text-center">
        <h2 className="font-display text-2xl uppercase mb-2">Order total</h2>
        <p className="font-mono text-3xl mb-6">₹{totalPrice}</p>

        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={() => setPaymentMethod("ONLINE")}
            className={`flex-1 py-2.5 rounded-full text-xs font-bold tracking-wide border transition-colors ${
              paymentMethod === "ONLINE"
                ? "bg-paper text-ink border-paper"
                : "border-[rgba(243,239,230,0.2)] text-paper/60 hover:border-paper"
            }`}
          >
            PAY ONLINE
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod("COD")}
            className={`flex-1 py-2.5 rounded-full text-xs font-bold tracking-wide border transition-colors ${
              paymentMethod === "COD"
                ? "bg-paper text-ink border-paper"
                : "border-[rgba(243,239,230,0.2)] text-paper/60 hover:border-paper"
            }`}
          >
            CASH ON DELIVERY
          </button>
        </div>

        {error && <p className="text-tangerine text-xs mb-4">{error}</p>}

        <button
          onClick={paymentMethod === "COD" ? handlePlaceCODOrder : handlePay}
          disabled={status === "processing"}
          className="w-full bg-tangerine text-ink font-bold py-3 rounded-full hover:bg-acid transition-colors disabled:opacity-50"
        >
          {status === "processing"
            ? paymentMethod === "COD" ? "Placing order..." : "Opening checkout..."
            : paymentMethod === "COD" ? "Place order" : "Pay now"}
        </button>

        <p className="text-[11px] text-paper/40 mt-4">
          {paymentMethod === "COD"
            ? "Pay in cash when your order arrives."
            : "Secured by Razorpay. Test mode — no real charges."}
        </p>
      </div>
    </div>
  );
};

export default Payment;