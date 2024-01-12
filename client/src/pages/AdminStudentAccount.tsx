import { Button, Form, Input, InputNumber, Popconfirm, Table, Typography } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface PropType {
  isDarkMode: boolean;
  colorBgContainer: string;
}

interface UserData {
  key: string;
  order: number;
  accountId: number;
  studentId: string;
  username: string;
  name: string;
  email: string;
  status: string;
  rawData: ResponseUser;
}

interface ResponseUser {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  account: {
    username: string;
    status: string;
  }
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: UserData;
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

const AdminStudentAccount = (props: PropType) => {
  const { isDarkMode } = props;

  const [data, setData] = useState([])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record: UserData) => record.key === editingKey;

  const edit = (record: Partial<UserData> & { key: React.Key }) => {
    form.setFieldsValue({ order: "", id: "", name: "", grades: "", ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  useEffect(() => {
    const getAllUser = async () => {
      try {
        const accessToken = localStorage
          .getItem("accessToken")
          ?.toString()
          .replace(/^"(.*)"$/, "$1");

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const rawData = response.data.filter((user: ResponseUser) => (user.role != "ADMIN" && user.role != "TEACHER"))
        const mapUserData = rawData.map((user: ResponseUser, index: number) => {
          return ({
            key: index + 1,
            order: index + 1,
            accountId: user.id,
            studentId: user.studentId,
            username: user.account.username,
            name: user.firstName + " " + user.lastName,
            email: user.email,
            status: user.account.status,
            rawData: user
          })
        })
        setData(mapUserData)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(
          "Cannot get users data right now! Try again later!"
        );
      }
    }
    getAllUser();
  }, [])

  const save = async () => {
    // try {
    //   const row = (await form.validateFields()) as UserData;

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
      dataIndex: "accountId",
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
      render: (_: any, record: UserData) => {
        const editable = isEditing(record);
        return (
          <div className="flex gap-5">
            {editable ? (
              <span>
                <Typography.Link
                  onClick={() => save()}
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
      onCell: (record: UserData) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });


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
