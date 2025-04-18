import { Navigate } from "react-router-dom";
import AdminPanel from "./AdminPanel";

const AdminRoute = () => {
  // In a real application, you would check for authentication here
  const isAuthenticated = true; // This would be a real auth check

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <AdminPanel />;
};

export default AdminRoute;
