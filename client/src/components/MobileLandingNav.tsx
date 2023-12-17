import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Drawer, Switch, Button } from "antd";
import { IoLogoOctocat } from "react-icons/io";
import { IoSunny } from "react-icons/io5";
import { FiMoon } from "react-icons/fi";

import { RootState } from "../redux/store";
import { Link } from "react-router-dom";

interface PropType {
  triggerOpen: boolean;
  setTriggerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  switchMode: (_checked: boolean) => void;
}

const MobileLandingNav = (props: PropType) => {
  const { triggerOpen, setTriggerOpen, switchMode } = props;

  const isDarkMode = useSelector<RootState, boolean>(
    (state) => state.persisted.users.isDarkMode
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
        <Link to="/" className={`${isDarkMode ? "text-white" : "text-black"}`}>
          <div className="flex gap-3 justify-center hover:cursor-pointer hover:text-blue-500">
            <IoLogoOctocat className="text-3xl" />
            <p className="text-xl font-bold">Moolab</p>
          </div>
        </Link>
        <div className="my-10 flex gap-5 justify-end">
          <Switch
            checkedChildren={<IoSunny className="text-md mt-[5px]" />}
            unCheckedChildren={<FiMoon className="text-md mt-[5px]" />}
            defaultChecked
            onChange={switchMode}
          />
        </div>
        <div className="flex flex-col gap-5 mt-10">
          <Link to="/login">
            <Button className="w-full">Login</Button>
          </Link>
          <Link to="/register">
            <Button type="primary" className="w-full">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </Drawer>
  );
};

export default MobileLandingNav;
