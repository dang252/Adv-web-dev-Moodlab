import { useEffect, useState } from "react";
import { Button, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import { toast } from "react-toastify";

interface ClassData {
  key: string;
  order: number;
  code: string;
  name: string;
  inviteCode: string;
  status: string;
  classId: number;
  rawData: RawClassData
}

interface RawClassData {
  id: number;
  code: string;
  name: string;
  teacherId: number;
  inviteCode: string;
  status: string;
  theme: string;
  description: string;
}

interface PropType {
  isDarkMode: boolean;
  colorBgContainer: string;
}

const AdminManageClass = (props: PropType) => {
  const { isDarkMode } = props;

  const [data, setData] = useState<ClassData[]>([])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const closeClass = async (record: ClassData) => {
    try {
      const accessToken = localStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");
      console.log("get token ok")
      await axios.put(
        `${import.meta.env.VITE_API_URL}/classes/${record.rawData.id}`,
        {
          "theme": record.rawData.theme,
          "status": "CLOSED"
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("send request ok")
      toast.success("Close class successfully!")
      //reset data 
      const dataCopy = data.map((classInfo: ClassData) => {
        if (classInfo == record) {
          return { ...classInfo, status: "CLOSED" }
        }
        return classInfo;
      })
      setData(dataCopy)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        "Can't do it right now! Try again later!"
      );
    }
  }
  const reopenClass = async (record: ClassData) => {
    try {
      const accessToken = localStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/classes/${record.rawData.id}`,
        {
          "theme": record.rawData.theme,
          "status": "ACTIVED"
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Reopen class successfully!")
      //reset data 
      const dataCopy = data.map((classInfo: ClassData) => {
        if (classInfo == record) {
          return { ...classInfo, status: "ACTIVED" }
        }
        return classInfo;
      })
      setData(dataCopy)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        "Can't do it right now! Try again later!"
      );
    }
  }

  useEffect(() => {
    const getAllClass = async () => {
      try {
        const accessToken = localStorage
          .getItem("accessToken")
          ?.toString()
          .replace(/^"(.*)"$/, "$1");

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/classes`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const mapDataType = response.data.map((classInfo: RawClassData, index: number) => {
          return ({
            key: index + 1,
            order: index + 1,
            code: classInfo.code,
            name: classInfo.name,
            teacherName: classInfo.teacherId,
            inviteCode: classInfo.inviteCode,
            status: classInfo.status,
            classId: classInfo.id,
            rawData: classInfo
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
    getAllClass();
  }, [])

  const columns: ColumnsType<ClassData> = [
    // {
    //   title: "#",
    //   dataIndex: "order",
    //   key: "order",
    //   render: (text) => <p>{text}</p>,
    // },
    {
      title: "Class Id",
      dataIndex: "classId",
      key: "classId",
      sorter: (a, b) => a.classId - b.classId,
      sortDirections: ['ascend', 'descend'],
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      sorter: (a, b) => ('' + a.code).localeCompare(b.code),
      sortDirections: ['ascend', 'descend'],
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => ('' + a.name).localeCompare(b.name),
      sortDirections: ['ascend', 'descend'],
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Invite Code",
      dataIndex: "inviteCode",
      key: "inviteCode",
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
      render: (record: ClassData) => (
        <Space size="middle">
          <Button type="primary" danger onClick={() => {
            closeClass(record);
          }}>
            Close
          </Button>
          <Button type="primary" onClick={() => {
            reopenClass(record);
          }}>
            Re-open
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

export default AdminManageClass;
