import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("user");
  return token ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
