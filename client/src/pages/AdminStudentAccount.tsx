import { Button, Form, Input, InputNumber, Popconfirm, Space, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";

interface PropType {
  isDarkMode: boolean;
  colorBgContainer: string;
}

interface DataType {
  key: string;
  order: number;
  accountId: number;
  studentId: string;
  name: string;
  editable?: boolean;
}


interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: DataType;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const data: DataType[] = []

const AdminStudentAccount = (props: PropType) => {
  const { isDarkMode } = props;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record: DataType) => record.key === editingKey;

  const edit = (record: Partial<DataType> & { key: React.Key }) => {
    form.setFieldsValue({ order: "", id: "", name: "", grades: "", ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: React.Key) => {
    // try {
    //   const row = (await form.validateFields()) as DataType;

    //   const newData = [...data];
    //   const index = newData.findIndex((item) => key === item.key);
    //   if (index > -1) {
    //     const item = newData[index];
    //     newData.splice(index, 1, {
    //       ...item,
    //       ...row,
    //     });
    //     // setData(newData);
    //     setEditingKey("");
    //   } else {
    //     newData.push(row);
    //     // setData(newData);
    //     setEditingKey("");
    //   }
    // } catch (errInfo) {
    //   console.log("Validate Failed:", errInfo);
    // }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "order",
      key: "order",
      editable: false,
      render: (text: any) => <p>{text}</p>,
    },
    {
      title: "Account Id",
      dataIndex: "accoutnId",
      key: "accountId",
      editable: false,
      render: (text: any) => <p>{text}</p>,
    },
    {
      title: "Student Id",
      dataIndex: "studentId",
      key: "studentId",
      editable: true,
      render: (text: any) => <p>{text}</p>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: any) => <p>{text}</p>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_: any, record: DataType) => {
        const editable = isEditing(record);
        return (
          <div className="flex gap-5">
            {editable ? (
              <span>
                <Typography.Link
                  onClick={() => save(record.key)}
                  style={{ marginRight: 8 }}
                >
                  Save
                </Typography.Link>
                <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                  <a>Cancel</a>
                </Popconfirm>
              </span>
            ) : (
              <Button
                type="primary"
                disabled={editingKey !== ""}
                onClick={() => edit(record)}
              >
                Edit
              </Button>
            )}

            {/* <Button
              type="primary"
              danger
              onClick={() => {
                if (confirm("Are you sure to delete this student?") == true) {
                  // setData(
                  //   data.filter((r) => {
                  //     return r.key !== record.key;
                  //   })
                  // );

                  // setContentList(
                  //   contentList.filter((c) => {
                  //     return c["#"] !== record.key;
                  //   })
                  // );
                }
              }}
            >
              Delete
            </Button> */}
          </div>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const data: readonly any[] = [
    {
      key: "1",
      order: 1,
      accountId: String(32),
      studentId: 2113,
      name: "HS A",
    },
    {
      key: "2",
      order: 2,
      accountId: "33",
      studentId: 2123,
      name: "HS B",
    },
    {
      key: "3",
      order: 3,
      accountId: "35",
      studentId: 2114,
      name: "HS C",
    },
  ]


  return (
    <div
      className={`rounded-md flex flex-col gap-[100px] md:gap-[200px] ${isDarkMode ? "" : ""
        }`}
      style={{
        minHeight: "100vh",
        padding: 24,
        color: isDarkMode ? "#fff" : undefined,
      }}
    >
      <Form form={form} component={false}>
        <Table
          className="overflow-x-auto"
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </div>
  );
};

export default AdminStudentAccount;
