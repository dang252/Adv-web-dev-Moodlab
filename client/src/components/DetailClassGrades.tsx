import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import axios from "axios";
import ExcelJS from "exceljs";

import { Button, Empty, Modal, Form, Input, Card, Drawer } from "antd";
import { CaretUpOutlined, CaretDownOutlined, DownloadOutlined } from "@ant-design/icons";

import { MdDelete } from "react-icons/md";

import CreateClassGradeModal from "./CreateClassGradeModal";
import ContentTable from "./ContentTable";
import { ClassType } from "../types/classroom";

import { SHEET_GRADES_COLUMN } from "../utils/grades";

type FieldType = {
  name?: string;
};

type AddDetailContentType = {
  id?: string;
  name?: string;
  grades?: number;
};

interface FieldContentType {
  id: string;
  fieldId: number;
  name: string;
}

const getFieldContentByIdLength = (source: any[], fieldId: number) => {
  return source.filter((content) => {
    return content.fieldId === fieldId;
  }).length;
};

const DetailClassGrades = () => {
  const [form] = Form.useForm();
  const [createDetailContentForm] = Form.useForm();

  const [showCreateGrade, setShowCreateGrade] = useState<boolean>(true);

  const [fieldsContents, setFieldsContents] = useState<any[]>([]);
  const [createFieldContentModal, setCreateFieldContentModal] = useState(false);
  const [targetField, setTargetField] = useState<any>(null);

  const [modifyContentModal, setModifyContentModal] = useState(false);
  const [targetContent, setTargetContent] = useState<FieldContentType | null>(null);
  const [contentList, setContentList] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [isSaveData, setIsSaveData] = useState<boolean>(false);

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
        setFields(response.data);
        setFormFields(response.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error("Can not see grade structure for now! Please try again later");
      }
    };

    setFields(data);
    getClassGradeStructure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line no-unsafe-optional-chaining

  //==================== Create Field
  const updateClassGradeStructure = async (data: any) => {
    try {
      const accessToken = localStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      await axios.put(`${import.meta.env.VITE_API_URL}/classes/${detailClass?.id}/grades`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setFields(formFields);

      if (formFields.length === 0) toast.success("Create grades successfully");
      if (formFields.length !== 0) toast.success("Update grades successfully");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setFormFields(fields);
      console.log(error);
      toast.error("Can not update grade structure for now! Please try again later");
    }
  };

  const handleCreateGradeOk = async (values: any) => {
    const { grades } = values;
    const data = [];

    for (let i = 0; i < formFields.length; ++i) {
      if (formFields[i].key !== undefined) {
        const formField = { ...grades[formFields[i].key], id: i, position: i };
        data.push(formField);
      } else {
        const formField = { ...formFields[i], grade_id: i, position: i };
        data.push(formField);
      }
    }
    console.log(data);
    // console.log(typeof data[data.length - 1].scale)
    updateClassGradeStructure(data);
    // setFields(data);
  };

  //==================== Create Field Content
  const showCreateFieldContentModal = () => {
    setCreateFieldContentModal(true);
  };

  const handleCreateFieldContentOk = () => {
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

  //==================== Modify Field Content
  const showModifyContentModal = (content: FieldContentType) => {
    setModifyContentModal(true);
    setTargetContent(content);
  };

  const onClose = () => {
    setModifyContentModal(false);
    setTargetContent(null);
    setContentList([]);
    setData([]);
  };

  const handleDownloadGradesTemplate = () => {
    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("Grades");

    sheet.properties.defaultRowHeight = 20;

    sheet.columns = SHEET_GRADES_COLUMN;

    workbook.xlsx.writeBuffer().then(function (data) {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `template.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const handleImportExcel = (e: any) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);

    if (e.target.value) e.target.value = null;

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = e?.target?.result;

      if (data) {
        const workbook = XLSX.read(data, { type: "binary" });

        const sheetname = workbook.SheetNames[0];

        const sheet = workbook.Sheets[sheetname];

        const parsedData = XLSX.utils.sheet_to_json(sheet);

        setContentList(parsedData);
        toast.success("Import data successfully");

        return;
      }

      toast.error("Import data failed");
    };
  };

  const handleSaveDetailContentData = () => {
    console.log(data);
    toast.success("Save data successfully");
  };

  const handleExportExcel = () => {
    let SHEET_NAME = "";

    if (targetField && targetContent) SHEET_NAME = targetContent.name;
    else SHEET_NAME = "grades";

    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet(SHEET_NAME);

    sheet.properties.defaultRowHeight = 20;

    sheet.columns = SHEET_GRADES_COLUMN;

    data?.map((d) => {
      sheet.addRow({
        ["#"]: d.key,
        ID: d.id,
        Name: d.name,
        Grades: d.grades,
      });
    });

    workbook.xlsx.writeBuffer().then(function (data) {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${targetField.name}.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const onAddDetailContentFinish = (values: any) => {
    const { id, name, grades } = values;
    let key = null;

    if (contentList.length === 0) key = 1;
    if (contentList.length !== 0) key = contentList.length + 1;

    const newDetail = {
      "#": key,
      ID: Number(id),
      Name: name,
      Grades: Number(grades),
    };

    setContentList([...contentList, newDetail]);

    createDetailContentForm.resetFields();

    toast.success("Add new student successfully");
  };

  const onAddDetailContentFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="w-[100%] md:w-[80%] 2xl:w-[70%] mx-auto flex flex-col items-center">
      <Modal
        title={`Create content for ${targetField?.name}`}
        open={createFieldContentModal}
        onOk={handleCreateFieldContentOk}
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

      <Drawer
        title="Modify Content"
        placement={"left"}
        closable={false}
        onClose={onClose}
        open={modifyContentModal}
        width={"100vw"}
        extra={
          <div className="flex items-center gap-3">
            <Button
              danger
              onClick={() => {
                if (data.length === 0) {
                  toast.error("Data is empty to export");
                  return;
                }

                if (!isSaveData) {
                  toast.error("Please save data before export");
                  return;
                }

                handleExportExcel();
              }}
            >
              Export
            </Button>

            <Button
              onClick={() => {
                setIsSaveData(true);
                handleSaveDetailContentData();
              }}
            >
              Save
            </Button>

            <input
              accept=".xlsx, .xls"
              className="text-gray-400 text-sm file:mr-4 file:px-4 file:py-[5px] file:text-sm file:border-0
                        file:rounded-md file:text-white file:bg-blue-500 hover:file:bg-blue-400 hover:file:cursor-pointer"
              placeholder="Select a document"
              type="file"
              onChange={(e: any) => {
                handleImportExcel(e);
              }}
            />

            <Button onClick={onClose}>Close</Button>
          </div>
        }
      >
        <div className={`${isDarkMode ? "text-white" : "text-black"}`}>
          <p className="text-center text-2xl font-bold my-5">
            Modify Content For {targetContent?.name}
          </p>

          <Form
            form={createDetailContentForm}
            name="add-content-detail"
            className="w-[100%] md:w-[50%] 2xl:w-[30%] mx-auto mb-10"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            onFinish={onAddDetailContentFinish}
            onFinishFailed={onAddDetailContentFailed}
            autoComplete="off"
          >
            <Form.Item<AddDetailContentType>
              label="ID"
              name="id"
              rules={[
                {
                  required: true,
                  pattern: new RegExp(/^[0-9]+$/),
                  message: "Please input id!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<AddDetailContentType>
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input name!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<AddDetailContentType>
              label="Grades"
              name="grades"
              rules={[
                {
                  required: true,
                  pattern: new RegExp(/^[+-]?\d+(\.\d+)?$/),
                  message: "Please input grades!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
              <Button type="primary" htmlType="submit">
                Add
              </Button>
            </Form.Item>
          </Form>

          <ContentTable
            contentList={contentList}
            setContentList={setContentList}
            data={data}
            setData={setData}
          />
        </div>
      </Drawer>

      <div className="flex gap-5 mb-5 self-end">
        <Button
          icon={<DownloadOutlined />}
          onClick={() => {
            handleDownloadGradesTemplate();
          }}
        >
          Download Grades Template
        </Button>
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
        {(fields.length === 0 || fields[0] == undefined) && (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}

        {fields.length !== 0 && fields[0] != undefined && (
          <div className="flex gap-[50px]">
            {fields?.map((field) => {
              return (
                <div key={uuidv4()}>
                  {field.id !== undefined && (
                    <div
                      className={`min-w-[300px] p-4
                                  border border-solid rounded-md ${
                                    isDarkMode ? "border-zinc-700" : "border-zinc-300 shadow-md"
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
                        {getFieldContentByIdLength(fieldsContents, field.id) === 0 && (
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        )}

                        {fieldsContents?.map((content) => {
                          if (content?.fieldId === field.id) {
                            return (
                              <Card
                                key={content?.id}
                                title={<p className="truncate">{content.id}</p>}
                                extra={
                                  <div className="pl-5 flex gap-3">
                                    <Button
                                      type="primary"
                                      onClick={() => {
                                        showModifyContentModal(content);
                                      }}
                                    >
                                      Modify
                                    </Button>
                                    <div
                                      className="flex items-center hover:text-blue-500 hover:cursor-pointer"
                                      onClick={() => {
                                        if (
                                          confirm("Are you sure to delete this content?") == true
                                        ) {
                                          const result = fieldsContents.filter((field) => {
                                            return field.id !== content.id;
                                          });

                                          setFieldsContents(result);
                                        }
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
