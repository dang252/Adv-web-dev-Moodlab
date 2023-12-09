import { Layout, Switch, Space, Dropdown, MenuProps, Avatar } from "antd";
import {
  UserOutlined,
  PoweroffOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { IoSunny } from "react-icons/io5";
import { FiMoon } from "react-icons/fi";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { IoMdAdd, IoMdArrowRoundForward, IoLogoOctocat } from "react-icons/io";
import { useSelector } from "react-redux";

import { RootState } from "../redux/store";

import NotiDropdown from "./NotiDropdown";
import { useState, useRef, useEffect } from "react";

import CreateClassModal from "./CreateClassModal";
import JoinClassModal from "./JoinClassModal";
import { toast } from "react-toastify";
import { useAppDispatch } from "../redux/hooks";
import { logoutAccount, refresh } from "../redux/reducers/user.reducer";
const { Header } = Layout;

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
  const dispathAsync = useAppDispatch();
  const {
    Header,
    colorBgContainer,
    Switch,
    switchMode,
    onClick,
    triggerOpen,
    setTriggerOpen,
  } = props;

  const headerRef = useRef<any>(null);

  const isDarkMode = useSelector<RootState, boolean>(
    (state) => state.users.isDarkMode
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isModalJoinOpen, setIsModalJoinOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 45) headerRef.current.style.zIndex = 20;
      else headerRef.current.style.zIndex = 0;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //==================== Create Class modal
  const showCreateClassModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateClassCancel = () => {
    setIsCreateModalOpen(false);
  };

  //==================== Join Class modal
  const showJoinClassModal = () => {
    setIsModalJoinOpen(true);
  };

  const handleJoinClassCancel = () => {
    setIsModalJoinOpen(false);
  };

  //====================

  const createItems: MenuProps["items"] = [
    {
      key: "create",
      danger: false,
      label: "Create class",
      icon: <AiOutlineAppstoreAdd />,
      onClick: () => {
        // console.log("Add class");
        showCreateClassModal();
      },
    },
    {
      key: "join",
      danger: false,
      label: "Join class",
      icon: <IoMdArrowRoundForward />,
      onClick: () => {
        // console.log("Join class");
        showJoinClassModal();
      },
    },
  ];

  const userItems: MenuProps["items"] = [
    {
      key: "logout",
      danger: true,
      label: "Đăng xuất",
      icon: <PoweroffOutlined />,
      onClick: async () => {
        for (let i = 0; i <= 1; i++) {
          try {
            await dispathAsync(logoutAccount()).unwrap();
            toast.success("Logout successfully");
            return;
          } catch (err) {
            console.log(err);
            await dispathAsync(refresh()).unwrap();
          }
        }
        toast.error("Logout failed! please try again later");
      },
    },
  ];

  return (
    <>
      <CreateClassModal
        isModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        handleCancel={handleCreateClassCancel}
      />
      <JoinClassModal
        isModalOpen={isModalJoinOpen}
        setIsModalJoinOpen={setIsModalJoinOpen}
        handleCancel={handleJoinClassCancel}
      />
      <Header
        ref={headerRef}
        style={{
          background: !isDarkMode ? colorBgContainer : undefined,
          position: "fixed",
        }}
        className="fixed w-[100%] flex items-center px-[20px] py-[30px] sm:py-[40px] sm:w-[calc(100%-200px)] sm:justify-between"
      >
        <div className="w-[100%] flex justify-between items-center sm:hidden sm:w-auto">
          <IoLogoOctocat className="text-3xl" />
          <div className="flex items-center gap-14">
            <NotiDropdown />
            <div
              className={`z-30 border border-solid rounded-md border-white w-[30px] h-[30px] flex justify-center items-center p-5 hover:border-blue-500 hover:text-blue-500 hover:cursor-pointer ${
                isDarkMode ? "border-gray-500" : "border-gray-700"
              }`}
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
            <NotiDropdown />
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
