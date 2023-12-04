import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { useParams } from "react-router-dom";

import { RootState } from "../redux/store";
import { Layout, theme, Form, Input, Button } from "antd";
import { useTitle } from "../hooks/useTitle";

import { IoLogoOctocat } from "react-icons/io";

import LandingHeader from "../components/LandingHeader";
import axios from "axios"

const { Header, Content } = Layout;

interface PropType {
  triggerOpen: boolean;
  setTriggerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  switchMode: (_checked: boolean) => void;
}

type FieldType = {
  password?: string;
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

const ResetPassword = (props: PropType) => {
  const { triggerOpen, setTriggerOpen, switchMode } = props;

  const params = useParams();

  console.log(params);

  const isDarkMode = useSelector<RootState, boolean>(
    (state) => state.users.isDarkMode
  );

  useTitle("Moodlab | Reset Password");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onFinish = async (values: any) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/forgot_password`,
        {
          email: values.email,
        }
      );
      toast.success("We have emailed you password reset link! Please check your email");
    }
    catch (err:any) {
      toast.error("Can't send password reset link! please try again later!");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <LandingHeader
        Header={Header}
        isDarkMode={isDarkMode}
        colorBgContainer={colorBgContainer}
        triggerOpen={triggerOpen}
        setTriggerOpen={setTriggerOpen}
        switchMode={switchMode}
      />
      <Layout className={`${isDarkMode ? "bg-zinc-900" : ""}`}>
        <Content
          className="mt-[30px] mb-[30px] mx-[10px] sm:mt-[100px] sm:mx-[40px]"
          style={{ overflow: "initial" }}
        >
          <div
            className={`rounded-md ${isDarkMode ? "" : ""}`}
            style={{
              minHeight: "100vh",
              padding: 24,
              color: isDarkMode ? "#fff" : undefined,
              // background: !isDarkMode ? colorBgContainer : undefined,
            }}
          >
            <Form
              className={`w-[100%] mx-auto mt-20 p-5 rounded-md sm:max-w-[600px] ${
                isDarkMode ? "bg-zinc-800" : "bg-white"
              }`}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              {...layout}
            >
              <div className="text-blue-500 flex gap-5 justify-center items-center mb-10">
                <IoLogoOctocat className="text-3xl" />
                <p className="text-3xl font-bold">|</p>
                <h1 className="text-center font-bold">Reset Password</h1>
              </div>

              <Form.Item<FieldType>
                label="New Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="confirm"
                label="Confirm New Password"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "The new password that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                  Reset
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Content>
      </Layout>
    </>
  );
};

export default ResetPassword;
