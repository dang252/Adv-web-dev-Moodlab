import { useEffect } from "react";
import { Layout, theme, Button, Form, Input } from "antd";
import { useSelector } from "react-redux";
import { useTitle } from "../hooks/useTitle";

import { GoogleOutlined } from "@ant-design/icons";
import { FaFacebook } from "react-icons/fa";
import { IoLogoOctocat } from "react-icons/io";

import { RootState } from "../redux/store";

import LandingHeader from "../components/LandingHeader";
import { Link, useNavigate } from "react-router-dom";
import { loginAccount } from "../redux/reducers/user.reducer";
import { useAppDispatch } from "../redux/hooks";
import { UserAccount } from "../types/user";
import { toast } from "react-toastify";


const { Header, Content } = Layout;

interface PropType {
  triggerOpen: boolean;
  setTriggerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  switchMode: (_checked: boolean) => void;
}

type FieldType = {
  username?: string;
  password?: string;
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

const Login = (props: PropType) => {
  const dispathAsync = useAppDispatch();
  const navigate = useNavigate();
  const { triggerOpen, setTriggerOpen, switchMode } = props;

  const isDarkMode = useSelector<RootState, boolean>(
    (state) => state.users.isDarkMode
  );

  useTitle("Moodlab | Login");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onFinish = (values: any) => {
    const UserAccount: UserAccount = {
      username: values.username,
      password: values.password,
    };

    const promise = dispathAsync(loginAccount(UserAccount));

    promise.unwrap().then((res) => {
      console.log("check res:", res);
      toast.success("Login successfully");
      navigate("/dashboard")
    });

    promise.unwrap().catch((err) => {
      console.log("Check err:", err);
      toast.error("Login failed");
    });
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
                <h1 className="text-center font-bold">Login</h1>
              </div>

              <Form.Item<FieldType>
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Link to="/forgot">
                  <p className="mb-3 text-right text-gray-400 hover:cursor-pointer hover:underline hover:underline-offset-2">
                    Forgot password?
                  </p>
                </Link>
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
              </Form.Item>

              <div className="mt-10 flex flex-col items-center">
                <div className="relative w-[90%] mx-auto bg-gray-200 h-[1px]"></div>

                <div className="mt-5 mb-10 w-[100%] flex flex-col gap-5 sm:w-[65%]">
                  <p className="text-center text-gray-400">
                    Or Connect with Social Media
                  </p>
                  <Button type="primary" danger icon={<GoogleOutlined />}>
                    Login with Google
                  </Button>
                  <Button type="primary" icon={<FaFacebook />}>
                    Login with Facebook
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </Content>
      </Layout>
    </>
  );
};

export default Login;
