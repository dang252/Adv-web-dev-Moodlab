import { useEffect, useState } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

interface StudentData {
    key: string;
    order: number;
    accountId: string;
    studentId: string;
    name: string;
    point: number;
    rawData: RawStudentData
}

interface RawStudentData {
    studentId: number;
    examId: number;
    point: number;
    student: {
        firstName: string;
        lastName: string;
        email: string;
        studentId: string;
    }
}

interface PropType {
    data: RawStudentData[];
    isDarkMode: boolean | undefined;
    colorBgContainer: string;
}

const ContentTableStudent = (props: PropType) => {
    const { isDarkMode, data } = props;
    const [studentData, setStudentData] = useState<any>();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (data) {
            const dataCopy = data.map((student, index) => {
                return ({
                    key: index,
                    order: index,
                    accountId: student.studentId,
                    studentId: student.student.studentId,
                    name: student.student.firstName + " " + student.student.lastName,
                    point: student.point,
                    rawData: student,
                })
            })
            console.log(dataCopy)
            setStudentData(dataCopy)
        }
    }, [data])

    const columns: ColumnsType<StudentData> = [
        {
            title: "#",
            dataIndex: "order",
            key: "order",
            render: (text) => <p>{text}</p>,
        },
        {
            title: "Account Id",
            dataIndex: "accountId",
            key: "accountId",
            render: (text) => <p>{text}</p>,
        },
        {
            title: "Student Id",
            dataIndex: "studentId",
            key: "studentId",
            render: (text) => <p>{text}</p>,
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text) => <p>{text}</p>,
        },
        {
            title: "Point",
            dataIndex: "point",
            key: "point",
            render: (text) => <p>{text}</p>,
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
            <Table columns={columns} dataSource={studentData} />
        </div>
    );
};

export default ContentTableStudent;
