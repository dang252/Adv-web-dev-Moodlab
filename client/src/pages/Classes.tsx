import { useEffect } from "react";

import ClassCard from "../components/ClassCard";

interface PropType {
  isDarkMode: boolean;
  colorBgContainer: string;
}

const Classes = (props: PropType) => {
  const { isDarkMode } = props;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className={`rounded-md flex gap-10 flex-wrap ${isDarkMode ? "" : ""}`}
      style={{
        minHeight: "100vh",
        padding: 24,
        color: isDarkMode ? "#fff" : undefined,
        background: !isDarkMode ? undefined : undefined,
      }}
    >
      <ClassCard
        id="1"
        theme="../class theme/1a.jpg"
        isDarkMode={isDarkMode}
        name="Lớp học tình yêu"
        teacher="Sadboiz tuổi 21"
      />
      <ClassCard
        id="2"
        theme="../class theme/2a.jpg"
        isDarkMode={isDarkMode}
        name="Lớp học tình yêu"
        teacher="Sadboiz tuổi 21"
      />
      <ClassCard
        id="3"
        theme="../class theme/1b.jpg"
        isDarkMode={isDarkMode}
        name="Lớp học tình yêu"
        teacher="Sadboiz tuổi 21"
      />
      <ClassCard
        id="4"
        theme="../class theme/3c.jpg"
        isDarkMode={isDarkMode}
        name="Lớp học tình yêu"
        teacher="Sadboiz tuổi 21"
      />
      <ClassCard
        id="5"
        theme="../class theme/2c.jpg"
        isDarkMode={isDarkMode}
        name="Lớp học tình yêu"
        teacher="Sadboiz tuổi 21"
      />
    </div>
  );
};

export default Classes;
