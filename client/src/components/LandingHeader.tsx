import { Space, Switch, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { IoLogoOctocat } from "react-icons/io";
import { IoSunny } from "react-icons/io5";
import { FiMoon } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

import MobileLandingNav from "./MobileLandingNav";

interface PropType {
  Header: any;
  isDarkMode: boolean;
  colorBgContainer: string;
  triggerOpen: boolean;
  setTriggerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  switchMode: (_checked: boolean) => void;
}

const LandingHeader = (props: PropType) => {
  const {
    Header,
    isDarkMode,
    colorBgContainer,
    triggerOpen,
    setTriggerOpen,
    switchMode,
  } = props;

  const navigate = useNavigate();

  return (
    <>
      <MobileLandingNav
        triggerOpen={triggerOpen}
        setTriggerOpen={setTriggerOpen}
        switchMode={switchMode}
      />
      <Header
        style={{
          background: !isDarkMode ? colorBgContainer : undefined,
          position: "fixed",
          zIndex: 1,
        }}
        className="fixed w-[100%] flex items-center px-[20px] py-[30px] sm:px-[40px] sm:py-[40px] sm:justify-between"
      >
        <div className="w-[100%] flex justify-between items-center sm:hidden sm:w-auto">
          <Link
            to="/"
            className={`flex ${isDarkMode ? "text-white" : "text-black"}`}
          >
            <IoLogoOctocat className="text-3xl hover:cursor-pointer hover:text-blue-500" />
          </Link>
          <div className="flex items-center gap-14">
            <div
              className="border border-solid border-gray-600 rounded-md border-white w-[30px] h-[30px] flex justify-center items-center p-5 hover:border-blue-500 hover:text-blue-500 hover:cursor-pointer"
              onClick={() => {
                setTriggerOpen(!triggerOpen);
              }}
            >
              <MenuOutlined className="text-xl" />
            </div>
          </div>
        </div>
        <div
          className="hidden sm:flex sm:items-center sm:gap-5 hover:text-blue-500 hover:cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        >
          <div className="flex">
            <IoLogoOctocat className="text-3xl" />
          </div>
          {window.location.href.includes("/login") && (
            <p className="text-xl font-bold text-center">Moodlab | Login</p>
          )}
          {window.location.href.includes("/register") && (
            <p className="text-xl font-bold text-center">Moodlab | Register</p>
          )}
          {!window.location.href.includes("/login") &&
            !window.location.href.includes("/register") && (
              <p className="text-xl font-bold text-center">Moodlab</p>
            )}
        </div>
        <Space className="hidden sm:flex" size="large">
          <div className="flex gap-5 items-center">
            <Switch
              checkedChildren={<IoSunny className="text-md mt-[5px]" />}
              unCheckedChildren={<FiMoon className="text-md mt-[5px]" />}
              defaultChecked
              onChange={switchMode}
            />
            {!window.location.href.includes("/login") && (
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            )}
            {!window.location.href.includes("/register") && (
              <Link to="/register">
                <Button type="primary">Register</Button>
              </Link>
            )}
          </div>
        </Space>
      </Header>
    </>
  );
};

export default LandingHeader;
