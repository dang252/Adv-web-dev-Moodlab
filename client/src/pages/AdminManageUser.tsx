import { useEffect, useState } from "react";
import { Button, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import { toast } from "react-toastify";

interface UserData {
  key: string;
  order: number;
  accountId: number;
  username: string;
  email: string;
  status: string;
}

interface ResponseUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  account: {
    username: string;
    status: string;
  }
}

const columns: ColumnsType<UserData> = [
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

interface PropType {
  isDarkMode: boolean;
  colorBgContainer: string;
}

const AdminManageUser = (props: PropType) => {
  const { isDarkMode } = props;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [data, setData] = useState<UserData[]>([])

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
        console.log(response.data)
        const mapDataType = response.data.map((user: ResponseUser, index: number) => {
          return ({
            key: index,
            order: user.id,
            accountId: user.id,
            username: user.account.username,
            email: user.email,
            status: user.account.status,
          })
        })
        setData(mapDataType)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(
          "Cannot get users data right now! Try again later!"
        );
      }
    }
    getAllUser();
  }, [])

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
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default AdminManageUser;
