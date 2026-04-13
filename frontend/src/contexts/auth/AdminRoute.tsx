import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/auth/useAuth";

const AdminRoute = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  console.log(user?.role)

  return <Outlet />;
};

export default AdminRoute;
