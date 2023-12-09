import { useEffect } from "react";
import { Layout, theme, Button, Form, Input } from "antd";
import { useSelector } from "react-redux";
import { useTitle } from "../hooks/useTitle";

import { IoLogoOctocat } from "react-icons/io";

import { RootState } from "../redux/store";

import LandingHeader from "../components/LandingHeader";
import { toast } from "react-toastify";

const { Header, Content } = Layout;

import { UserAccount } from "../types/user";
import { registerAccount } from "../redux/reducers/user.reducer";

import { Store } from 'antd/lib/form/interface';
import { useAppDispatch } from "../redux/hooks";
import { useNavigate } from "react-router-dom";

interface PropType {
  triggerOpen: boolean;
  setTriggerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  switchMode: (_checked: boolean) => void;
}

type FieldType = {
  username?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
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

const Register = (props: PropType) => {
  const [form] = Form.useForm();
  const dispathAsync = useAppDispatch();
  const navigate = useNavigate();
  const { triggerOpen, setTriggerOpen, switchMode } = props;

  const isDarkMode = useSelector<RootState, boolean>(
    (state) => state.users.isDarkMode
  );

  useTitle("Moodlab | Register");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onSubmit = async (values: Store) => {
    try{
      const UserAccount: UserAccount = {
        username: values.username,
        password: values.password,
        email: values.email,
        firstname: values.firstname,
        lastname: values.lastname,
      };
  
      await dispathAsync(registerAccount(UserAccount)).unwrap();
      toast.success("Register successfully! Please check your email to active your account!")
      navigate("/Login")
    }
    catch (err) {
      console.log("Register failed", err)
      toast.error("Register failed! please try again later")
    }
  }

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
              className={`w-[100%] mx-auto mt-20 p-5 rounded-md sm:max-w-[600px] ${isDarkMode ? "bg-zinc-800" : "bg-white"
                }`}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onSubmit}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              {...layout}
            >
              <div className="text-blue-500 flex gap-5 justify-center items-center mb-10">
                <IoLogoOctocat className="text-3xl" />
                <p className="text-3xl font-bold">|</p>
                <h1 className="text-center font-bold">Register</h1>
              </div>

              <Form.Item<FieldType>
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Please Enter your username!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Email"
                name="email"
                rules={[
                  { required: true, type: "email", message: "Please Enter your email!" },
                ]}
              >
                <Input />
              </Form.Item>


              <Form.Item<FieldType>
                label="Firstname"
                name="firstname"
                rules={[
                  { required: true, message: "Please Enter your firstname!" },
                ]}
              >
                <Input />
              </Form.Item>


              <Form.Item<FieldType>
                label="Lastname"
                name="lastname"
                rules={[
                  { required: true, message: "Please Enter your lastname!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please Enter your password!" },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="confirm"
                label="Confirm Password"
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
                  Register
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Content>
      </Layout>
    </>
  );
};

export default Register;
