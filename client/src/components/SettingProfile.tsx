import { Card, Avatar, Col, Row, Form, Input, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { IoLogoOctocat } from "react-icons/io";
import { store } from "../redux/store";
import { UserState, getUser, logoutAccount, putUser } from "../redux/reducers/user.reducer";
import { useAppDispatch } from "../redux/hooks";
import { toast } from "react-toastify";
import { useEffect } from "react";

type FieldType = {
  username?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  studentId?: string;
};

const layout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 8 },
    lg: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 12 },
    lg: { span: 12 },
  },
};
const tailLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12, offset: 12 },
    md: { span: 12, offset: 8 },
    lg: { span: 12, offset: 8 },
  },
};

const SettingProfile = () => {

  const user: UserState = store.getState().persisted.users

  const dispatchAsync = useAppDispatch()

  useEffect(() => {
    const refetchUser = async () => {
      try {
        await dispatchAsync(getUser()).unwrap();
      }
      catch (error) {
        toast.error("Failed to get User Info!")
        dispatchAsync(logoutAccount()).unwrap()
      }
    }

    refetchUser();

  }, [dispatchAsync])

  const onFinish = async (values: any) => {
    try {
      await dispatchAsync(putUser({
        ...values
      })).unwrap();
      await dispatchAsync(getUser()).unwrap();
      toast.success("Update user profile successfully!")
    }
    catch (error) {
      console.log("update profile error: ", error)
      toast.error("Can't update user info right now! Please try again later!")
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="w-[100%] 2xl:w-[70%] mx-auto flex flex-col items-center">
      <div className="w-[100%] flex flex-col gap-10">
        <Card className="w-[100%]">
          <div className="w-[100%] flex flex-wrap-reverse gap-10 items-center justify-between">
            <div className="flex flex-wrap items-center gap-10 xl:gap-20">
              <Avatar
                className="mx-auto xl:mx-0"
                size={100}
                icon={<UserOutlined />}
              />
              <div className="w-[100%] xl:w-[auto] flex flex-col gap-5">
                <p className="text-xl font-extrabold text-center xl:text-left">
                  {user.firstname} {user.lastname}
                </p>

                <Row>
                  <Col span={10}>
                    <p className="font-bold">Username:</p>
                  </Col>
                  <Col span={12}>
                    <p>{user.username}</p>
                  </Col>
                </Row>

                <Row>
                  <Col span={10}>
                    <p className="font-bold">Email:</p>
                  </Col>
                  <Col span={12}>
                    <p>{user.email}</p>
                  </Col>
                </Row>

                {
                  user && (user.role == "STUDENT"
                    ? <Row>
                      <Col span={10}>
                        <p className="font-bold">Student Id:</p>
                      </Col>
                      <Col span={12}>
                        <p>{user.studentId}</p>
                      </Col>
                    </Row>
                    : <Row>
                      <Col span={10}>
                        <p className="font-bold">Role:</p>
                      </Col>
                      <Col span={12}>
                        <p>{user.role}</p>
                      </Col>
                    </Row>)
                }
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-5 mx-auto xl:mx-0 text-blue-500">
              <IoLogoOctocat className="text-7xl hover:cursor-pointer" />
              <p className="font-bold">Your Moodlab Profile</p>
            </div>
          </div>
        </Card>

        <Form
          name="edit-profile-form"
          className="w-[100%] xl:w-[50%] mx-auto"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          initialValues={{
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            studentId: user.studentId,
            username: user.username,
            // newPassword: "123",
            // confirm: "123",
          }}
          {...layout}
        >
          <p className="text-xl font-extrabold text-center mt-5 mb-5">
            EDIT PROFILE
          </p>

          <Form.Item<FieldType>
            label="First Name"
            name="firstname"
            rules={[{ required: true, message: "Please input your firstname!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Last Name"
            name="lastname"
            rules={[{ required: true, message: "Please input your lastname!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>

          {user && user.role == "STUDENT" &&
            <Form.Item<FieldType>
              label="Student Id"
              name="studentId"
              rules={[{ required: true, message: "Please input your student id!" }]}
            >
              <Input />
            </Form.Item>
          }

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Edit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SettingProfile;
