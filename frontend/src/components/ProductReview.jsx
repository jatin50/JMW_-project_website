import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axiosClient.js";
import { addToCart, addGuestItem } from "../store/slices/cartSlice.js";
import ProductCard from "./ProductCart.jsx";

const ProductReview = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setRelatedProducts([]);
      try {
        const { data } = await api.get(`/products/${productId}`);
        setProduct(data.data);
        const firstInStock = data.data.variants.find((v) => v.stock > 0);
        if (firstInStock) setSelectedColor(firstInStock.color);

        if (data.data.category?._id) {
          try {
            const related = await api.get("/products", {
              params: { category: data.data.category._id, limit: 8 },
            });
            setRelatedProducts(
              related.data.data.products.filter((p) => p._id !== productId)
            );
          } catch {
            // related products are a nice-to-have, don't block the page on failure
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || "Product not found");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [productId]);

  const colors = useMemo(
    () => (product ? [...new Set(product.variants.map((v) => v.color))] : []),
    [product]
  );

  const sizesForSelectedColor = useMemo(
    () => (product ? product.variants.filter((v) => v.color === selectedColor) : []),
    [product, selectedColor]
  );

  const selectedVariant = useMemo(
    () => sizesForSelectedColor.find((v) => v.size === selectedSize),
    [sizesForSelectedColor, selectedSize]
  );

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setSelectedSize(null);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      alert("Please select a color and size");
      return;
    }
    if (selectedVariant.stock === 0) return;

    setAdding(true);
    if (isAuthenticated) {
      const result = await dispatch(
        addToCart({ productId, variantId: selectedVariant._id })
      );
      if (result.error) alert(result.payload || "Failed to add to cart");
      else {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      }
    } else {
      dispatch(
        addGuestItem({
          product,
          variantId: selectedVariant._id,
          color: selectedVariant.color,
          size: selectedVariant.size,
        })
      );
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
    setAdding(false);
  };

  if (loading) {
    return <div className="bg-ink  min-h-screen flex items-center justify-center text-sm text-paper/50">Loading...</div>;
  }
  if (error || !product) {
    return <div className="bg-ink  min-h-screen flex items-center justify-center text-sm text-tangerine">{error}</div>;
  }

  const hasDiscount = product.discount > 0;
  const finalPrice = hasDiscount
    ? Math.round(product.price - (product.price * product.discount) / 100)
    : product.price;

  return (
    <div className="bg-ink text-paper min-h-screen px-6 md:px-10 py-10">
      <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        <div className="rounded-2xl overflow-hidden bg-[#1c1b22] border border-[rgba(243,239,230,0.14)] h-105">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div>
          {product.category?.name && (
            <span className="text-xs tracking-widest text-paper/40 uppercase">{product.category.name}</span>
          )}
          <h1 className="font-display text-3xl uppercase mt-1 mb-4">{product.name}</h1>

          <div className="font-mono text-2xl mb-1">
            {hasDiscount && <span className="line-through opacity-40 text-base mr-2">₹{product.price}</span>}
            ₹{finalPrice}
          </div>
          {hasDiscount && <p className="text-acid text-xs mb-4">{product.discount}% off</p>}

          <p className="text-paper/60 text-sm leading-relaxed mb-6">{product.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="text-paper/40 text-xs mb-1">Fabric</p>
              <p>{product.fabric}</p>
            </div>
            <div>
              <p className="text-paper/40 text-xs mb-1">GSM</p>
              <p>{product.gsm}</p>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-paper/40 text-xs mb-2">Color</p>
            <div className="flex gap-2 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`px-4 py-2 rounded-full text-xs capitalize border transition-colors ${
                    selectedColor === color
                      ? "bg-paper text-ink border-paper"
                      : "border-[rgba(243,239,230,0.2)] hover:border-paper"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-paper/40 text-xs mb-2">Size</p>
            <div className="flex gap-2 flex-wrap">
              {sizesForSelectedColor.map((v) => (
                <button
                  key={v.size}
                  onClick={() => setSelectedSize(v.size)}
                  disabled={v.stock === 0}
                  className={`w-11 h-11 rounded-full text-xs border transition-colors ${
                    selectedSize === v.size
                      ? "bg-paper text-ink border-paper"
                      : "border-[rgba(243,239,230,0.2)] hover:border-paper"
                  } ${v.stock === 0 ? "opacity-25 cursor-not-allowed line-through" : ""}`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>

          <p className={`text-xs mb-6 ${selectedVariant?.stock > 0 ? "text-acid" : "text-tangerine"}`}>
            {selectedVariant
              ? selectedVariant.stock > 0
                ? `${selectedVariant.stock} in stock`
                : "Out of stock in this size"
              : "Select a color and size"}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.stock === 0 || adding}
            className="w-full bg-tangerine text-ink font-bold py-3.5 rounded-full hover:bg-acid transition-colors disabled:opacity-40"
          >
            {adding ? "Adding..." : added ? "Added ✓" : "Add to cart"}
          </button>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="max-w-5xl mx-auto mt-16 pt-10 border-t border-[rgba(243,239,230,0.14)]">
          <h2 className="font-display text-2xl uppercase mb-6">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReview;