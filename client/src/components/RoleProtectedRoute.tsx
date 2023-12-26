import { Navigate } from "react-router-dom";

// Reduc/redux-toolkit config import
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const RoleProtectedRoute = ({ children, roles }: any) => {
  const role: string = useSelector<RootState, string>(
    (state) => state.persisted.users.role
  );

  if (!roles.includes(role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default RoleProtectedRoute;
