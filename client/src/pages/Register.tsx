import { Layout, theme } from "antd";
import { useSelector } from "react-redux";

import { RootState } from "../redux/store";

import LandingHeader from "../components/LandingHeader";
import MainFooter from "../components/MainFooter";

const { Header, Content, Footer } = Layout;

const Register = () => {
  const isDarkMode = useSelector<RootState, boolean>(
    (state) => state.users.isDarkMode
  );

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <>
      <LandingHeader
        Header={Header}
        isDarkMode={isDarkMode}
        colorBgContainer={colorBgContainer}
      />
      <Layout className={`${isDarkMode ? "bg-zinc-900" : ""}`}>
        <Content
          className="mt-[80px] mb-0 mx-[10px] sm:mt-[100px] sm:mx-[40px]"
          style={{ overflow: "initial" }}
        >
          <div
            className={`rounded-md ${isDarkMode ? "" : ""}`}
            style={{
              minHeight: "100vh",
              padding: 24,
              color: isDarkMode ? "#fff" : undefined,
              // background: !isDarkMode ? colorBgContainer : undefined,
            }}
          >
            Register
          </div>
        </Content>
      </Layout>
      <MainFooter Footer={Footer} isDarkMode={isDarkMode} />
    </>
  );
};

export default Register;
