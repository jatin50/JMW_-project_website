import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../api/axiosClient.js";
import ProductCard from "../components/ProductCart.jsx";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "priceLow", label: "Price: Low to High" },
  { value: "priceHigh", label: "Price: High to Low" },
];

const Home = () => {
  const { items: categories } = useSelector((state) => state.categories);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get("category") || "all";
  const keyword = searchParams.get("keyword") || "";
  const sort = searchParams.get("sort") || "newest";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  // draft values for the price inputs so typing doesn't refetch on every keystroke -
  // only committed to the URL (and re-synced here if changed elsewhere) on "Apply"
  const [minPriceDraft, setMinPriceDraft] = useState(minPrice);
  const [maxPriceDraft, setMaxPriceDraft] = useState(maxPrice);
  useEffect(() => {
    setMinPriceDraft(minPrice);
    setMaxPriceDraft(maxPrice);
  }, [minPrice, maxPrice]);

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  // whenever any actual filter (not pagination) changes, reset back to page 1.
  // this runs DURING render (React's documented pattern for "adjusting state when
  // a prop/derived value changes") rather than in a useEffect, so the reset and the
  // isLoading flip land in the exact same commit - no frame is ever painted with
  // "products: []" and "isLoading: false" at the same time, which is what caused
  // the old flash of "no products found" when switching categories.
  const filterKey = `${activeCategory}|${keyword}|${sort}|${minPrice}|${maxPrice}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setIsLoading(true);
  }

  const updateFilters = (updates) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, value]) => {
        if (!value || value === "all") next.delete(key);
        else next.set(key, value);
      });
      return next;
    });
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = { page, limit: 12 };
        if (activeCategory !== "all") params.category = activeCategory;
        if (keyword) params.keyword = keyword;
        if (sort !== "newest") params.sort = sort;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;

        const { data } = await api.get("/products", { params, signal: controller.signal });
        setProducts((prev) => (page === 1 ? data.data.products : [...prev, ...data.data.products]));
        setHasMore(data.data.hasMore);
      } catch (err) {
        if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
          console.error("Failed to load products:", err);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [page, activeCategory, keyword, sort, minPrice, maxPrice]);

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

      <section className="px-6 md:px-10 py-8 flex flex-col gap-5">
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => updateFilters({ category: "all" })}
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
              onClick={() => updateFilters({ category: cat._id })}
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

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={sort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="bg-[#1c1b22] border border-[rgba(243,239,230,0.2)] rounded-full text-xs px-4 py-2.5 outline-none focus:border-tangerine"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              placeholder="Min ₹"
              value={minPriceDraft}
              onChange={(e) => setMinPriceDraft(e.target.value)}
              className="w-24 bg-[#1c1b22] border border-[rgba(243,239,230,0.2)] rounded-full text-xs px-4 py-2.5 outline-none focus:border-tangerine font-mono"
            />
            <span className="text-paper/30 text-xs">–</span>
            <input
              type="number"
              min="0"
              placeholder="Max ₹"
              value={maxPriceDraft}
              onChange={(e) => setMaxPriceDraft(e.target.value)}
              className="w-24 bg-[#1c1b22] border border-[rgba(243,239,230,0.2)] rounded-full text-xs px-4 py-2.5 outline-none focus:border-tangerine font-mono"
            />
            <button
              onClick={() => updateFilters({ minPrice: minPriceDraft, maxPrice: maxPriceDraft })}
              className="text-xs font-bold tracking-wide px-4 py-2.5 rounded-full bg-tangerine text-ink hover:bg-acid transition-colors"
            >
              Apply
            </button>
          </div>

          {(keyword || minPrice || maxPrice || sort !== "newest" || activeCategory !== "all") && (
            <button
              onClick={() => setSearchParams(new URLSearchParams())}
              className="text-xs text-paper/50 underline underline-offset-2 hover:text-tangerine"
            >
              Clear all filters
            </button>
          )}
        </div>

        {keyword && (
          <p className="text-xs text-paper/50">
            Showing results for <span className="text-paper">"{keyword}"</span>
          </p>
        )}
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
          <p className="text-center text-paper/40 py-16 text-sm">No products found. Try different filters.</p>
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