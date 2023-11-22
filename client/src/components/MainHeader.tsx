import { Layout, Switch, Space, Dropdown, MenuProps, Badge } from "antd";
import {
  DownOutlined,
  UserOutlined,
  PoweroffOutlined,
  BellOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { IoSunny } from "react-icons/io5";
import { FiMoon } from "react-icons/fi";
import { IoLogoOctocat } from "react-icons/io";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { RootState } from "../redux/store";

const { Header } = Layout;

const items: MenuProps["items"] = [
  {
    key: "profile",
    label: <Link to="/dashboard/profile">Profile</Link>,
    icon: <UserOutlined />,
  },
  {
    key: "logout",
    danger: true,
    label: "Đăng xuất",
    icon: <PoweroffOutlined />,
  },
];

interface propType {
  Header: typeof Header;
  colorBgContainer: string;
  Switch: typeof Switch;
  switchMode: (_checked: boolean) => void;
  name: string;
  onClick: any; // MenuProps["onClick"]
  triggerOpen: boolean;
  setTriggerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MainHeader = (props: propType) => {
  const {
    Header,
    colorBgContainer,
    Switch,
    switchMode,
    name,
    onClick,
    triggerOpen,
    setTriggerOpen,
  } = props;

  const isDarkMode = useSelector<RootState, boolean>(
    (state) => state.users.isDarkMode
  );

  return (
    <>
      <Header
        style={{
          background: !isDarkMode ? colorBgContainer : undefined,
          position: "fixed",
        }}
        className="fixed w-[100%] flex items-center px-[20px] py-[30px] sm:py-[40px] sm:w-[calc(100%-200px)] sm:justify-between"
      >
        <div className="w-[100%] flex justify-between items-center sm:hidden sm:w-auto">
          <IoLogoOctocat className="text-3xl" />
          <div className="flex items-center gap-14">
            <Badge
              count={1}
              className="hover:cursor-pointer hover:text-blue-500"
            >
              <BellOutlined className="text-2xl" onClick={() => {}} />
            </Badge>
            <div
              className="border border-solid border-gray-500 rounded-md border-white w-[30px] h-[30px] flex justify-center items-center p-5 hover:border-blue-500 hover:text-blue-500 hover:cursor-pointer"
              onClick={() => {
                setTriggerOpen(!triggerOpen);
              }}
            >
              <MenuOutlined className="text-xl" />
            </div>
          </div>
        </div>
        <div className="hidden sm:flex">
          <p className="text-xl font-bold text-center">Your Workspace</p>
        </div>
        <Space className="px-10 hidden sm:flex" size="large">
          <div className="flex gap-5">
            <Switch
              checkedChildren={<IoSunny className="text-md mt-[5px]" />}
              unCheckedChildren={<FiMoon className="text-md mt-[5px]" />}
              defaultChecked
              onChange={switchMode}
            />
            <Badge
              count={1}
              className="ml-5 mr-12 hover:cursor-pointer hover:text-blue-500"
            >
              <BellOutlined className="text-2xl" onClick={() => {}} />
            </Badge>
          </div>
          <Dropdown
            menu={{
              onClick: onClick,
              items: items,
            }}
          >
            <a
              className={`${!isDarkMode ? "text-black" : "text-white"}`}
              onClick={(e) => onClick(e)}
            >
              <Space>
                {name}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </Space>
      </Header>
    </>
  );
};

export default MainHeader;
