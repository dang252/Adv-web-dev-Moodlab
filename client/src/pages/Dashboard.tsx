import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HomeOutlined } from "@ant-design/icons";
import { SiGoogleclassroom } from "react-icons/si";
import { Layout, MenuProps, theme, Switch } from "antd";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { RootState } from "../redux/store";

import MainHeader from "../components/MainHeader";
import Navigation from "../components/Navigation";
import MainFooter from "../components/MainFooter";
import MobileNav from "../components/MobileNav";

import Home from "./Home";
import Classes from "./Classes";
import Profile from "./Profile";

const { Header, Content, Footer, Sider } = Layout;

const navLabel = ["Home", "Classes"];

const items: MenuProps["items"] = [HomeOutlined, SiGoogleclassroom].map(
  (icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: navLabel[index],
  })
);

const Dashboard = () => {
  const [navValue, setNavValue] = useState<string>("1");
  const [triggerOpen, setTriggerOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const isDarkMode = useSelector<RootState, boolean>(
    (state) => state.users.isDarkMode
  );

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    document.title = "Moodlab | Dashboard";
  }, []);

  const setNav: MenuProps["onClick"] = (e: any) => {
    if (e.domEvent.target.textContent === "Home") {
      document.title = "Moodlab | Dashboard";
      navigate("/dashboard");
      setNavValue("1");
    }
    if (e.domEvent.target.textContent === "Classes") {
      document.title = "Moodlab | Classes";
      navigate("/dashboard/classes");
      setNavValue("2");
    }
  };

  const switchMode = (_checked: boolean) => {
    dispatch({ type: "users/setTheme" });
    sessionStorage.setItem("mode", JSON.stringify(!isDarkMode));
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    // console.log("click", e);
    if (e.key === "logout") {
      //logout
    }
  };

  return (
    <>
      <MobileNav
        triggerOpen={triggerOpen}
        setTriggerOpen={setTriggerOpen}
        setNav={setNav}
        navLabel={navLabel}
        navValue={navValue}
        switchMode={switchMode}
      />
      <Layout hasSider>
        <Navigation
          Sider={Sider}
          isDarkMode={isDarkMode}
          items={items}
          onClick={setNav}
          navValue={navValue}
        />
        <Layout className={`sm:ml-[230px] ${isDarkMode ? "bg-zinc-900" : ""}`}>
          <MainHeader
            Header={Header}
            colorBgContainer={colorBgContainer}
            Switch={Switch}
            switchMode={switchMode}
            name={"Cậu bé cô đơn"}
            onClick={handleMenuClick}
            triggerOpen={triggerOpen}
            setTriggerOpen={setTriggerOpen}
          />
          <Content style={{ margin: "100px 20px 0", overflow: "initial" }}>
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    isDarkMode={isDarkMode}
                    colorBgContainer={colorBgContainer}
                  />
                }
              />
              <Route
                path="/classes"
                element={
                  <Classes
                    isDarkMode={isDarkMode}
                    colorBgContainer={colorBgContainer}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <Profile
                    isDarkMode={isDarkMode}
                    colorBgContainer={colorBgContainer}
                  />
                }
              />
            </Routes>
          </Content>
          <MainFooter isDarkMode={isDarkMode} Footer={Footer} />
        </Layout>
      </Layout>
    </>
  );
};

export default Dashboard;
