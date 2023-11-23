import {
  Layout,
  Switch,
  Space,
  Dropdown,
  MenuProps,
  Badge,
  Avatar,
} from "antd";
import {
  UserOutlined,
  PoweroffOutlined,
  BellOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { IoSunny } from "react-icons/io5";
import { FiMoon } from "react-icons/fi";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { IoMdAdd, IoMdArrowRoundForward, IoLogoOctocat } from "react-icons/io";
import { useSelector } from "react-redux";

import { RootState } from "../redux/store";

import NotiDropdown from "./NotiDropdown";
import { useState } from "react";

const { Header } = Layout;

const userItems: MenuProps["items"] = [
  {
    key: "logout",
    danger: true,
    label: "Đăng xuất",
    icon: <PoweroffOutlined />,
  },
];

const createItems: MenuProps["items"] = [
  {
    key: "create",
    danger: false,
    label: "Create class",
    icon: <AiOutlineAppstoreAdd />,
    onClick: () => {
      console.log("Add class");
    },
  },
  {
    key: "join",
    danger: false,
    label: "Join class",
    icon: <IoMdArrowRoundForward />,
    onClick: () => {
      console.log("Join class");
    },
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
    onClick,
    triggerOpen,
    setTriggerOpen,
  } = props;

  const [triggerNoti, setTriggerNoti] = useState<boolean>(false);

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
        <NotiDropdown
          triggerNoti={triggerNoti}
          setTriggerNoti={setTriggerNoti}
          isDarkMode={isDarkMode}
        />
        <div className="w-[100%] flex justify-between items-center sm:hidden sm:w-auto">
          <IoLogoOctocat className="text-3xl" />
          <div className="flex items-center gap-14">
            <Badge
              count={1}
              className="hover:cursor-pointer hover:text-blue-500"
            >
              <BellOutlined
                className="text-2xl"
                onClick={() => {
                  setTriggerNoti(!triggerNoti);
                }}
              />
            </Badge>
            <div
              className="border border-solid z-30 border-gray-500 rounded-md border-white w-[30px] h-[30px] flex justify-center items-center p-5 hover:border-blue-500 hover:text-blue-500 hover:cursor-pointer"
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
          <div className="flex items-center gap-10">
            <Switch
              checkedChildren={<IoSunny className="text-md mt-[5px]" />}
              unCheckedChildren={<FiMoon className="text-md mt-[5px]" />}
              defaultChecked
              onChange={switchMode}
            />
            <Badge
              count={1}
              className="relative hover:cursor-pointer hover:text-blue-500"
            >
              <BellOutlined
                className="text-2xl"
                onClick={() => {
                  console.log(setTriggerNoti(!triggerNoti));
                }}
              />
            </Badge>
            <Dropdown
              menu={{ items: createItems }}
              className="z-30"
              placement="bottomRight"
            >
              <div
                className={`w-[30px] h-[30px] rounded-full border border-solid border-gray-500 flex justify-center items-center hover:cursor-pointer ${
                  isDarkMode ? "bg-blue-500 border-blue-500" : ""
                }`}
              >
                <IoMdAdd />
              </div>
            </Dropdown>
            <Dropdown
              menu={{
                onClick: onClick,
                items: userItems,
              }}
              overlayStyle={{ top: 65 }}
            >
              <a
                className={`${!isDarkMode ? "text-black" : "text-white"}`}
                onClick={(e) => onClick(e)}
              >
                <Space>
                  <Avatar icon={<UserOutlined />} />
                </Space>
              </a>
            </Dropdown>
          </div>
        </Space>
      </Header>
    </>
  );
};

export default MainHeader;
