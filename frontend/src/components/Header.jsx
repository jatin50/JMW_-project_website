import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, X, ChevronDown, Search, Menu } from "lucide-react";
import { loginUser, registerUser, logoutUser } from "../store/slices/userSlice.js";
import { mergeGuestCartIntoAccount } from "../store/slices/cartSlice.js";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, status, error } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.cart);
  const { items: categories } = useSelector((state) => state.categories);
  const cartCount = products.reduce((sum, item) => sum + item.quantity, 0);

  const [authOpen, setAuthOpen] = useState(false);
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", phonenumber: "" });

  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchValue.trim();
    navigate(trimmed ? `/?keyword=${encodeURIComponent(trimmed)}` : "/");
    setSearchValue("");
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = mode === "login" ? loginUser(form) : registerUser(form);
    const result = await dispatch(action);
    if (!result.error) {
      if (mode === "register") {
        setMode("login");
      } else {
        await dispatch(mergeGuestCartIntoAccount());
        setAuthOpen(false);
      }
    }
  };

  return (
    <>
      <div className="bg-tangerine text-ink overflow-hidden whitespace-nowrap border-b border-ink">
        <div className="inline-block py-2 text-xs font-bold tracking-widest animate-[scroll_18s_linear_infinite]">
          {Array(6).fill("FREE SHIPPING OVER ₹999  ★  NEW DROP EVERY FRIDAY  ★  ").join("")}
        </div>
      </div>

      <nav className="sticky top-0 z-40 flex items-center justify-between px-6 md:px-10 py-4 bg-ink/80 backdrop-blur-md border-b border-[rgba(243,239,230,0.14)]">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden text-paper"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <Link to="/" className="font-display text-lg tracking-wide text-paper">
            JATIN MEN'S WEAR
          </Link>
        </div>

        <ul className="hidden md:flex items-center gap-8 text-paper">
          <li
            className="relative"
            onMouseEnter={() => setShopMenuOpen(true)}
            onMouseLeave={() => setShopMenuOpen(false)}
          >
            <button className="flex items-center gap-1 text-xs tracking-wider text-paper/60 hover:text-paper transition-colors">
              SHOP <ChevronDown size={13} />
            </button>
            {shopMenuOpen && (
              <div className="absolute top-full left-0 pt-3 w-48">
                <div className="bg-[#1c1b22] border border-[rgba(243,239,230,0.14)] rounded-xl py-2 shadow-xl">
                  <Link
                    to="/"
                    className="block px-4 py-2 text-xs text-paper/70 hover:text-tangerine hover:bg-ink transition-colors"
                  >
                    All products
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      to={`/?category=${cat._id}`}
                      className="block px-4 py-2 text-xs text-paper/70 hover:text-tangerine hover:bg-ink transition-colors capitalize"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </li>
          <li>
            <Link to="/?sort=newest" className="text-xs tracking-wider text-paper/60 hover:text-paper transition-colors">
              NEW ARRIVALS
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-4">
          <div className="hidden md:block relative">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  autoFocus
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onBlur={() => !searchValue && setSearchOpen(false)}
                  placeholder="Search products..."
                  className="bg-[#1c1b22] border border-[rgba(243,239,230,0.2)] rounded-full text-xs px-4 py-2 w-48 outline-none focus:border-tangerine text-paper"
                />
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="text-paper hover:text-tangerine transition-colors" aria-label="Search">
                <Search size={19} />
              </button>
            )}
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-3 text-paper text-xs">
              <span className="hidden sm:inline">Hi, {currentUser?.name}</span>
              <Link to="/orders" className="underline underline-offset-2 hover:text-tangerine">
                My orders
              </Link>
              <button onClick={() => dispatch(logoutUser())} className="underline underline-offset-2 hover:text-tangerine">
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="border border-paper text-paper text-xs tracking-wide px-5 py-2 rounded-full hover:bg-paper hover:text-ink transition-colors"
            >
              LOGIN
            </button>
          )}

          <Link to="/cart" className="relative w-10 h-10 rounded-full bg-paper flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-ink" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-tangerine text-ink text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-ink border-b border-[rgba(243,239,230,0.14)] px-6 py-5 flex flex-col gap-4">
          <form onSubmit={handleSearchSubmit}>
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-[#1c1b22] border border-[rgba(243,239,230,0.2)] rounded-full text-sm px-4 py-2.5 outline-none focus:border-tangerine text-paper"
            />
          </form>

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm text-paper/80 tracking-wide"
          >
            All products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/?category=${cat._id}`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-paper/80 tracking-wide capitalize"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            to="/?sort=newest"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm text-paper/80 tracking-wide"
          >
            New arrivals
          </Link>
        </div>
      )}

      {authOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-ink/80" onClick={() => setAuthOpen(false)} />
          <div className="relative bg-[#1c1b22] border border-[rgba(243,239,230,0.14)] w-full max-w-sm rounded-2xl p-7 text-paper">
            <button onClick={() => setAuthOpen(false)} className="absolute top-4 right-4 text-paper/50 hover:text-paper">
              <X size={18} />
            </button>
            <h2 className="font-display text-2xl uppercase mb-5">{mode === "login" ? "Login" : "Sign up"}</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === "register" && (
                <input
                  name="phonenumber"
                  placeholder="Phone number"
                  value={form.phonenumber}
                  onChange={handleChange}
                  className="w-full bg-ink border border-[rgba(243,239,230,0.2)] rounded-lg p-2.5 text-sm outline-none focus:border-tangerine"
                  required
                />
              )}
              <input
                name="name"
                placeholder="Username"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-ink border border-[rgba(243,239,230,0.2)] rounded-lg p-2.5 text-sm outline-none focus:border-tangerine"
                required={mode === "register"}
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-ink border border-[rgba(243,239,230,0.2)] rounded-lg p-2.5 text-sm outline-none focus:border-tangerine"
                required={mode === "register"}
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-ink border border-[rgba(243,239,230,0.2)] rounded-lg p-2.5 text-sm outline-none focus:border-tangerine"
                required
              />

              {error && <p className="text-tangerine text-xs">{error}</p>}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-paper text-ink font-bold text-sm py-2.5 rounded-lg hover:bg-acid transition-colors disabled:opacity-50"
              >
                {status === "loading" ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
              </button>
            </form>

            <p className="text-xs text-paper/50 mt-4 text-center">
              {mode === "login" ? "New here?" : "Already have an account?"}{" "}
              <button
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-tangerine underline underline-offset-2"
              >
                {mode === "login" ? "Sign up" : "Login"}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;