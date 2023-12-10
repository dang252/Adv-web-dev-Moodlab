import { Navigate } from "react-router-dom";

// Reduc/redux-toolkit config import
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const NonAuthRoute = ({ children }: any) => {
    const isLogin: string = useSelector<RootState, string>(
        (state) => state.users.email
    );

    if (isLogin) {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default NonAuthRoute;