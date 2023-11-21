import { createElement } from "react";
import { useEffect, useState } from "react";
import { Menu, Drawer, MenuProps } from "antd";
import { useSelector } from "react-redux";
import { HomeOutlined } from "@ant-design/icons";
import { SiGoogleclassroom } from "react-icons/si";
import { IoLogoOctocat } from "react-icons/io";

import { RootState } from "../redux/store";

interface PropType {
  triggerOpen: boolean;
  setTriggerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNav: any;
  navLabel: string[];
  navValue: string;
}

const MobileNav = (props: PropType) => {
  const { triggerOpen, setTriggerOpen, setNav, navLabel, navValue } = props;

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
