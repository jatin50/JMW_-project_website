import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosClient.js";

const statusStyles = {
  PENDING: "bg-[#3a2f1a] text-[#F5C542]",
  DELIVERED: "bg-[#1a3a24] text-acid",
  CANCELLED: "bg-[#3a1a1a] text-tangerine",
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/orders");
      setOrders(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Cancel this order? This can't be undone.")) return;
    setCancellingId(orderId);
    try {
      const { data } = await api.patch(`/orders/${orderId}/cancel`);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? data.data : o)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-ink  min-h-screen flex items-center justify-center text-sm text-paper/50">
        Loading your orders...
      </div>
    );
  }

  return (
    <div className="bg-ink text-paper min-h-screen px-6 md:px-10 py-10">
      <h1 className="font-display text-3xl uppercase mb-8">My orders</h1>

      {error && <p className="text-tangerine text-sm mb-4">{error}</p>}

      {orders.length === 0 && !error && (
        <div className="text-center py-20">
          <p className="text-paper/50 text-sm mb-5">You haven't placed any orders yet.</p>
          <Link
            to="/"
            className="bg-tangerine text-ink font-bold px-6 py-3 rounded-full hover:bg-acid transition-colors"
          >
            Start shopping
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-4 max-w-3xl">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-[#1c1b22] border border-[rgba(243,239,230,0.14)] rounded-2xl p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-[rgba(243,239,230,0.1)]">
              <div>
                <p className="text-[11px] text-paper/40 uppercase tracking-wide">Placed on</p>
                <p className="text-sm">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-paper/40 uppercase tracking-wide">Total</p>
                <p className="font-mono text-sm">₹{order.orderprice}</p>
              </div>
              <div>
                <p className="text-[11px] text-paper/40 uppercase tracking-wide">Payment</p>
                <p className="text-sm">
                  {order.paymentMethod}{" "}
                  <span className={order.isPaid ? "text-acid" : "text-paper/40"}>
                    · {order.isPaid ? "Paid" : "Unpaid"}
                  </span>
                </p>
              </div>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusStyles[order.status]}`}>
                {order.status}
              </span>
            </div>

            <div className="flex flex-col gap-2 mb-4">
              {order.orderitems.map((item) => (
                <div key={item._id} className="flex items-center gap-3 text-sm">
                  {item.porductId?.imageUrl && (
                    <img
                      src={item.porductId.imageUrl}
                      alt={item.porductId?.name}
                      className="w-12 h-14 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <p>{item.porductId?.name || "Product removed"}</p>
                    <p className="text-paper/40 text-xs capitalize">
                      {item.color} / {item.size} · x{item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {order.address && (
              <p className="text-xs text-paper/40 mb-4">
                Delivering to {order.address.addressLine1}, {order.address.city} - {order.address.pincode}
              </p>
            )}

            {order.status === "PENDING" && (
              <button
                onClick={() => handleCancel(order._id)}
                disabled={cancellingId === order._id}
                className="text-xs text-tangerine underline underline-offset-2 disabled:opacity-50"
              >
                {cancellingId === order._id ? "Cancelling..." : "Cancel order"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;