import { Link } from "react-router-dom";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { IoMdFolderOpen } from "react-icons/io";
import { TfiStatsUp } from "react-icons/tfi";

interface PropType {
  id: string;
  theme: string;
  isDarkMode: boolean;
  name: string;
  teacher: string;
}

const ClassCard = (props: PropType) => {
  const { id, theme, isDarkMode, name, teacher } = props;

  return (
    <div
      className={`z-10 relative max-w-[300px] min-h-[320px] max-h-[320px] flex flex-col justify-between border border-solid rounded-xl ${
        isDarkMode ? "bg-zinc-800 border-gray-500" : "bg-white border-gray-300"
      }`}
    >
      <header>
        <img
          src={theme}
          alt="theme"
          className="w-[100%] h-[100px] object-cover rounded-t-xl"
        />
        <Link
          to={`/dashboard/classes/${id}`}
          className="absolute text-xl font-semibold top-[15px] left-[15px] text-white hover:text-white hover:underline hover:underline-offset-2"
        >
          {name}
        </Link>
        <p className="absolute text-white top-[70px] left-[15px] hover:underline hover:underline-offset-2">
          {teacher}
        </p>
        <Avatar
          className="absolute right-[20px] top-[60px]"
          size={70}
          style={{ backgroundColor: "#4a8fe8", verticalAlign: "middle" }}
          icon={<UserOutlined />}
        />
      </header>
      <footer className="border-t-[1px] border-l-0 border-r-0 border-b-0 border-solid border-gray-200 py-3 px-5 flex justify-end gap-5">
        <div className="flex justify-center items-center p-[8px] rounded-full hover:bg-gray-200 hover:text-black hover:cursor-pointer">
          <TfiStatsUp className="text-2xl" />
        </div>
        <div className="flex justify-center items-center p-[8px] rounded-full hover:bg-gray-200 hover:text-black hover:cursor-pointer">
          <IoMdFolderOpen className="text-2xl" />
        </div>
      </footer>
    </div>
  );
};

export default ClassCard;
