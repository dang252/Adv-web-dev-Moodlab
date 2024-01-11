import { Modal, Button, Form, Input, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../redux/hooks";
import { getInviteCode } from "../redux/reducers/class.reducer";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface PropType {
  isModalOpen: boolean;
  setIsModalJoinOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleCancel: () => void;
}

type FieldType = {
  studentName?: string;
  classCode?: string;
  theme?: string;
};

const JoinClassModal = (props: PropType) => {
  const { isModalOpen, setIsModalJoinOpen, handleCancel } = props;

  const [form] = Form.useForm();

  const dispatchAsync = useAppDispatch();
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    console.log(values);
    const body = {
      code: values.classCode,
    };

    const inviteCodePromise = dispatchAsync(
      getInviteCode(body)
    ).unwrap();

    inviteCodePromise
      .then(() => {
        console.log("f")
        navigate(`/dashboard/classes/${values.classCode}`)
        setIsModalJoinOpen(false)
      })
      .catch(() => {
        toast.error("Join class failed! try again later");
      })
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal
      title="Join Classroom"
      open={isModalOpen}
      onCancel={handleCancel}
      width={600}
      footer={null}
    >
      <Form
        form={form}
        name="join-class-form"
        className="mt-10 w-[100%]"
        labelCol={{ span: 5 }}
        // wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{ studentName: "Minh Trí đẹp trai" }}
        autoComplete="off"
      >
        {/* <div className="flex flex-col gap-5">
          <p className="text-md font-bold ml-[120px]">
            You're joining class with:
          </p>
          <Form.Item<FieldType>
            label={<Avatar size={30} icon={<UserOutlined />} />}
            name="studentName"
          >
            <Input disabled />
          </Form.Item>
        </div> */}

        <div className="mt-5 flex flex-col gap-5">
          <p className="text-md font-bold ml-[120px]">
            Require code from your teacher and put it below...
          </p>
          <Form.Item<FieldType>
            label="Class code"
            name="classCode"
            rules={[
              { required: true, message: "Please input your classroom code!" },
            ]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="flex gap-5 justify-end">
          <Button
            onClick={() => {
              handleCancel();
            }}
          >
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Join
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default JoinClassModal;
