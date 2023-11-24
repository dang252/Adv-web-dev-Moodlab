import { useEffect } from "react";

interface PropType {
  isDarkMode: boolean;
  colorBgContainer: string;
}

const DetailClass = (props: PropType) => {
  const { isDarkMode } = props;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className={`rounded-md ${isDarkMode ? "" : ""}`}
      style={{
        minHeight: "100vh",
        padding: 24,
        color: isDarkMode ? "#fff" : undefined,
        // background: !isDarkMode ? colorBgContainer : undefined,
      }}
    >
      Detail class page
    </div>
  );
};

export default DetailClass;
