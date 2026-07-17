import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// blocks access unless the user is logged in - used for pages that only make
// sense for an account, like order history (mirrors AdminRoute's pattern)
const RequireAuth = () => {
  const { isAuthenticated, authChecked } = useSelector((state) => state.user);

  if (!authChecked) {
    return (
      <div className="bg-ink min-h-screen flex items-center justify-center text-sm text-paper/50">
        Checking access...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;