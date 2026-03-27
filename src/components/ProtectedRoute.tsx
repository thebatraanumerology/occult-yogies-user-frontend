import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/src/context/AuthContext";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;