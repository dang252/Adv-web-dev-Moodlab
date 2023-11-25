import { Menu, MenuProps } from "antd";
import { IoLogoOctocat } from "react-icons/io";
import { Link } from "react-router-dom";

interface propType {
  Sider: any;
  isDarkMode: boolean;
  items: MenuProps["items"];
  onClick: MenuProps["onClick"];
  navValue: string;
  setNavValue: React.Dispatch<React.SetStateAction<string>>;
}

const Navigation = (props: propType) => {
  const { Sider, isDarkMode, items, onClick, navValue, setNavValue } = props;

  return (
    <div className="hidden sm:block">
      <Sider
        breakpoint="sm"
        width={"230px"}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          backgroundColor: isDarkMode ? undefined : "#fff",
        }}
      >
        <div
          className={`${
            !isDarkMode
              ? "flex justify-center mt-7 text-black"
              : "flex justify-center mt-7 text-white"
          }`}
        >
          <Link
            to="/dashboard"
            className={`${
              isDarkMode
                ? "text-white hover:cursor-pointer flex hover:text-white"
                : "text-black hover:cursor-pointer flex hover:text-black"
            }`}
            onClick={() => {
              setNavValue("1");
            }}
          >
            <IoLogoOctocat className="text-3xl" />
            <p className="hidden text-xl font-bold ml-4 sm:block">Moodlab</p>
          </Link>
        </div>
        <Menu
          className="mt-5"
          theme={isDarkMode ? "dark" : "light"}
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={items}
          onClick={onClick}
          selectedKeys={[navValue]}
        />
      </Sider>
    </div>
  );
};

export default Navigation;
