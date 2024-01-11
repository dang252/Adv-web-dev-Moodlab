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
  InputNumber,
  Select,
} from "antd";
import {
  InfoOutlined,
  FullscreenOutlined,
  UserOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useSelector } from "react-redux";
import { useAppDispatch } from "../redux/hooks";
import {
  editClassTheme,
  getClassAllReviews,
  getDetailClass,
  inviteToClassByEmail,
} from "../redux/reducers/class.reducer";

import { MdOutlineModeEdit, MdOutlineAddToPhotos } from "react-icons/md";
import copy from "copy-text-to-clipboard";

import { RootState } from "../redux/store";

import { ClassType, Review } from "../types/classroom";

import PostCard from "./PostCard";
import ClassNewEditModal from "./ClassNewEditModal";
import axios from "axios";

const { TextArea } = Input;

type FieldType = {
  email?: string;
};

interface PropType {
  detailClass: ClassType | null;
}

const DetailClassNews = (props: PropType) => {

  const getUrl = () => {
    const url = window.location.href.split("/")
    console.log(url)
    return url[0] + "//" + url[2];
  };
  const { detailClass } = props;

  const [form] = Form.useForm();

  const dispatchAsync = useAppDispatch();

  const [openInfor, setOpenInfor] = useState<boolean>(false);
  const [openCreateNoti, setOpenCreateNoti] = useState<boolean>(false);
  const [openInviteModal, setOpenInviteModal] = useState(false);

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [themeUrl, setThemeUrl] = useState<string>("1a.jpg");

  const isDarkMode = useSelector<RootState, boolean | undefined>(
    (state) => state.persisted.users.isDarkMode
  );

  const classId = useSelector<RootState, number | undefined>(
    (state) => state.classes.detailClass?.id
  );

  const reviews = useSelector<RootState, Review[]>(
    (state) => state.classes.detailClassReviews
  );

  //==================== Post form
  const onFinish = async (values: any) => {
    try {
      const accessToken = localStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/exam/${values.examId}/review`,
        {
          expectationPoint: values.expectedPoint,
          explaination: values.desc,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success(
        "Create Request successfully"
      );
      // console.log(response.data)
      await dispatchAsync(getClassAllReviews(Number(classId)));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error)
      toast.error(
        "Can't create review request right now! try again later!"
      );
    }
    form.resetFields();
    setOpenCreateNoti(false);
  };

  //==================== Edit modal
  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);

    if (detailClass && detailClass.id) {
      const body = {
        id: detailClass.id.toString(),
        theme: themeUrl,
      };

      const res = await dispatchAsync(editClassTheme(body));

      if (res.type === "class/editClassTheme/fulfilled") {
        toast.success("Edit theme successfully");

        dispatchAsync(getDetailClass(detailClass.inviteCode));
      }

      if (res.type === "class/editClassTheme/rejected") {
        toast.error("Edit theme failed");
      }
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  //==================== Invite modal
  const handleInviteOk = () => { };

  const handleInviteCancel = () => {
    setOpenInviteModal(false);
  };

  const handleCopyClassCode = (inviteCode: string) => {
    copy(inviteCode);
    toast.success("Copy invite link successfully");
  };

  const handleCopyInviteLink = (inviteCode: string) => {
    console.log(getUrl())
    const newpath = getUrl() + "/dashboard/classes/" + inviteCode;
    copy(newpath);
    toast.success("Copy invite link successfully");
  };

  const onFinishInvite = async (values: any) => {
    const email: string = values.email;

    if (classId) {
      const body: { id: number; email: string } = {
        id: classId,
        email: email,
      };

      const res = await dispatchAsync(inviteToClassByEmail(body));

      if (res.type === "class/inviteToClassByEmail/fulfilled") {
        toast.success("Invite to class successfully");
      }

      if (res.type === "class/inviteToClassByEmail/rejected") {
        toast.error("Invite to class failed");
      }

      form.resetFields();
    }
  };

  type Options = {
    value: string;
    label: string;
  }

  const [examOptions, setExamOptions] = useState<Options[]>([]);

  const getClassGrade = async () => {
    try {
      const accessToken = localStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/classes/${detailClass?.id}/grades`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // console.log(response.data)
      const options: Options[] = []
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].exams) {
          for (let j = 0; j < response.data[i].exams.length; j++) {
            options.push({
              value: response.data[i].exams[j].id,
              label: response.data[i].exams[j].name,
            })
          }
        }
      }
      setExamOptions(options)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error)
      toast.error(
        "Can not see grade structure for now! Please try again later"
      );
    }
  };

  return (
    <>
      {detailClass === null ? (
        <div className="mt-20">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      ) : (
        <div className="z-10 w-[100%] mb-20 md:w-[80%] xl:w-[70%] mx-auto flex flex-col items-center">
          <Modal
            title="Invite another to your class"
            open={openInviteModal}
            onOk={handleInviteOk}
            onCancel={handleInviteCancel}
            footer={null}
          >
            <div className="mt-10 mb-5 flex flex-col gap-14 items-start">
              <div className="w-[100%] flex flex-col gap-2">
                <p>Using your class code</p>
                <div className="w-[100%] flex flex-wrap gap-5 justify-between">
                  <p className="text-xl font-bold">
                    Your class code: {detailClass?.inviteCode}
                  </p>
                  <Button
                    type="primary"
                    onClick={() => {
                      handleCopyClassCode(detailClass?.inviteCode);
                    }}
                  >
                    Copy class code
                  </Button>
                </div>
              </div>

              <div className="w-[100%] flex flex-wrap items-center justify-between gap-2">
                <p>Or: With invite link</p>
                <Button
                  type="primary"
                  icon={<CopyOutlined />}
                  onClick={() => {
                    handleCopyInviteLink(detailClass?.inviteCode);
                  }}
                >
                  Copy class invite link
                </Button>
              </div>

              <div className="w-[100%] flex flex-col gap-5">
                <p>Or: Type user email</p>
                <Form
                  form={form}
                  className="w-[100%]"
                  name="invite-email-form"
                  labelCol={{ span: 3 }}
                  onFinish={onFinishInvite}
                >
                  <Form.Item<FieldType>
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please input user email!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item wrapperCol={{ offset: 3 }}>
                    <Button type="primary" htmlType="submit">
                      Invite
                    </Button>
                  </Form.Item>
                </Form>
              </div>
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
              className={`w-[100%] h-[120px] md:h-[150px] xl:h-[200px] object-cover ${openInfor ? "rounded-t-xl" : "rounded-xl"
                }`}
              src={`../../class theme/${detailClass?.theme}`}
              alt="theme"
            />
            <div className="absolute bottom-[30px] left-[30px] w-[70%] truncate text-white text-3xl font-semibold">
              {detailClass?.name}
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
            className={`w-[100%] p-5 rounded-b-xl ${openInfor ? "flex" : "hidden"
              } ${isDarkMode ? " bg-zinc-800 " : " bg-white "}`}
          >
            <div className="flex items-center gap-5">
              <p className="font-bold">Code</p>
              <p>whyilostyou</p>
              <div
                className="w-[30px] h-[30px] flex items-center justify-center rounded-full hover:bg-gray-200 hover:cursor-pointer"
                onClick={() => { }}
              >
                <FullscreenOutlined />
              </div>
            </div>
          </div>

          {!openCreateNoti ? (
            <Card
              className={`w-[100%] mt-5 hover:text-blue-500 ${isDarkMode ? "" : "text-gray-400"
                }`}
              hoverable
              onClick={() => {
                getClassGrade();
                setOpenCreateNoti(true);
              }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-5">
                  <Avatar size={50} icon={<UserOutlined />} />
                  <p>Create new review request</p>
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
                  <Form.Item
                    name="examId"
                    rules={[
                      {
                        required: true,
                        message: 'Please select an option!',
                      },
                    ]}
                  >
                    <Select
                      options={examOptions}
                      className={`${isDarkMode
                        ? "bg-zinc-800 hover:bg-zinc-900"
                        : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      placeholder="Enter choose exam to review"
                    />
                  </Form.Item>
                  <Form.Item name="expectedPoint" rules={[{ required: true }]}>
                    <InputNumber
                      min={1} max={10}

                      className={`${isDarkMode
                        ? "bg-zinc-800 hover:bg-zinc-900"
                        : "bg-gray-100 hover:bg-gray-200"
                        } w-full`}
                      placeholder="Enter you expected point"
                    />
                  </Form.Item>
                  <Form.Item name="desc" rules={[{ required: true }]}>
                    <TextArea
                      className={`${isDarkMode
                        ? "bg-zinc-800 hover:bg-zinc-900"
                        : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      rows={4}
                      placeholder="Description"
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
            {reviews.length !== 0 ? (
              reviews.map((review) => {
                return <PostCard key={review.id} review={review} classId={classId} />;
              })
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DetailClassNews;
