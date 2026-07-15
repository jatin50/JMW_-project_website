import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// blocks access to everything under /admin unless the logged-in user has role:"admin"
const AdminRoute = () => {
  const { currentUser, isAuthenticated, authChecked } = useSelector((state) => state.user);

  if (!authChecked) {
    return <div className="bg-ink  min-h-screen flex items-center justify-center text-sm text-paper/50">Checking access...</div>;
  }

  if (!isAuthenticated || currentUser?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;