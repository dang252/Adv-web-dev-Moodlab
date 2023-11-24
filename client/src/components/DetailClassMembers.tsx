import { Avatar } from "antd";
import {
  UserOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";

const DetailClassMembers = () => {
  const teachers = [
    "Minh Trí đẹp trai",
    "sadboiz phu nhuan",
    "nguoi tung ben anh",
  ];

  const students = ["student a", "student b", "student c"];

  return (
    <div className="w-[100%] 2xl:w-[70%] mx-auto flex flex-col">
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <p className="text-2xl text-blue-500 font-bold">Teacher</p>
          <div>
            <UserAddOutlined className="text-2xl hover:cursor-pointer hover:text-blue-500" />
          </div>
        </div>
        <div className="w-[100%] h-[2px] bg-blue-500 my-5"></div>
        <div className="flex flex-col gap-10">
          {teachers?.map((teacher) => {
            const uid = uuidv4();
            return (
              <div key={uid} className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <Avatar size={40} icon={<UserOutlined />} />
                  <p>{teacher}</p>
                </div>
                <UserDeleteOutlined
                  className="text-2xl hover:cursor-pointer hover:text-blue-500"
                  onClick={() => {
                    //
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-20">
        <div className="flex items-center justify-between">
          <p className="text-2xl text-blue-500 font-bold">Students</p>
          <div className="flex items-center gap-5">
            <p className="font-semibold">94 members</p>
            <UserAddOutlined className="text-2xl hover:cursor-pointer hover:text-blue-500" />
          </div>
        </div>
        <div className="w-[100%] h-[2px] bg-blue-500 my-5"></div>
        <div className="flex flex-col gap-10">
          {students?.map((student) => {
            const uid = uuidv4();
            return (
              <div key={uid} className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <Avatar size={40} icon={<UserOutlined />} />
                  <p>{student}</p>
                </div>
                <UserDeleteOutlined
                  className="text-2xl hover:cursor-pointer hover:text-blue-500"
                  onClick={() => {
                    //
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DetailClassMembers;
