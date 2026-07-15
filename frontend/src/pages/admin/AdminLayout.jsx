import { NavLink, Outlet, Link } from "react-router-dom";

const links = [
  { to: "/admin/products", label: "Products" },
  { to: "/admin/upload", label: "Upload product" },
  { to: "/admin/categories", label: "Categories" },
];

const AdminLayout = () => {
  return (
    <div className="bg-ink text-paper min-h-screen flex">
      <aside className="w-56 shrink-0 border-r border-[rgba(243,239,230,0.14)] px-5 py-8 hidden md:block">
        <Link to="/" className="font-display text-sm tracking-wide block mb-8 text-paper/60 hover:text-paper">
          ← BACK TO SITE
        </Link>
        <p className="text-xs text-paper/40 tracking-widest mb-4">ADMIN PANEL</p>
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? "bg-paper text-ink font-medium" : "text-paper/70 hover:bg-[#1c1b22]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 px-6 md:px-10 py-8 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;