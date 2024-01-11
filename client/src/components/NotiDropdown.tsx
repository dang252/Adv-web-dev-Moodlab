import { Avatar, Dropdown, Badge } from "antd";
import type { MenuProps } from "antd";
import { UserOutlined, BellOutlined } from "@ant-design/icons";
import { useAppSelector } from "../redux/hooks";

// interface PropType {
//   isDarkMode: boolean;
// }

const NotiDropdown = () => {
  const notifications = useAppSelector((state) => state.persisted.users.notification)
  const items: MenuProps["items"] = notifications.map((noti, index) => {
    return (
      {
        label: (
          <div className="p-2 rounded-md flex items-center justify-between hover:cursor-pointer">
            <div className="flex items-center">
              <div>
                <Avatar size={50} icon={<UserOutlined />} />
              </div>
              <div className="flex flex-col ml-3">
                <p className="text-sm leading-none mt-1">
                  {noti}
                </p>
              </div>
            </div>
          </div>
        ),
        key: index,
      }
    )
  })

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <Badge
        count={notifications.length}
        className="relative hover:cursor-pointer hover:text-blue-500"
      >
        <BellOutlined className="text-2xl" />
      </Badge>
    </Dropdown>
  );
};

export default NotiDropdown;
