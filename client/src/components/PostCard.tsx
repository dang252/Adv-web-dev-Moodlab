import { Card, Avatar, Dropdown, Form, Input, Button } from "antd";
import type { MenuProps } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { SlOptionsVertical } from "react-icons/sl";
import { LuUsers2 } from "react-icons/lu";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface PropType {
  id: number;
  name: string;
  time: string;
  content: string;
}

const { TextArea } = Input;

const PostCard = (props: PropType) => {
  const { id, name, time, content } = props;

  const [form] = Form.useForm();

  const postOptionItems: MenuProps["items"] = [
    {
      label: <p>Edit</p>,
      key: "1",
    },
    {
      label: <p>Delete</p>,
      key: "2",
    },
    {
      label: <p>Copy URL</p>,
      key: "3",
    },
  ];

  const isDarkMode = useSelector<RootState, boolean | undefined>(
    (state) => state.persisted.users.isDarkMode
  );

  const onFinish = (values: any) => {
    console.log(values);
    form.resetFields();
  };

  return (
    <Card bordered={false}>
      <div className="flex justify-between">
        <div className="flex gap-5">
          <Avatar size={50} icon={<UserOutlined />} />
          <div className="flex flex-col gap-[2px]">
            <p className="font-semibold">{name}</p>
            <p>{time}</p>
          </div>
        </div>
        <Dropdown menu={{ items: postOptionItems }} trigger={["click"]}>
          <div
            className={`w-[30px] h-[30px] flex justify-center items-center rounded-full hover:cursor-pointer ${isDarkMode ? "hover:bg-zinc-600" : "hover:bg-gray-200"
              }`}
          >
            <SlOptionsVertical />
          </div>
        </Dropdown>
      </div>
      <div className="mt-5">
        <p className="text-justify">{content}</p>
        <div className="mt-5 border-t-[1px] border-l-0 border-r-0 border-b-0 border-solid border-gray-200">
          <div className="flex items-center gap-3 my-3">
            <LuUsers2 />
            <p>3 comments about class</p>
          </div>
          <Form form={form} name={`post-form-${id}`} onFinish={onFinish}>
            <Form.Item name={`post-form-${id}`} rules={[{ required: true }]}>
              <TextArea
                className={`${isDarkMode
                    ? "bg-zinc-800 hover:bg-zinc-900"
                    : "bg-gray-100 hover:bg-gray-200"
                  }`}
                rows={4}
                placeholder="Add you comment here..."
              />
            </Form.Item>

            <div className="flex justify-end">
              <Button type="primary" htmlType="submit">
                Comment
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
