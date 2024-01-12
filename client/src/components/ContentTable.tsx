import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
} from "antd";

interface Item {
  key: string;
  name: string;
  age: number;
  address: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: Item;
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

interface PropType {
  contentList: any[];
  setContentList: React.Dispatch<React.SetStateAction<any[]>>;
  data: any[];
  setData: React.Dispatch<React.SetStateAction<any[]>>;
}

const ContentTable = (props: PropType) => {
  const { contentList, setContentList, data, setData } = props;

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  console.log(data)
  useEffect(() => {
    if (contentList.length !== 0) {
      const newData = contentList.map((student: any) => {
        return {
          key: student["#"],
          order: student["#"],
          id: student.ID,
          name: student.Name,
          grades: student.Grades,
        };
      });

      setData(newData);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentList]);

  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ order: "", id: "", name: "", grades: "", ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "order",
      width: "5%",
      editable: false,
    },
    {
      title: "Student ID",
      dataIndex: "id",
      width: "15%",
      editable: true,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: "30%",
      editable: true,
    },
    {
      title: "Grades",
      dataIndex: "grades",
      width: "20%",
      editable: true,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_: any, record: Item) => {
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

            <Button
              type="primary"
              danger
              onClick={() => {
                if (confirm("Are you sure to delete this student?") == true) {
                  setData(
                    data.filter((r) => {
                      return r.key !== record.key;
                    })
                  );

                  setContentList(
                    contentList.filter((c) => {
                      return c["#"] !== record.key;
                    })
                  );
                }
              }}
            >
              Delete
            </Button>
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
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
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
  );
};

export default ContentTable;
