import { useState } from "react";
import { Button, FloatButton } from "antd";
import { useSelector } from "react-redux";
import { InfoOutlined, FullscreenOutlined } from "@ant-design/icons";
import { MdOutlineModeEdit } from "react-icons/md";

import { RootState } from "../redux/store";

interface PropType {
  className: string;
}

const DetailClassNews = (props: PropType) => {
  const { className } = props;

  const [openInfor, setOpenInfor] = useState<boolean>(false);

  const isDarkMode = useSelector<RootState, boolean | undefined>(
    (state) => state.users.isDarkMode
  );

  return (
    <div className="w-[100%] 2xl:w-[70%] mx-auto flex flex-col items-center">
      <div className="w-[100%] relative">
        <img
          className={`w-[100%] h-[120px] md:h-[150px] xl:h-[200px] object-cover ${
            openInfor ? "rounded-t-xl" : "rounded-xl"
          }`}
          src="../../class theme/1f.jpg"
          alt="theme"
        />
        <p className="absolute bottom-[30px] left-[30px] text-white text-3xl font-semibold">
          {className}
        </p>
        <Button
          type="primary"
          icon={<MdOutlineModeEdit />}
          className="absolute right-[30px] top-[20px]"
        >
          Edit
        </Button>
        <FloatButton
          icon={<InfoOutlined />}
          type="default"
          className="absolute bottom-[15px] right-[10px]"
          onClick={() => {
            setOpenInfor(!openInfor);
          }}
        />
      </div>
      <div
        className={`w-[100%] p-5 rounded-b-xl ${
          openInfor ? "flex" : "hidden"
        } ${isDarkMode ? " bg-zinc-800 " : " bg-white "}`}
      >
        <div className="flex items-center gap-5">
          <p className="font-bold">Code</p>
          <p>whyilostyou</p>
          <div
            className="w-[30px] h-[30px] flex items-center justify-center rounded-full hover:bg-gray-200 hover:cursor-pointer"
            onClick={() => {}}
          >
            <FullscreenOutlined />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailClassNews;
