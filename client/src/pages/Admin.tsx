import React, { useEffect, useState } from "react";
import { Layout, MenuProps, theme, Switch } from "antd";
import { HomeOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate, Routes, Route } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { SiGoogleclassroom } from "react-icons/si";

const { Header, Content, Footer, Sider } = Layout;

import MainHeader from "../components/MainHeader";
import Navigation from "../components/Navigation";
import MainFooter from "../components/MainFooter";
import MobileNav from "../components/MobileNav";

import AdminManageUser from "./AdminManageUser";
import AdminManageClass from "./AdminManageClass";
import AdminStudentAccount from "./AdminStudentAccount";

const navLabel = ["Manage user", "Manage class", "Student account"];

const items: MenuProps["items"] = [
  HomeOutlined,
  SiGoogleclassroom,
  SettingOutlined,
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: navLabel[index],
}));

const Admin = () => {
  const [navValue, setNavValue] = useState<string>("1");
  const [triggerOpen, setTriggerOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const isDarkMode = useSelector<RootState, boolean>(
    (state) => state.persisted.users.isDarkMode
  );

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    document.title = "Moodlab | Admin";
  }, []);

  useEffect(() => {
    if (window.location.href.includes("/admin/manageclass")) {
      setNavValue("2");
      document.title = "Moodlab | Admin manage class";
    }
    if (window.location.href.includes("/admin/studentaccount")) {
      setNavValue("3");
      document.title = "Moodlab | Admin student account";
    }
  }, []);

  const setNav: MenuProps["onClick"] = (e: any) => {
    if (e.domEvent.target.textContent === "Manage user") {
      document.title = "Moodlab | Admin";
      navigate("/admin");
      setNavValue("1");
    }
    if (e.domEvent.target.textContent === "Manage class") {
      document.title = "Moodlab | Admin manage class";
      navigate("/admin/manageclass");
      setNavValue("2");
    }
    if (e.domEvent.target.textContent === "Student account") {
      document.title = "Moodlab | Admin student account";
      navigate("/admin/studentaccount");
      setNavValue("3");
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
          setNavValue={setNavValue}
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
                  <AdminManageUser
                    isDarkMode={isDarkMode}
                    colorBgContainer={colorBgContainer}
                  />
                }
              />
              <Route
                path="/manageclass"
                element={
                  <AdminManageClass
                    isDarkMode={isDarkMode}
                    colorBgContainer={colorBgContainer}
                  />
                }
              />
              <Route
                path="/studentaccount"
                element={
                  <AdminStudentAccount
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

export default Admin;
