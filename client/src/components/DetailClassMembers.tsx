import { Avatar } from "antd";
import {
  UserOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const DetailClassMembers = () => {

  const [teachers, setTeachers] = useState<string[]>([])
  const [otherTeachers, setotherTeachers] = useState<string[]>([])
  const [students, setStudents] = useState<string[]>([])


  const classId = useSelector<RootState, number | undefined>(
    (state) => state.classes.detailClass?.id
  );
  useEffect(() => {
    const getClassMembers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/classes/${classId}/members`,
        )
        // const teacherList = response.data.teacher.map((t: any) => {
        //   return t.firstName + t.lastName
        // })
        console.log(response.data)
        setTeachers([response?.data?.classMembers.teacher.firstName + " " + response?.data?.classMembers.teacher.lastName])
        setStudents(response?.data?.classMembers.students.map((student: any) => {
          return student.student.firstName + " " + student.student.lastName;
        }))
        setotherTeachers(response?.data?.otherTeachers.map((teacher: any) => {
          return teacher.student.firstName + " " + teacher.student.lastName;
        }))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(error)
      }
    }

    getClassMembers()
  }, [classId])

  console.log(otherTeachers);

  return (
    <div className="w-[100%] 2xl:w-[70%] mx-auto flex flex-col">
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <p className="text-2xl text-blue-500 font-bold">Teacher</p>
          <div>
            <UserAddOutlined className="text-2xl hover:cursor-pointer hover:text-blue-500" />
          </div>
        </div>
        <div className="w-[100%] h-[2px] bg-blue-500 my-5"></div>
        <div className="flex flex-col gap-10">
          {teachers?.map((teacher) => {
            const uid = uuidv4();
            return (
              <div key={uid} className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <Avatar size={40} icon={<UserOutlined />} />
                  <p>{teacher}</p>
                </div>
                <UserDeleteOutlined
                  className="text-2xl hover:cursor-pointer hover:text-blue-500"
                  onClick={() => {
                    //
                  }}
                />
              </div>
            );
          })}

        </div>
      </div>
      {
        otherTeachers && otherTeachers.length != 0 &&
        otherTeachers.map((teacher) => {
          return (
            <div className="mt-20">
              <div className="flex items-center justify-between">
                <p className="text-2xl text-blue-500 font-bold">Teaching Assistant</p>
                <div>
                  <UserAddOutlined className="text-2xl hover:cursor-pointer hover:text-blue-500" />
                </div>
              </div>
              <div className="w-[100%] h-[2px] bg-blue-500 my-5"></div>
              <div className="flex flex-col gap-10">
                <div key={uuidv4()} className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <Avatar size={40} icon={<UserOutlined />} />
                    <p>{teacher}</p>
                  </div>
                  <UserDeleteOutlined
                    className="text-2xl hover:cursor-pointer hover:text-blue-500"
                    onClick={() => {
                      //
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })
      }
      <div className="mt-20">
        <div className="flex items-center justify-between">
          <p className="text-2xl text-blue-500 font-bold">Students</p>
          <div className="flex items-center gap-5">
            <p className="font-semibold">{students.length} members</p>
            <UserAddOutlined className="text-2xl hover:cursor-pointer hover:text-blue-500" />
          </div>
        </div>
        <div className="w-[100%] h-[2px] bg-blue-500 my-5"></div>
        <div className="flex flex-col gap-10">
          {students?.map((student) => {
            const uid = uuidv4();
            return (
              <div key={uid} className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <Avatar size={40} icon={<UserOutlined />} />
                  <p>{student}</p>
                </div>
                <UserDeleteOutlined
                  className="text-2xl hover:cursor-pointer hover:text-blue-500"
                  onClick={() => {
                    //
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DetailClassMembers;
