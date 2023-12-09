import { useEffect } from "react";
import { Tabs, Spin } from "antd";
import type { TabsProps } from "antd";
import { useParams } from "react-router-dom";

import { useSelector } from "react-redux";
import { useAppDispatch } from "../redux/hooks";
import { RootState } from "../redux/store";

import { getDetailClass } from "../redux/reducers/class.reducer";

import DetailClassNews from "../components/DetailClassNews";
import DetailClassMembers from "../components/DetailClassMembers";
import DetailClassResults from "../components/DetailClassResults";
import { ClassType } from "../types/classroom";

interface PropType {
  isDarkMode: boolean;
  colorBgContainer: string;
}

const DetailClass = (props: PropType) => {
  const { isDarkMode } = props;

  const params = useParams();
  const { id } = params;

  const dispatchAsync = useAppDispatch();

  const isLoading = useSelector<RootState, boolean>(
    (state) => state.classes.isLoading
  );

  const detailClass = useSelector<RootState, ClassType | null>(
    (state) => state.classes.detailClass
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (id) {
      const promise = dispatchAsync(getDetailClass(id.toString()));

      // Get detail class failed
      promise.then((res) => {
        if (res.type === "class/getDetailClass/rejected") {
          window.history.back();
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "News",
      children: <DetailClassNews detailClass={detailClass} />,
    },
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
    <>
      {isLoading ? (
        <div className="mt-20 min-h-screen flex justify-center">
          <Spin size="large" />
        </div>
      ) : (
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
      )}
    </>
  );
};

export default DetailClass;
