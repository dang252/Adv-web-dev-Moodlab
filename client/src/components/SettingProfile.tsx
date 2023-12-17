import { Card, Avatar, Col, Row, Form, Input, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { IoLogoOctocat } from "react-icons/io";
import { store } from "../redux/store";
import { UserState } from "../redux/reducers/user.reducer";

type FieldType = {
  username?: string;
  name?: string;
  email?: string;
  phone?: string;
  newPassword?: string;
  confirm?: string;
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
  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const user: UserState = store.getState().persisted.users

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

                <Row>
                  <Col span={10}>
                    <p className="font-bold">Phone:</p>
                  </Col>
                  <Col span={12}>
                    <p>099999999</p>
                  </Col>
                </Row>
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
            name: user.firstname + " " + user.lastname,
            email: user.email,
            phone: "019999999",
            username: user.username,
            newPassword: "123",
            confirm: "123",
          }}
          {...layout}
        >
          <p className="text-xl font-extrabold text-center mt-5 mb-5">
            EDIT PROFILE
          </p>

          <Form.Item<FieldType>
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
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

          <Form.Item<FieldType>
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please input your phone!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="New Password"
            name="newPassword"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your new password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

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
