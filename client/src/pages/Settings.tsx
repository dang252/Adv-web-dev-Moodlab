import { useEffect } from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";

import SettingProfile from "../components/SettingProfile";

interface PropType {
  isDarkMode: boolean;
  colorBgContainer: string;
}

const Settings = (props: PropType) => {
  const { isDarkMode } = props;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Profile",
      children: <SettingProfile />,
    },
    // {
    //   key: "2",
    //   label: "Assignments",
    //   children: (
    //     <div className="w-[100%] 2xl:w-[70%] mx-auto flex flex-col items-center"></div>
    //   ),
    // },
  ];

  return (
    <div
      className={`rounded-md ${isDarkMode ? "" : ""}`}
      style={{
        minHeight: "100vh",
        // padding: 24,
        color: isDarkMode ? "#fff" : undefined,
        // background: !isDarkMode ? colorBgContainer : undefined,
      }}
    >
      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
        className="w-[100%]"
      />
    </div>
  );
};

export default Settings;
