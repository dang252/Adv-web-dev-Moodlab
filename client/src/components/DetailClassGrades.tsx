import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { v4 as uuidv4 } from "uuid";

import { Button, Empty, Modal, Form, Input, Card } from "antd";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";

import { MdDelete } from "react-icons/md";

import CreateClassGradeModal from "./CreateClassGradeModal";
import { ClassType } from "../types/classroom";
import { toast } from "react-toastify";
import axios from "axios";

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

  const [fieldsContents, setFieldsContents] = useState<any[]>([]);
  const [createFieldContentModal, setCreateFieldContentModal] = useState(false);
  const [targetField, setTargetField] = useState<any>(null);

  const isDarkMode = useSelector<RootState, boolean | undefined>(
    (state) => state.persisted.users.isDarkMode
  );

  const detailClass = useSelector<RootState, ClassType | null>(
    (state) => state.classes.detailClass
  );
  const [fields, setFields] = useState<any[]>([]);
  const [formFields, setFormFields] = useState<any[]>([]);
  useEffect(() => {
    const getClassGradeStructure = async () => {
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
        setFields(response.data)
        setFormFields(response.data)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error("Can not see grade structure for now! Please try again later")
      }
    }

    getClassGradeStructure()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // eslint-disable-next-line no-unsafe-optional-chaining

  //==================== Create Field
  const updateClassGradeStructure = async (data: any) => {
    try {
      const accessToken = localStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/classes/${detailClass?.id}/grades`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setFields(formFields)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setFormFields(fields)
      console.log(error)
      toast.error("Can not update grade structure for now! Please try again later")
    }
  }
  const handleCreateGradeOk = async (values: any) => {
    const { grades } = values;
    const data = [];

    for (let i = 0; i < formFields.length; ++i) {
      if (formFields[i].key !== undefined) {
        const formField = { ...grades[formFields[i].key], id: i, position: i, };
        data.push(formField);
      } else {
        const formField = { ...formFields[i], grade_id: i, position: i, };
        data.push(formField);
      }
    }
    // console.log(data);
    // console.log(typeof data[data.length - 1].scale)
    updateClassGradeStructure(data)
    // setFields(data);
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
          fields={formFields}
          setFields={setFormFields}
          handleCreateGradeOk={handleCreateGradeOk}
        />
      )}

      <div className="mt-10 mb-[50px] w-[100%] pb-4 overflow-auto">
        {(fields.length === 0 || fields[0] == undefined) && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}

        {fields.length !== 0 && fields[0] != undefined && (
          <div className="flex gap-[50px]">
            {fields?.map((field) => {
              return (
                <div key={uuidv4()}>
                  {field.id !== undefined && (
                    <div
                      className={`min-w-[300px] p-4
                                  border border-solid rounded-md ${isDarkMode
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
