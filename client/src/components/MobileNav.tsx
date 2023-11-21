import { useEffect, useState } from "react";
import { Drawer, MenuProps } from "antd";
import { useSelector } from "react-redux";
import { HomeOutlined } from "@ant-design/icons";
import { SiGoogleclassroom } from "react-icons/si";

import { RootState } from "../redux/store";

const items: MenuProps["items"] = [HomeOutlined, SiGoogleclassroom].map(
  (icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: navLabel[index],
  })
);

interface PropType {
  triggerOpen: boolean;
  setTriggerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navLabel: string[];
}

const MobileNav = (props: PropType) => {
  const { triggerOpen, setTriggerOpen } = props;

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
        <p>Moolab</p>
      </div>
    </Drawer>
  );
};

export default MobileNav;
