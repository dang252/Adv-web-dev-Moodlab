import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { v4 as uuidv4 } from "uuid";

import { Button, Empty, Modal, Form, Input, Card } from "antd";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";

import { MdDelete } from "react-icons/md";

import CreateClassGradeModal from "./CreateClassGradeModal";

type FieldType = {
  name?: string;
};

const getFieldContentByIdLength = (source: any[], fieldId: number) => {
  return source.filter((content) => {
    return content.fieldId === fieldId;
  }).length;
};

const DetailClassGrades = () => {
  const [form] = Form.useForm();

  const [showCreateGrade, setShowCreateGrade] = useState<boolean>(true);
  const [fields, setFields] = useState<any[]>([
    { name: "BTCN", scale: "10", id: 0 },
    { name: "GK", scale: "30", id: 1 },
    { name: "CK", scale: "60", id: 2 },
  ]);

  const [fieldsContents, setFieldsContents] = useState<any[]>([]);
  const [createFieldContentModal, setCreateFieldContentModal] = useState(false);
  const [targetField, setTargetField] = useState<any>(null);

  const isDarkMode = useSelector<RootState, boolean | undefined>(
    (state) => state.users.isDarkMode
  );

  //==================== Create Field
  const handleCreateGradeOk = (values: any) => {
    const { grades } = values;
    const data = [];

    for (let i = 0; i < fields.length; ++i) {
      if (fields[i].key !== undefined) {
        const field = { ...grades[fields[i].key], id: i };
        data.push(field);
      } else {
        const field = { ...fields[i], id: i };
        data.push(field);
      }
    }

    setFields(data);
    console.log(data);
  };

  //==================== Create Field Content
  const showCreateFieldContentModal = () => {
    setCreateFieldContentModal(true);
  };

  const handleCraeteFieldContentOk = () => {
    setCreateFieldContentModal(false);
  };

  const onCreateContentFinish = (values: any) => {
    const { name } = values;

    const newFieldContent = {
      id: uuidv4(),
      fieldId: targetField?.id,
      name: name,
    };

    console.log(newFieldContent);

    setFieldsContents([...fieldsContents, newFieldContent]);
    setCreateFieldContentModal(false);
    form.resetFields();
  };

  const onCreateContentFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="w-[100%] md:w-[80%] 2xl:w-[70%] mx-auto flex flex-col items-center">
      <Modal
        title={`Create content for ${targetField?.name}`}
        open={createFieldContentModal}
        onOk={handleCraeteFieldContentOk}
        width={600}
        footer={null}
      >
        <Form
          form={form}
          name="Create grade content"
          className="mt-10"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          onFinish={onCreateContentFinish}
          onFinishFailed={onCreateContentFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input content name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 5, span: 19 }}>
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => {
                  setCreateFieldContentModal(false);
                  setTargetField(null);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Create
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <div className="flex gap-5 mb-5 self-end">
        <Button
          type="primary"
          icon={showCreateGrade ? <CaretUpOutlined /> : <CaretDownOutlined />}
          onClick={() => {
            setShowCreateGrade(!showCreateGrade);
          }}
        >
          Create Grade
        </Button>
      </div>

      {showCreateGrade && (
        <CreateClassGradeModal
          fields={fields}
          setFields={setFields}
          handleCreateGradeOk={handleCreateGradeOk}
        />
      )}

      <div className="mt-10 mb-[50px] w-[100%] pb-4 overflow-auto">
        {fields.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}

        {fields.length !== 0 && (
          <div className="flex gap-[50px]">
            {fields?.map((field) => {
              return (
                <div key={uuidv4()}>
                  {field.id !== undefined && (
                    <div
                      className={`min-w-[300px] p-4
                                  border border-solid rounded-md ${
                                    isDarkMode
                                      ? "border-zinc-700"
                                      : "border-zinc-300 shadow-md"
                                  }`}
                    >
                      <div className="flex items-center justify-between mb-5">
                        <p className="font-bold">
                          {field.name} ({field.scale}%)
                        </p>
                        <Button
                          type="primary"
                          onClick={() => {
                            showCreateFieldContentModal();
                            setTargetField(field);
                          }}
                        >
                          Add
                        </Button>
                      </div>

                      <div
                        className="mt-10 flex flex-col gap-3 min-h-[400px] max-h-[400px]
                                      overflow-x-hidden overflow-y-auto"
                      >
                        {getFieldContentByIdLength(fieldsContents, field.id) ===
                          0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}

                        {fieldsContents?.map((content) => {
                          if (content?.fieldId === field.id) {
                            return (
                              <Card
                                key={content?.id}
                                title={content.id}
                                extra={
                                  <div className="pl-5 flex gap-3">
                                    <div
                                      className="flex items-center hover:text-blue-500 hover:cursor-pointer"
                                      onClick={() => {
                                        const result = fieldsContents.filter(
                                          (field) => {
                                            return field.id !== content.id;
                                          }
                                        );

                                        setFieldsContents(result);
                                      }}
                                    >
                                      <MdDelete size={25} />
                                    </div>
                                  </div>
                                }
                                style={{ width: 280 }}
                              >
                                <p>{content?.name}</p>
                              </Card>
                            );
                          }
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailClassGrades;
