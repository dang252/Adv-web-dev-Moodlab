import { useEffect } from "react";
import { Empty } from "antd";

import ClassCard from "../components/ClassCard";

import CustomeFadeAnimate from "../animate/CustomeFadeAnimate";

import { useSelector } from "react-redux";
import { useAppDispatch } from "../redux/hooks";
import { RootState } from "../redux/store";

import { getClasses } from "../redux/reducers/class.reducer";
import { Class } from "../types/classroom";

interface PropType {
  isDarkMode: boolean;
  colorBgContainer: string;
}

const Classes = (props: PropType) => {
  const { isDarkMode } = props;

  const dispatchAsync = useAppDispatch();

  const classList = useSelector<RootState, any[]>(
    (state) => state.classes.classList
  );

  console.log(classList);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatchAsync(getClasses());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CustomeFadeAnimate>
      <div
        className={`rounded-md flex gap-10 flex-wrap ${isDarkMode ? "" : ""}`}
        style={{
          minHeight: "100vh",
          padding: 24,
          color: isDarkMode ? "#fff" : undefined,
          background: !isDarkMode ? undefined : undefined,
        }}
      >
        {classList && classList.length === 0 && (
          <div className="w-[100%] mx-auto">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        )}

        {classList &&
          classList.length !== 0 &&
          classList.map((c: Class) => {
            return (
              <ClassCard
                key={c.id}
                id={c.id.toString()}
                theme="../class theme/2c.jpg"
                isDarkMode={isDarkMode}
                name={c.name}
                teacher={c.teacherId.toString()}
              />
            );
          })}
      </div>
    </CustomeFadeAnimate>
  );
};

export default Classes;
