import { Navigate } from "react-router-dom";

// Reduc/redux-toolkit config import
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const ProtectedRoute = ({ children }: any) => {
  const accessToken: string = useSelector<RootState, string>(
    (state) => state.persisted.users.currentId
  );

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;