import { useEffect } from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";

import DetailClassNews from "../components/DetailClassNews";
import DetailClassMembers from "../components/DetailClassMembers";
import DetailClassResults from "../components/DetailClassResults";

interface PropType {
  isDarkMode: boolean;
  colorBgContainer: string;
}

const DetailClass = (props: PropType) => {
  const { isDarkMode } = props;

  const className: string = "Lớp học tình yêu";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "News",
      children: <DetailClassNews className={className} />,
    },
    // {
    //   key: "2",
    //   label: "Assignments",
    //   children: (
    //     <div className="w-[100%] 2xl:w-[70%] mx-auto flex flex-col items-center"></div>
    //   ),
    // },
    {
      key: "2",
      label: "Members",
      children: <DetailClassMembers />,
    },
    {
      key: "3",
      label: "Results",
      children: <DetailClassResults />,
    },
  ];

  return (
    <div
      className={`rounded-md ${isDarkMode ? "" : ""}`}
      style={{
        minHeight: "100vh",
        color: isDarkMode ? "#fff" : undefined,
        // background: !isDarkMode ? colorBgContainer : undefined,
      }}
    >
      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
        className="w-[100%]"
        // indicatorSize={(origin) => origin - 16}
      />
    </div>
  );
};

export default DetailClass;
