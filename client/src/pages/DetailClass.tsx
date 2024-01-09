import { useEffect } from "react";
import { Tabs, Spin } from "antd";
import type { TabsProps } from "antd";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useSelector } from "react-redux";
import { useAppDispatch } from "../redux/hooks";
import { RootState } from "../redux/store";

import {
  getClassAllGrades,
  getClassAllReviews,
  getDetailClass,
  getInviteCode,
} from "../redux/reducers/class.reducer";

import DetailClassNews from "../components/DetailClassNews";
import DetailClassMembers from "../components/DetailClassMembers";
import DetailClassGrades from "../components/DetailClassGrades";

import { ClassType } from "../types/classroom";

interface PropType {
  isDarkMode: boolean;
  colorBgContainer: string;
}

const DetailClass = (props: PropType) => {
  const { isDarkMode } = props;

  const params = useParams();
  const { inviteCode } = params;

  const dispatchAsync = useAppDispatch();

  const USER_ROLE = useSelector<RootState, string>(
    (state) => state.persisted.users.role
  );

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
    if (inviteCode) {
      const promise = dispatchAsync(getDetailClass(inviteCode)).unwrap();

      // Get detail class failed
      promise
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          const data = error.response.data;

          if (data === "No permission") {
            const body = {
              code: inviteCode,
            };

            // 403: Recall /classes/:id/:code
            const inviteCodePromise = dispatchAsync(
              getInviteCode(body)
            ).unwrap();

            inviteCodePromise.then(() => {
              const retrypromise = dispatchAsync(
                getDetailClass(inviteCode)
              ).unwrap();
              retrypromise.then(() => {
                toast.success("Join class successfully");
              });
            });
          } else {
            toast.error("Get detail class failed");
          }
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteCode]);

  useEffect(() => {
    const handleGetClassAllGrades = async (classId: number) => {
      // console.log("GRADES:", classId);
      await dispatchAsync(getClassAllGrades(classId));
    };

    if (detailClass?.id) {
      handleGetClassAllGrades(detailClass.id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailClass]);

  useEffect(() => {
    const handleGetClassAllGrades = async (classId: number) => {
      // console.log("REVIEWS:", classId);
      await dispatchAsync(getClassAllReviews(classId));
    };

    if (detailClass?.id) {
      handleGetClassAllGrades(detailClass.id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailClass]);

  // const onChange = (key: string) => {
  //   console.log(key);
  // };

  const studentItems: TabsProps["items"] = [
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
    // {
    //   key: "3",
    //   label: "Grades",
    //   children: <DetailClassGrades />,
    // },
  ];

  const teacherItems: TabsProps["items"] = [
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
      label: "Grades",
      children: <DetailClassGrades />,
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
            items={USER_ROLE === "TEACHER" ? teacherItems : studentItems}
            // onChange={onChange}
            className="w-[100%]"
          // indicatorSize={(origin) => origin - 16}
          />
        </div>
      )}
    </>
  );
};

export default DetailClass;
