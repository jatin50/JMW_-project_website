import { useEffect, useState } from "react";
import api from "../../api/axiosClient.js";

const STATUS_OPTIONS = ["PENDING", "CANCELLED", "DELIVERED"];

const statusStyles = {
  PENDING: "bg-[#3a2f1a] text-[#F5C542]",
  DELIVERED: "bg-[#1a3a24] text-acid",
  CANCELLED: "bg-[#3a1a1a] text-tangerine",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/orders/admin/all");
      setOrders(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const { data } = await api.patch(`/orders/admin/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? data.data : o)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <p className="text-paper/50 text-sm">Loading orders...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl uppercase">All orders</h1>
        <span className="text-xs text-paper/40">{orders.length} total</span>
      </div>

      {error && <p className="text-tangerine text-sm mb-4">{error}</p>}
      {orders.length === 0 && !error && <p className="text-paper/40 text-sm">No orders yet.</p>}

      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-[#1c1b22] border border-[rgba(243,239,230,0.14)] rounded-2xl p-4"
          >
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-3">
              <div>
                <p className="text-[11px] text-paper/40 uppercase tracking-wide">Order</p>
                <p className="font-mono text-xs">{order._id}</p>
              </div>
              <div>
                <p className="text-[11px] text-paper/40 uppercase tracking-wide">Customer</p>
                <p className="text-sm">{order.userId?.name || "—"}</p>
                <p className="text-xs text-paper/40">{order.userId?.email || ""}</p>
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
              <div className="ml-auto flex items-center gap-2">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusStyles[order.status]}`}>
                  {order.status}
                </span>
                <select
                  value={order.status}
                  disabled={order.status === "CANCELLED" || updatingId === order._id}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="bg-ink border border-[rgba(243,239,230,0.2)] rounded-md text-xs px-2 py-1.5 outline-none focus:border-tangerine disabled:opacity-40"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-[rgba(243,239,230,0.1)] grid grid-cols-1 md:grid-cols-2 gap-2">
              {order.orderitems.map((item) => (
                <div key={item._id} className="flex items-center gap-2 text-xs text-paper/70 bg-ink rounded-lg p-2">
                  <span className="truncate">{item.porductId?.name || "Product removed"}</span>
                  <span className="text-paper/40 capitalize">{item.color} / {item.size}</span>
                  <span className="ml-auto font-mono">x{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;