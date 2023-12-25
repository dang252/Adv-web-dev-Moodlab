import { useEffect } from "react";
import { Carousel } from "antd";
import { v4 as uuidv4 } from "uuid";

import DndCalendar from "../components/DndCalendar";
import Board from "../components/Kanban/Board";

interface PropType {
  isDarkMode: boolean;
  colorBgContainer: string;
}

const Home = (props: PropType) => {
  const { isDarkMode } = props;

  const bannerArray = ["1.png", "2.png", "3.png"];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className={`rounded-md flex flex-col gap-[100px] md:gap-[200px] ${
        isDarkMode ? "" : ""
      }`}
      style={{
        minHeight: "100vh",
        padding: 24,
        color: isDarkMode ? "#fff" : undefined,
        // background: !isDarkMode ? colorBgContainer : undefined,
      }}
    >
      <Carousel
        className="w-[100%] md:w-[90%] mx-auto rounded-md"
        autoplay
        autoplaySpeed={3000}
        infinite={true}
      >
        {bannerArray?.map((banner) => {
          const uid = uuidv4();
          return (
            <div key={uid}>
              <img
                src={`./banner/${banner}`}
                alt="banner"
                className="w-[100%] rounded-md"
              />
            </div>
          );
        })}
      </Carousel>

      <DndCalendar />
      <Board />
    </div>
  );
};

export default Home;
