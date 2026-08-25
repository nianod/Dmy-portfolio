import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const authenticated =
    sessionStorage.getItem("logger_authenticated") === "true";

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;