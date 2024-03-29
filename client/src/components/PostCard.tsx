import { Card, Avatar, Dropdown, Form, Input, Button } from "antd";
import type { MenuProps } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { SlOptionsVertical } from "react-icons/sl";
import { LuUsers2 } from "react-icons/lu";
import { v4 as uuidv4 } from "uuid";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { Review } from "../types/classroom";
import axios from "axios";
import { toast } from "react-toastify";
import { getClassAllReviews } from "../redux/reducers/class.reducer";
import { useAppDispatch } from "../redux/hooks";

interface PropType {
  review: Review;
  classId: number | undefined
}

const { TextArea } = Input;

const PostCard = (props: PropType) => {
  const { review, classId } = props;

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

  const dispatchAsync = useAppDispatch();

  const onFinish = async (values: any) => {
    try {
      const accessToken = localStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/review/${review.id}/comment`,
        {
          content: values.content,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // console.log(response.data)
      await dispatchAsync(getClassAllReviews(Number(classId)));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error)
      toast.error(
        "Can't comment right now! try again later!"
      );
    }
    form.resetFields();
    // setOpenCreateNoti(false);
  };

  return (
    <Card bordered={false}>
      <div className="flex justify-between">
        <div className="flex gap-5">
          <Avatar size={50} icon={<UserOutlined />} />
          <div className="flex flex-col gap-[2px]">
            <p className="font-semibold">
              {review?.reporter?.firstName +
                " " +
                review?.reporter?.lastName +
                " " +
                `(${review.reporter.email})`}
            </p>
            <p>Status: {review?.status}</p>
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
        <div className="flex flex-col gap-3 mt-5 mb-10">
          <p>Exam name: {review.exam.name}</p>
          <p>Expectation point: {review.expectationPoint}</p>
          <p className="text-justify">Report: {review.explaination}</p>
        </div>

        <div className="mt-5 border-t-[1px] border-l-0 border-r-0 border-b-0 border-solid border-gray-200">
          <div className="flex flex-col gap-3 mt-3 mb-10">
            <div className="flex items-center gap-3 mb-5">
              <LuUsers2 />
              <p>{review.comments?.length} comments about report</p>
            </div>

            <div>
              {review.comments?.map((comment) => {
                return (
                  <div key={uuidv4()} className="flex gap-3 items-center mt-6">
                    <Avatar size={50} icon={<UserOutlined />} />
                    <div className="flex flex-col gap-1">
                      <p>Teacher: {comment.userId}</p>
                      <p>{comment.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <Form form={form} name={`post-form-${review.id}`} onFinish={onFinish}>
            <Form.Item
              name={`content`}
              rules={[{ required: true }]}
            >
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
