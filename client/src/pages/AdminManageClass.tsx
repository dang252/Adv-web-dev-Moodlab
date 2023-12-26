import { useEffect } from "react";
import { Button, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

interface DataType {
  key: string;
  order: number;
  code: string;
  name: string;
  teacherName: string;
  status: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "#",
    dataIndex: "order",
    key: "order",
    render: (text) => <p>{text}</p>,
  },
  {
    title: "Code",
    dataIndex: "code",
    key: "code",
    render: (text) => <p>{text}</p>,
  },
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
    render: (text) => <p>{text}</p>,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <p>{text}</p>,
  },
  {
    title: "Teacher name",
    dataIndex: "teacherName",
    key: "teacherName",
    render: (text) => <p>{text}</p>,
  },
  {
    title: "Action",
    key: "action",
    render: (_) => (
      <Space size="middle">
        <Button type="primary" danger>
          Inactive
        </Button>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: "1",
    order: 1,
    code: "FKasddgf",
    name: "Thiet ke phan mem",
    teacherName: "Tran Gia Bao",
    status: "Active",
  },
  {
    key: "2",
    order: 2,
    code: "YHCVgfyt",
    name: "Lap trinh web",
    teacherName: "Tran Gia Bao",
    status: "Inactive",
  },
  {
    key: "3",
    order: 3,
    code: "Vdfgdfg",
    name: "Lap trinh huong toi tuong",
    teacherName: "Tran Gia Bao",
    status: "Active",
  },
];

interface PropType {
  isDarkMode: boolean;
  colorBgContainer: string;
}

const AdminManageClass = (props: PropType) => {
  const { isDarkMode } = props;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className={`rounded-md flex flex-col gap-[100px] md:gap-[200px] ${
        isDarkMode ? "" : ""
      }`}
      style={{
        minHeight: "100vh",
        padding: 24,
        color: isDarkMode ? "#fff" : undefined,
      }}
    >
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default AdminManageClass;
