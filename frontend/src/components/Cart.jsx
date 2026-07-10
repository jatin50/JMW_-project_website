import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";
import { fetchCart, addToCart, removeFromCart, decreaseCartQuantity } from "../store/slices/cartSlice.js";

const Cart = () => {
  const dispatch = useDispatch();
  const { products, totalPrice, status } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const isEmpty = status !== "loading" && products.length === 0;

  return (
    <div className="bg-ink text-paper min-h-screen px-6 md:px-10 py-10">
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className="px-4 py-1.5 rounded-full bg-acid text-ink text-xs font-bold">1. CART</span>
        <span className="text-paper/30 text-xs">.......</span>
        <span className="px-4 py-1.5 rounded-full border border-[rgba(243,239,230,0.2)] text-paper/50 text-xs">2. ADDRESS</span>
        <span className="text-paper/30 text-xs">.......</span>
        <span className="px-4 py-1.5 rounded-full border border-[rgba(243,239,230,0.2)] text-paper/50 text-xs">3. PAYMENT</span>
      </div>

      {isEmpty ? (
        <div className="text-center py-24">
          <p className="text-paper/50 mb-6">Your cart is empty.</p>
          <Link to="/" className="inline-block bg-paper text-ink px-6 py-3 rounded-full text-sm font-bold hover:bg-acid transition-colors">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 flex flex-col gap-4">
            {products.map((item) => (
              <div key={item.productId._id} className="flex gap-4 bg-[#1c1b22] border border-[rgba(243,239,230,0.14)] rounded-2xl p-4">
                <img
                  src={item.productId.imageUrl}
                  alt={item.productId.name}
                  className="w-28 h-28 rounded-xl object-cover"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium mb-1">{item.productId.name}</h3>
                    <p className="font-mono text-sm text-paper/70">₹{item.productId.price}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => dispatch(decreaseCartQuantity(item.productId._id))}
                      className="w-7 h-7 rounded-full border border-[rgba(243,239,230,0.2)] flex items-center justify-center hover:border-tangerine"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="font-mono text-sm w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => dispatch(addToCart(item.productId._id))}
                      className="w-7 h-7 rounded-full border border-[rgba(243,239,230,0.2)] flex items-center justify-center hover:border-tangerine"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => dispatch(removeFromCart(item.productId._id))}
                  className="self-start w-9 h-9 rounded-full bg-paper flex items-center justify-center hover:bg-tangerine transition-colors"
                >
                  <Trash2 size={16} className="text-ink" />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-[#1c1b22] border border-[rgba(243,239,230,0.14)] rounded-2xl p-6 h-fit">
            <h2 className="font-display text-xl uppercase mb-5 pb-4 border-b border-[rgba(243,239,230,0.14)]">
              Price details
            </h2>
            <div className="flex justify-between text-sm mb-3 text-paper/70">
              <span>Items ({products.reduce((sum, i) => sum + i.quantity, 0)})</span>
              <span className="font-mono">₹{totalPrice}</span>
            </div>
            <div className="flex justify-between text-sm mb-3 text-paper/70">
              <span>Shipping</span>
              <span className="font-mono text-acid">FREE</span>
            </div>
            <div className="flex justify-between font-bold text-base mt-4 pt-4 border-t border-[rgba(243,239,230,0.14)]">
              <span>Cart total</span>
              <span className="font-mono">₹{totalPrice}</span>
            </div>

            <Link to="/address">
              <button className="w-full mt-6 bg-tangerine text-ink font-bold py-3 rounded-full hover:bg-acid transition-colors">
                Proceed to address
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;