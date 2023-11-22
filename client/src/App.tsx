import { useState } from "react";
import { ConfigProvider, theme } from "antd";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import { RootState } from "./redux/store";

import "./App.css";
import { useEffect } from "react";

const { defaultAlgorithm, darkAlgorithm } = theme;

const App = () => {
  const [triggerOpen, setTriggerOpen] = useState<boolean>(false);

  const dispatch = useDispatch();

  const isDarkMode = useSelector<RootState, boolean | undefined>(
    (state) => state.users.isDarkMode
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

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <Routes>
        <Route
          path="/"
          element={
            <Landing
              triggerOpen={triggerOpen}
              setTriggerOpen={setTriggerOpen}
              switchMode={switchMode}
            />
          }
        />
        <Route
          path="/register"
          element={
            <Register
              triggerOpen={triggerOpen}
              setTriggerOpen={setTriggerOpen}
              switchMode={switchMode}
            />
          }
        />
        <Route
          path="/login"
          element={
            <Login
              triggerOpen={triggerOpen}
              setTriggerOpen={setTriggerOpen}
              switchMode={switchMode}
            />
          }
        />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </ConfigProvider>
  );
};

export default App;
