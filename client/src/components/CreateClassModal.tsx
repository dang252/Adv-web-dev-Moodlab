import { Modal, Button, Form, Input } from "antd";

import { useAppDispatch } from "../redux/hooks";

import { createNewClass, getClasses } from "../redux/reducers/class.reducer";
import { toast } from "react-toastify";

interface PropType {
  isModalOpen: boolean;
  setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleCancel: () => void;
}

type FieldType = {
  teacherName?: string;
  code?: string;
  className?: string;
  subject?: string;
  theme?: string;
};

const CreateClassModal = (props: PropType) => {
  const { isModalOpen, setIsCreateModalOpen, handleCancel } = props;

  const dispatchAsync = useAppDispatch();

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const newClass = {
      code: values.code,
      name: values.className,
      subject: values.subject,
    };

    const promise = dispatchAsync(createNewClass(newClass));

    promise.then((res) => {
      if (res.type === "class/createNewClass/fulfilled") {
        toast.success("Create class successfully");

        dispatchAsync(getClasses());
      }

      if (res.type === "class/createNewClass/rejected") {
        toast.error("Create class failed");
      }
    });

    form.resetFields();
    setIsCreateModalOpen(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal
      title="Create Classroom"
      open={isModalOpen}
      onCancel={handleCancel}
      width={600}
      footer={null}
    >
      <Form
        form={form}
        name="create-class-form"
        className="mt-10"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{ teacherName: "Minh Trí đẹp trai" }}
        autoComplete="off"
      >
        <Form.Item<FieldType> label="Teacher name" name="teacherName">
          <Input disabled />
        </Form.Item>

        <Form.Item<FieldType>
          label="Code"
          name="code"
          rules={[{ required: true, message: "Please input your class code!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Class name"
          name="className"
          rules={[{ required: true, message: "Please input your class name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Subject"
          name="subject"
          rules={[
            { required: true, message: "Please input your class subject!" },
          ]}
        >
          <Input />
        </Form.Item>

        <div className="flex gap-5 justify-end">
          <Button
            onClick={() => {
              handleCancel();
            }}
          >
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateClassModal;
