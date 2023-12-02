import { useEffect } from "react";

import DndCalendar from "../components/DndCalendar";
import Board from "../components/Kanban/Board";

interface PropType {
  isDarkMode: boolean;
  colorBgContainer: string;
}

const Home = (props: PropType) => {
  const { isDarkMode } = props;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className={`rounded-md flex flex-col gap-[200px] ${isDarkMode ? "" : ""}`}
      style={{
        minHeight: "100vh",
        padding: 24,
        color: isDarkMode ? "#fff" : undefined,
        // background: !isDarkMode ? colorBgContainer : undefined,
      }}
    >
      <DndCalendar />
      <Board />
    </div>
  );
};

export default Home;
