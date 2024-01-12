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
  rawData: ResponseUser;
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

  const banAccount = async (record: UserData) => {
    try {
      // console.log(record)
      const accessToken = localStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");
      // console.log("get token ok")
      await axios.put(
        `${import.meta.env.VITE_API_URL}/user`,
        {
          "first_name": record.rawData.firstName,
          "last_name": record.rawData.lastName,
          "user_id": record.accountId,
          "status": "BLOCKED"
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // console.log("send request ok")
      toast.success("Ban user successfully!")
      //reset data 
      const dataCopy = data.map((user: UserData) => {
        if (user == record) {
          return { ...user, status: "BLOCKED" }
        }
        return user;
      })
      setData(dataCopy)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        "Cannot get users data right now! Try again later!"
      );
    }
  }
  const unbanAccount = async (record: UserData) => {
    console.log(record)
    try {
      const accessToken = localStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/user`,
        {
          "first_name": record.rawData.firstName,
          "last_name": record.rawData.lastName,
          "user_id": record.accountId,
          "status": "ACTIVED"
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Unban user successfully!")
      //reset data 
      const dataCopy = data.map((user: UserData) => {
        if (user == record) {
          return { ...user, status: "ACTIVED" }
        }
        return user;
      })
      setData(dataCopy)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        "Cannot get users data right now! Try again later!"
      );
    }
  }

  // const adminId = useSelector<RootState, number>(
  //   (state) => state.persisted.users.userId
  // )

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
        const rawData = response.data.filter((user: ResponseUser) => user.role != "ADMIN")
        const mapDataType = rawData.map((user: ResponseUser, index: number) => {
          return ({
            key: index + 1,
            order: index + 1,
            accountId: user.id,
            username: user.account.username,
            email: user.email,
            status: user.account.status,
            rawData: user
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

  const columns: ColumnsType<UserData> = [
    {
      title: "Account ID",
      dataIndex: "accountId",
      key: "accountId",
      sorter: (a, b) => a.accountId - b.accountId,
      sortDirections: ['ascend', 'descend'],
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => ('' + a.username).localeCompare(b.username),
      sortDirections: ['ascend', 'descend'],
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => ('' + a.email).localeCompare(b.email),
      sortDirections: ['ascend', 'descend'],
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => ('' + a.status).localeCompare(b.status),
      sortDirections: ['ascend', 'descend'],
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <Button type="primary" danger onClick={() => {
            banAccount(record)
          }}>
            Ban
          </Button>
          <Button type="primary" onClick={() => {
            unbanAccount(record)
          }}>
            Unban
          </Button>
        </Space>
      ),
    },
  ];

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
