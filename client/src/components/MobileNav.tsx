import { createElement } from "react";
import { useEffect, useState } from "react";
import { Menu, Drawer, MenuProps, Switch } from "antd";
import { useSelector } from "react-redux";
import { HomeOutlined } from "@ant-design/icons";
import { SiGoogleclassroom } from "react-icons/si";
import { IoLogoOctocat } from "react-icons/io";
import { IoSunny } from "react-icons/io5";
import { FiMoon } from "react-icons/fi";

import { RootState } from "../redux/store";

interface PropType {
  triggerOpen: boolean;
  setTriggerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNav: any;
  navLabel: string[];
  navValue: string;
  switchMode: (_checked: boolean) => void;
}

const MobileNav = (props: PropType) => {
  const {
    triggerOpen,
    setTriggerOpen,
    setNav,
    navLabel,
    navValue,
    switchMode,
  } = props;

  const items: MenuProps["items"] = [HomeOutlined, SiGoogleclassroom].map(
    (icon, index) => ({
      key: String(index + 1),
      icon: createElement(icon),
      label: navLabel[index],
    })
  );

  const isDarkMode = useSelector<RootState, boolean>(
    (state) => state.users.isDarkMode
  );

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
    setTriggerOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setTriggerOpen(false);
  };

  useEffect(() => {
    if (triggerOpen) showDrawer();
    else onClose();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerOpen]);

  return (
    <Drawer placement="left" onClose={onClose} open={open}>
      <div className={isDarkMode ? "text-white" : "text-black"}>
        <div className="flex gap-3 justify-center">
          <IoLogoOctocat className="text-3xl" />
          <p className="text-xl font-bold">Moolab</p>
        </div>
        <div className="my-10 flex gap-5 justify-end">
          <Switch
            checkedChildren={<IoSunny className="text-md mt-[5px]" />}
            unCheckedChildren={<FiMoon className="text-md mt-[5px]" />}
            defaultChecked
            onChange={switchMode}
          />
        </div>
        <Menu
          className={`mt-5 ${isDarkMode ? "bg-[#1f1f1f]" : "bg-white"}`}
          theme={isDarkMode ? "dark" : "light"}
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={items}
          onClick={setNav}
          selectedKeys={[navValue]}
        />
      </div>
    </Drawer>
  );
};

export default MobileNav;
