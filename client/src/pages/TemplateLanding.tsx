import { useEffect } from "react";
import { useSelector } from "react-redux";

import { RootState } from "../redux/store";
import { Layout, theme } from "antd";
import { useTitle } from "../hooks/useTitle";

import LandingHeader from "../components/LandingHeader";

const { Header, Content } = Layout;

interface PropType {
  triggerOpen: boolean;
  setTriggerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  switchMode: (_checked: boolean) => void;
}

const TemplateLanding = (props: PropType) => {
  const { triggerOpen, setTriggerOpen, switchMode } = props;

  const isDarkMode = useSelector<RootState, boolean>(
    (state) => state.users.isDarkMode
  );

  useTitle("Moodlab | Forget Password");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <>
      <LandingHeader
        Header={Header}
        isDarkMode={isDarkMode}
        colorBgContainer={colorBgContainer}
        triggerOpen={triggerOpen}
        setTriggerOpen={setTriggerOpen}
        switchMode={switchMode}
      />
      <Layout className={`${isDarkMode ? "bg-zinc-900" : ""}`}>
        <Content
          className="mt-[30px] mb-[30px] mx-[10px] sm:mt-[100px] sm:mx-[40px]"
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
          ></div>
        </Content>
      </Layout>
    </>
  );
};

export default TemplateLanding;
