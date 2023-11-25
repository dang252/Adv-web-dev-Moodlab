import { Modal, Button, Form, Input } from "antd";

interface PropType {
  isModalOpen: boolean;
  setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleCancel: () => void;
}

type FieldType = {
  teacherName?: string;
  className?: string;
  theme?: string;
};

const CreateClassModal = (props: PropType) => {
  const { isModalOpen, setIsCreateModalOpen, handleCancel } = props;

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log(values);

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
          label="Classroom name"
          name="className"
          rules={[
            { required: true, message: "Please input your classroom name!" },
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
