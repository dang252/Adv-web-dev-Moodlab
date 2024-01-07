import { Avatar, Dropdown, Badge } from "antd";
import type { MenuProps } from "antd";
import { UserOutlined, BellOutlined } from "@ant-design/icons";

// interface PropType {
//   isDarkMode: boolean;
// }

const NotiDropdown = () => {
  const items: MenuProps["items"] = [
    // {
    //   label: (
    //     <div className="p-2 rounded-md flex items-center justify-between hover:cursor-pointer">
    //       <div className="flex items-center">
    //         <div>
    //           <Avatar size={50} icon={<UserOutlined />} />
    //         </div>
    //         <div className="flex flex-col ml-3">
    //           <p className="text-sm leading-none mt-1">
    //             Minh Trí đã yêu cầu tham gia lớp học: Quên đi một người
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //   ),
    //   key: "1",
    // },
    // {
    //   label: (
    //     <div className="p-2 rounded-md flex items-center justify-between hover:cursor-pointer">
    //       <div className="flex items-center">
    //         <div>
    //           <Avatar size={50} icon={<UserOutlined />} />
    //         </div>
    //         <div className="flex flex-col ml-3">
    //           <p className="text-sm leading-none mt-1">
    //             Minh Trí đã yêu cầu tham gia lớp học: Một ngày không có em
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //   ),
    //   key: "2",
    // },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <Badge
        count={0}
        className="relative hover:cursor-pointer hover:text-blue-500"
      >
        <BellOutlined className="text-2xl" />
      </Badge>
    </Dropdown>
  );
};

export default NotiDropdown;
