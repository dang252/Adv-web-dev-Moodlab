import { useState } from "react";
import { ConfigProvider, theme } from "antd";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";
import NonAuthRoute from "./components/NonAuthRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

import { RootState } from "./redux/store";

import "./App.css";
import { useEffect } from "react";
import { useAppDispatch } from "./redux/hooks";
import { stopLoad } from "./redux/reducers/user.reducer";
import { axiosAuthRequest, axiosAuthResponse } from "./config/axios";

const { defaultAlgorithm, darkAlgorithm } = theme;

const App = () => {
  const [triggerOpen, setTriggerOpen] = useState<boolean>(false);

  const dispatch = useDispatch();

  const isDarkMode = useSelector<RootState, boolean | undefined>(
    (state) => state.persisted.users.isDarkMode
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const checkTheme: any = localStorage.getItem("isDarkMode");

    if (checkTheme == null) {
      localStorage.setItem("isDarkMode", "false");
    } else {
      const theme: boolean = JSON.parse(checkTheme);
      if (theme !== isDarkMode) {
        dispatch({ type: "users/setTheme" });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchMode = (_checked: boolean) => {
    dispatch({ type: "users/setTheme" });
    sessionStorage.setItem("mode", JSON.stringify(!isDarkMode));
  };

  const dispathAsync = useAppDispatch();

  useEffect(() => {
    const stopLoading = () => {
      dispathAsync(stopLoad());
    };
    window.addEventListener("beforeunload", stopLoading);

    return () => {
      window.removeEventListener("beforeunload", stopLoading);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  axiosAuthRequest;
  axiosAuthResponse;

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        <Route
          path="/"
          element={
            <NonAuthRoute>
              <Landing
                triggerOpen={triggerOpen}
                setTriggerOpen={setTriggerOpen}
                switchMode={switchMode}
              />
            </NonAuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <NonAuthRoute>
              <Register
                triggerOpen={triggerOpen}
                setTriggerOpen={setTriggerOpen}
                switchMode={switchMode}
              />
            </NonAuthRoute>
          }
        />
        <Route
          path="/login"
          element={
            <NonAuthRoute>
              <Login
                triggerOpen={triggerOpen}
                setTriggerOpen={setTriggerOpen}
                switchMode={switchMode}
              />
            </NonAuthRoute>
          }
        />
        <Route
          path="/forgot"
          element={
            <NonAuthRoute>
              <ForgotPassword
                triggerOpen={triggerOpen}
                setTriggerOpen={setTriggerOpen}
                switchMode={switchMode}
              />
            </NonAuthRoute>
          }
        />
        <Route
          path="/forgot/:token"
          element={
            <NonAuthRoute>
              <ResetPassword
                triggerOpen={triggerOpen}
                setTriggerOpen={setTriggerOpen}
                switchMode={switchMode}
              />
            </NonAuthRoute>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute roles={["ADMIN"]}>
                <Admin />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/*"
          element={<NotFound baseUrl="/" isDarkMode={isDarkMode} />}
        />
      </Routes>
    </ConfigProvider>
  );
};

export default App;
