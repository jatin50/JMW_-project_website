import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../store/slices/cartSlice.js";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const hasDiscount = product.discount > 0;
  const finalPrice = hasDiscount
    ? Math.round(product.price - (product.price * product.discount) / 100)
    : product.price;

  const handleAddToCart = (e) => {
    e.preventDefault(); // don't navigate when clicking the button inside the link
    dispatch(addToCart(product._id));
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="group block bg-[#1c1b22] border border-[rgba(243,239,230,0.14)] rounded-2xl p-3.5 transition-transform duration-300 hover:-translate-y-2 hover:border-tangerine"
    >
      <div className="relative h-52 rounded-xl mb-3.5 overflow-hidden bg-linear-to-br from-[#2a2831] to-[#201f26]">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-paper/20 text-xs tracking-wider">
            [ image ]
          </div>
        )}

        {hasDiscount && (
          <span className="absolute top-2.5 left-2.5 bg-tangerine text-ink text-[11px] font-bold px-2.5 py-1 rounded-full -rotate-3">
            -{product.discount}%
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute inset-0 bg-ink/70 flex items-center justify-center text-xs tracking-widest">
            SOLD OUT
          </span>
        )}
      </div>

      <h3 className="text-[15px] font-medium mb-1.5 truncate">{product.name}</h3>

      <div className="flex items-center justify-between mb-3">
        <div className="font-mono text-[15px]">
          {hasDiscount && (
            <span className="line-through opacity-40 text-xs mr-1.5">₹{product.price}</span>
          )}
          ₹{finalPrice}
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className="w-full py-2 rounded-full text-xs font-bold tracking-wide bg-paper text-ink transition-colors hover:bg-acid disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {product.stock === 0 ? "OUT OF STOCK" : "ADD TO CART"}
      </button>
    </Link>
  );
};

export default ProductCard;