import { useState } from "react";
import {
  Button,
  FloatButton,
  Card,
  Avatar,
  Input,
  Form,
  Empty,
  Modal,
} from "antd";
import { useSelector } from "react-redux";
import {
  InfoOutlined,
  FullscreenOutlined,
  UserOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { MdOutlineModeEdit, MdOutlineAddToPhotos } from "react-icons/md";
import copy from "copy-text-to-clipboard";

import { RootState } from "../redux/store";

import { Post } from "../types/classroom";

import PostCard from "./PostCard";
import ClassNewEditModal from "./ClassNewEditModal";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const { TextArea } = Input;

interface PropType {
  className: string;
}

const postList: Post[] = [
  {
    id: 1,
    name: "sadboiz phu nhuan",
    content:
      "She had been an angel for coming up on 10 years and in all that time nobody had told her this was possible. The fact that it could ever happen never even entered her mind. Yet there she stood, with the undeniable evidence sitting on the ground before her. Angels could lose their wings.",
    time: "15:52",
    comments: [],
  },
  {
    id: 2,
    name: "your memory",
    content:
      "He had disappointed himself more than anyone else. That wasn't to say that he hadn't disappointed others. The fact was that he had disappointed a lot of people who were close to him. The fact that they were disappointed in him was something that made him even more disappointed in himself. Yet here he was, about to do the exact same things that had caused all the disappointment in the first place because he didn't know what else to do.",
    time: "8:35",
    comments: [],
  },
];

const DetailClassNews = (props: PropType) => {
  const { className } = props;

  const [form] = Form.useForm();

  const [openInfor, setOpenInfor] = useState<boolean>(false);
  const [openCreateNoti, setOpenCreateNoti] = useState<boolean>(false);
  const [openInviteModal, setOpenInviteModal] = useState(false);

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [themeUrl, setThemeUrl] = useState<string>("1a.jpg");

  const isDarkMode = useSelector<RootState, boolean | undefined>(
    (state) => state.users.isDarkMode
  );

  //==================== Post form
  const onFinish = (values: any) => {
    console.log(values);
    form.resetFields();
    setOpenCreateNoti(false);
  };

  //==================== Edit modal
  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    console.log(themeUrl);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  //==================== Invite modal
  const handleInviteOk = () => {};

  const handleInviteCancel = () => {
    setOpenInviteModal(false);
  };

  const handleCopyClassCode = () => {
    copy("🦄🌈");
    toast.success("Copy invite link successfully");
  };

  const handleCopyInviteLink = () => {
    copy("🦄🌈");
    toast.success("Copy invite link successfully");
  };

  return (
    <div className="z-10 w-[100%] mb-20 md:w-[80%] xl:w-[70%] mx-auto flex flex-col items-center">
      <Modal
        title="Invite to your class"
        open={openInviteModal}
        onOk={handleInviteOk}
        onCancel={handleInviteCancel}
      >
        <div className="mt-10 mb-5 flex flex-col gap-5 items-start">
          <div className="flex gap-5">
            <p className="text-xl font-bold">Your class code: SDadrfcvA</p>
            <Button
              type="primary"
              onClick={() => {
                handleCopyClassCode();
              }}
            >
              Copy class code
            </Button>
          </div>
          <Button
            type="primary"
            icon={<CopyOutlined />}
            onClick={() => {
              handleCopyInviteLink();
            }}
          >
            Copy class invite link
          </Button>
        </div>
      </Modal>

      <div className="flex gap-5 mb-5 self-end">
        <Link to="/dashboard/classes">
          <Button type="primary">Back</Button>
        </Link>
        <Button
          type="primary"
          onClick={() => {
            setOpenInviteModal(true);
          }}
        >
          Invite
        </Button>
      </div>

      <div className="w-[100%] relative">
        <ClassNewEditModal
          open={open}
          confirmLoading={confirmLoading}
          handleOk={handleOk}
          handleCancel={handleCancel}
          themeUrl={themeUrl}
          setThemeUrl={setThemeUrl}
        />
        <img
          className={`w-[100%] h-[120px] md:h-[150px] xl:h-[200px] object-cover ${
            openInfor ? "rounded-t-xl" : "rounded-xl"
          }`}
          src="../../class theme/1f.jpg"
          alt="theme"
        />
        <div className="absolute bottom-[30px] left-[30px] w-[70%] truncate text-white text-3xl font-semibold">
          {className}
        </div>
        <Button
          type="primary"
          icon={<MdOutlineModeEdit />}
          className="absolute right-[10px] top-[10px] sm:right-[30px] sm:top-[20px]"
          onClick={() => {
            showModal();
          }}
        >
          Edit
        </Button>
        <FloatButton
          icon={<InfoOutlined />}
          type="default"
          className="z-10 absolute bottom-[15px] right-[10px]"
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
      {!openCreateNoti ? (
        <Card
          className={`w-[100%] mt-5 hover:text-blue-500 ${
            isDarkMode ? "" : "text-gray-400"
          }`}
          hoverable
          onClick={() => {
            setOpenCreateNoti(true);
          }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-5">
              <Avatar size={50} icon={<UserOutlined />} />
              <p>Create notification for your classrooms</p>
            </div>
            <div className="text-2xl">
              <MdOutlineAddToPhotos />
            </div>
          </div>
        </Card>
      ) : (
        <Card
          className={`w-[100%] mt-5 ${isDarkMode ? "" : "text-gray-400"}`}
          hoverable
        >
          <div className="flex flex-col gap-5">
            <Form form={form} name="post-form" onFinish={onFinish}>
              <Form.Item name="post" rules={[{ required: true }]}>
                <TextArea
                  className={`${
                    isDarkMode
                      ? "bg-zinc-800 hover:bg-zinc-900"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  rows={4}
                  placeholder="Notify something new for your classroom"
                />
              </Form.Item>

              <div className="flex justify-between">
                <div></div>
                <div>
                  <Button
                    type="link"
                    htmlType="button"
                    onClick={() => {
                      setOpenCreateNoti(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Post
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </Card>
      )}
      <div className="mt-5 w-[100%] flex flex-col gap-5">
        {postList.length !== 0 ? (
          postList.map((post) => {
            return (
              <PostCard
                id={post.id}
                key={post.id}
                name={post.name}
                time={post.time}
                content={post.content}
              />
            );
          })
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </div>
  );
};

export default DetailClassNews;
