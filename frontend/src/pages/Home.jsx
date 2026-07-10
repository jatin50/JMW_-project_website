import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../store/slices/categorySlice.js";
import api from "../api/axiosClient.js";
import ProductCard from "../components/ProductCart.jsx";

const Home = () => {
  const dispatch = useDispatch();
  const { items: categories } = useSelector((state) => state.categories);

  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [activeCategory]);

  const loadProducts = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const params = { page, limit: 12 };
      if (activeCategory !== "all") params.category = activeCategory;

      const { data } = await api.get("/products", { params });
      setProducts((prev) => (page === 1 ? data.data.products : [...prev, ...data.data.products]));
      setHasMore(data.data.hasMore);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, activeCategory]);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, activeCategory]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "200px" }
    );

    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, isLoading]);

  return (
    <div className="bg-ink text-paper min-h-screen">
      <section className="px-6 md:px-10 pt-16 pb-14 border-b border-[rgba(243,239,230,0.14)]">
        <h1 className="font-display uppercase leading-[0.92] text-[13vw] md:text-7xl">
          Dress like<br />it's <span className="text-acid">your move.</span>
        </h1>
        <p className="mt-5 max-w-md text-paper/65 text-sm leading-relaxed">
          Streetwear built for how you actually move — layered fits, honest fabric,
          prices that don't punish you for having taste.
        </p>
      </section>

      <section className="px-6 md:px-10 py-8">
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveCategory("all")}
            className={`shrink-0 px-6 py-2.5 rounded-full text-xs tracking-wider border transition-colors ${
              activeCategory === "all"
                ? "bg-paper text-ink border-paper"
                : "border-[rgba(243,239,230,0.14)] hover:border-paper"
            }`}
          >
            ALL
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(cat._id)}
              className={`shrink-0 px-6 py-2.5 rounded-full text-xs tracking-wider uppercase border transition-colors ${
                activeCategory === cat._id
                  ? "bg-paper text-ink border-paper"
                  : "border-[rgba(243,239,230,0.14)] hover:border-paper"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 pb-20">
        <div className="flex justify-between items-end mb-8 border-b border-[rgba(243,239,230,0.14)] pb-5">
          <h2 className="font-display text-3xl uppercase">Fresh in</h2>
          <span className="text-xs text-paper/50 tracking-wide">{products.length} loaded</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {!isLoading && products.length === 0 && (
          <p className="text-center text-paper/40 py-16 text-sm">No products found in this category yet.</p>
        )}

        {isLoading && (
          <p className="text-center text-paper/40 py-10 text-sm tracking-wide">Loading more...</p>
        )}

        <div ref={sentinelRef} className="h-1" />
      </section>
    </div>
  );
};

export default Home;