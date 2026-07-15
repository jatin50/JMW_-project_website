import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import api from "../../api/axiosClient.js";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [stockDrafts, setStockDrafts] = useState({});
  const [savingVariantId, setSavingVariantId] = useState(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products", { params: { limit: 100 } });
      setProducts(data.data.products);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (!confirm("Delete this product permanently? This can't be undone.")) return;
    try {
      await api.delete(`/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  const handleRestock = async (productId, variantId) => {
    const newStock = stockDrafts[variantId];
    if (newStock === undefined || newStock === "") return;

    setSavingVariantId(variantId);
    try {
      const { data } = await api.patch(`/products/${productId}/variants/${variantId}/restock`, {
        stock: Number(newStock),
      });
      setProducts((prev) => prev.map((p) => (p._id === productId ? data.data : p)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update stock");
    } finally {
      setSavingVariantId(null);
    }
  };

  if (loading) {
    return <p className="text-paper/50 text-sm">Loading products...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl uppercase">Products</h1>
        <Link to="/admin/upload" className="bg-tangerine text-ink text-xs font-bold px-5 py-2.5 rounded-full hover:bg-acid transition-colors">
          + Upload new
        </Link>
      </div>

      {products.length === 0 && <p className="text-paper/40 text-sm">No products yet.</p>}

      <div className="flex flex-col gap-3">
        {products.map((product) => {
          const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
          const isExpanded = expandedId === product._id;

          return (
            <div key={product._id} className="bg-[#1c1b22] border border-[rgba(243,239,230,0.14)] rounded-2xl p-4">
              <div className="flex items-center gap-4">
                <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-xs text-paper/50 font-mono">₹{product.price} • {totalStock} total in stock</p>
                </div>
                <button
                  onClick={() => setExpandedId(isExpanded ? null : product._id)}
                  className="text-xs text-paper/60 flex items-center gap-1 hover:text-paper"
                >
                  Variants {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                <Link to={`/admin/edit/${product._id}`} className="text-xs underline underline-offset-2 text-paper/60 hover:text-tangerine">
                  Edit
                </Link>
                <button onClick={() => handleDelete(product._id)} className="w-8 h-8 flex items-center justify-center text-paper/40 hover:text-tangerine">
                  <Trash2 size={16} />
                </button>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-[rgba(243,239,230,0.1)] grid grid-cols-1 md:grid-cols-2 gap-2">
                  {product.variants.map((v) => (
                    <div key={v._id} className="flex items-center gap-2 bg-ink rounded-lg p-2.5">
                      <span className="text-xs capitalize w-24 truncate">{v.color} / {v.size}</span>
                      <span className="text-xs text-paper/40">current: {v.stock}</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="new stock"
                        value={stockDrafts[v._id] ?? ""}
                        onChange={(e) => setStockDrafts({ ...stockDrafts, [v._id]: e.target.value })}
                        className="w-20 bg-[#1c1b22] border border-[rgba(243,239,230,0.2)] rounded-md p-1.5 text-xs outline-none focus:border-tangerine ml-auto"
                      />
                      <button
                        onClick={() => handleRestock(product._id, v._id)}
                        disabled={savingVariantId === v._id}
                        className="text-xs bg-paper text-ink px-3 py-1.5 rounded-md font-bold hover:bg-acid disabled:opacity-40"
                      >
                        {savingVariantId === v._id ? "..." : "Save"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminProducts;