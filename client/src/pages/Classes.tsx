import { useEffect } from "react";

interface PropType {
  isDarkMode: boolean;
  colorBgContainer: string;
}

const Classes = (props: PropType) => {
  const { isDarkMode, colorBgContainer } = props;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className={`rounded-md ${isDarkMode ? "bg-zinc-800" : ""}`}
      style={{
        minHeight: "100vh",
        padding: 24,
        color: isDarkMode ? "#fff" : undefined,
        background: !isDarkMode ? colorBgContainer : undefined,
      }}
    >
      Classes
    </div>
  );
};

export default Classes;
