import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

interface PropType {
  triggerNoti: boolean;
  setTriggerNoti: React.Dispatch<React.SetStateAction<boolean>>;
  isDarkMode: boolean;
}

const NotiDropdown = (props: PropType) => {
  const { triggerNoti, setTriggerNoti, isDarkMode } = props;

  return (
    <>
      <div
        className="absolute top-0 left-0 w-full h-[100vh]"
        onClick={() => {
          if (triggerNoti) setTriggerNoti(false);
        }}
      ></div>
      <div
        className={`${!triggerNoti ? "hidden" : "flex"} ${
          isDarkMode
            ? "text-white bg-zinc-700"
            : "bg-white border border-solid border-gray-200"
        } absolute top-[60px] right-[120px] sm:right-[200px] rounded-md px-4 py-2 flex flex-col justify-center`}
      >
        <p className="text-xl font-bold mb-5">Notification</p>
        <div className="mb-2 flex max-w-[250px] sm:max-w-[400px]">
          <div className="flex flex-col gap-5">
            <div
              className={`p-2 rounded-md flex items-center justify-between hover:cursor-pointer ${
                isDarkMode ? "hover:bg-zinc-800" : "hover:bg-gray-200"
              }`}
            >
              <div className="flex items-center">
                <div>
                  <Avatar size={50} icon={<UserOutlined />} />
                </div>
                <div className="flex flex-col ml-3">
                  <p className="text-sm leading-none mt-1">
                    Minh Trí đã yêu cầu tham gia lớp học: Quên đi một người
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`p-2 rounded-md flex items-center justify-between hover:cursor-pointer ${
                isDarkMode ? "hover:bg-zinc-800" : "hover:bg-gray-200"
              }`}
            >
              <div className="flex items-center">
                <div>
                  <Avatar size={50} icon={<UserOutlined />} />
                </div>
                <div className="flex flex-col ml-3">
                  <p className="text-sm leading-none mt-1">
                    Minh Trí đã yêu cầu tham gia lớp học: Một ngày không có em
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotiDropdown;
