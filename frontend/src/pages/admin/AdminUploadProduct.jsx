import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Trash2 } from "lucide-react";
import { fetchCategories } from "../../store/slices/categorySlice.js";
import api from "../../api/axiosClient.js";

const emptyVariant = { color: "", size: "", stock: "" };

const AdminUploadProduct = () => {
  const dispatch = useDispatch();
  const { items: categories } = useSelector((state) => state.categories);

  const [form, setForm] = useState({
    name: "", price: "", description: "", fabric: "", gsm: "", discount: "0", category: "",
  });
  const [variants, setVariants] = useState([{ ...emptyVariant }]);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const addVariantRow = () => setVariants([...variants, { ...emptyVariant }]);
  const removeVariantRow = (index) => setVariants(variants.filter((_, i) => i !== index));

  const resetForm = () => {
    setForm({ name: "", price: "", description: "", fabric: "", gsm: "", discount: "0", category: "" });
    setVariants([{ ...emptyVariant }]);
    setImageFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    if (!imageFile) {
      setStatus("error");
      setMessage("Please select a product image");
      return;
    }

    const cleanedVariants = variants
      .filter((v) => v.color.trim() && v.size.trim() && v.stock !== "")
      .map((v) => ({ color: v.color.trim(), size: v.size.trim(), stock: Number(v.stock) }));

    if (cleanedVariants.length === 0) {
      setStatus("error");
      setMessage("Add at least one complete color/size/stock variant");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    formData.append("variants", JSON.stringify(cleanedVariants));
    formData.append("imageUrl", imageFile);

    try {
      await api.post("/products/upload-product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("success");
      setMessage("Product uploaded successfully");
      resetForm();
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Failed to upload product");
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl uppercase mb-6">Upload product</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="text-xs text-paper/50 block mb-2">Product image</label>
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 rounded-xl bg-[#1c1b22] border border-[rgba(243,239,230,0.14)] flex items-center justify-center overflow-hidden">
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-paper/20 text-[10px]">no image</span>
              )}
            </div>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="text-xs text-paper/70" />
          </div>
        </div>

        <input name="name" placeholder="Product name" value={form.name} onChange={handleChange} required
          className="bg-[#1c1b22] border border-[rgba(243,239,230,0.2)] rounded-lg p-3 text-sm outline-none focus:border-tangerine" />

        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required rows={3}
          className="bg-[#1c1b22] border border-[rgba(243,239,230,0.2)] rounded-lg p-3 text-sm outline-none focus:border-tangerine resize-none" />

        <div className="grid grid-cols-2 gap-4">
          <input name="price" type="number" min="0" placeholder="Price (₹)" value={form.price} onChange={handleChange} required
            className="bg-[#1c1b22] border border-[rgba(243,239,230,0.2)] rounded-lg p-3 text-sm outline-none focus:border-tangerine" />
          <input name="discount" type="number" min="0" max="100" placeholder="Discount %" value={form.discount} onChange={handleChange}
            className="bg-[#1c1b22] border border-[rgba(243,239,230,0.2)] rounded-lg p-3 text-sm outline-none focus:border-tangerine" />
          <input name="fabric" placeholder="Fabric" value={form.fabric} onChange={handleChange} required
            className="bg-[#1c1b22] border border-[rgba(243,239,230,0.2)] rounded-lg p-3 text-sm outline-none focus:border-tangerine" />
          <input name="gsm" type="number" min="0" placeholder="GSM" value={form.gsm} onChange={handleChange} required
            className="bg-[#1c1b22] border border-[rgba(243,239,230,0.2)] rounded-lg p-3 text-sm outline-none focus:border-tangerine" />
        </div>

        <select name="category" value={form.category} onChange={handleChange} required
          className="bg-[#1c1b22] border border-[rgba(243,239,230,0.2)] rounded-lg p-3 text-sm outline-none focus:border-tangerine">
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-paper/50">Color / size / stock variants</label>
            <button type="button" onClick={addVariantRow} className="text-xs text-tangerine flex items-center gap-1 hover:underline">
              <Plus size={14} /> Add variant
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {variants.map((variant, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                <input placeholder="Color" value={variant.color} onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                  className="bg-[#1c1b22] border border-[rgba(243,239,230,0.2)] rounded-lg p-2.5 text-xs outline-none focus:border-tangerine" />
                <input placeholder="Size" value={variant.size} onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                  className="bg-[#1c1b22] border border-[rgba(243,239,230,0.2)] rounded-lg p-2.5 text-xs outline-none focus:border-tangerine" />
                <input type="number" min="0" placeholder="Stock" value={variant.stock} onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                  className="bg-[#1c1b22] border border-[rgba(243,239,230,0.2)] rounded-lg p-2.5 text-xs outline-none focus:border-tangerine" />
                <button type="button" onClick={() => removeVariantRow(index)} disabled={variants.length === 1}
                  className="w-8 h-8 flex items-center justify-center text-paper/40 hover:text-tangerine disabled:opacity-20">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {message && (
          <p className={`text-xs ${status === "error" ? "text-tangerine" : "text-acid"}`}>{message}</p>
        )}

        <button type="submit" disabled={status === "loading"}
          className="bg-tangerine text-ink font-bold py-3 rounded-full hover:bg-acid transition-colors disabled:opacity-50">
          {status === "loading" ? "Uploading..." : "Upload product"}
        </button>
      </form>
    </div>
  );
};

export default AdminUploadProduct;