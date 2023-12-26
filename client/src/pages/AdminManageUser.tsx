import { useEffect } from "react";
import { Button, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

interface DataType {
  key: string;
  order: number;
  accountId: number;
  username: string;
  email: string;
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
    title: "Account ID",
    dataIndex: "accountId",
    key: "accountId",
    render: (text) => <p>{text}</p>,
  },
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
    render: (text) => <p>{text}</p>,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (text) => <p>{text}</p>,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => <p>{text}</p>,
  },
  {
    title: "Action",
    key: "action",
    render: (_) => (
      <Space size="middle">
        <Button type="primary" danger>
          Lock
        </Button>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: "1",
    order: 1,
    accountId: 32,
    username: "minhtrideptrai",
    email: "tri@gmail.com",
    status: "OK",
  },
  {
    key: "2",
    order: 2,
    accountId: 55,
    username: "minhtrideptrai123",
    email: "tri456@gmail.com",
    status: "BAN",
  },
  {
    key: "3",
    order: 3,
    accountId: 104,
    username: "minhtrideptrai345",
    email: "tri123@gmail.com",
    status: "OK",
  },
];

interface PropType {
  isDarkMode: boolean;
  colorBgContainer: string;
}

const AdminManageUser = (props: PropType) => {
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

export default AdminManageUser;
