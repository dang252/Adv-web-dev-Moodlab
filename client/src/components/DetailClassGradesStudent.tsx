import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import axios from "axios";
import ExcelJS from "exceljs";

import {
  Button,
  Empty,
  Modal,
  Form,
  Input,
  Card,
  Drawer,
  DatePicker,
  Dropdown,
  Space,
} from "antd";
import type { MenuProps } from "antd";
import {
  CaretUpOutlined,
  CaretDownOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import { MdDelete } from "react-icons/md";

import CreateClassGradeModal from "./CreateClassGradeModal";
import ContentTable from "./ContentTable";
import { ClassType, Grade } from "../types/classroom";

import {
  SHEET_STUDENTS_GRADES_COLUMN,
  SHEET_GRADES_COLUMN,
} from "../utils/grades";

type FieldType = {
  name?: string;
};

type AddDetailContentType = {
  id?: string;
  name?: string;
  grades?: number;
};

interface FieldContentType {
  id: string;
  fieldId: number;
  name: string;
}

// const getFieldContentByIdLength = (source: any[], fieldId: number) => {
//   return source.filter((content) => {
//     return content.fieldId === fieldId;
//   }).length;
// };

// const findMaxExamGrades = (data: any[]) => {
//   let max = data[0].length;

//   for (let i = 0; i < data.length; ++i) {
//     if (data[i].length > max) {
//       max = data[i];
//     }
//   }

//   return max;
// };

const findMaxExamGrades = (data: any[]) => {
  let max = data[0].length;
  let maxElement: any = data[0];

  for (let i = 0; i < data.length; ++i) {
    if (data[i].length > max) {
      max = data[i].length;
      maxElement = data[i];
    }
  }

  return maxElement;
};

const getExamPoint = (examName: string, studentGrades: any[]) => {
  for (let i = 0; i < studentGrades.length; ++i) {
    if (studentGrades[i].exam.name === examName) return studentGrades[i].point;
  }

  return null;
};


const DetailClassGradesStudent = () => {
  // const [fieldsContents, setFieldsContents] = useState<any[]>([]);
  const [createFieldContentModal, setCreateFieldContentModal] = useState(false);
  const [targetField, setTargetField] = useState<any>(null);

  const [contentList, setContentList] = useState<any[]>([]);
  const [modifyContentModal, setModifyContentModal] = useState(false);
  const [targetContent, setTargetContent] = useState<FieldContentType | null>(
    null
  );
  const [data, setData] = useState<any[]>([]);

  const [fields, setFields] = useState<any[]>([]);

  const [showAllGrades, setShowAllGrades] = useState<boolean>(false);
  const [gradeHeading, setGradeHeading] = useState<string[]>([]);
  const [gradeBody, setGradeBody] = useState<any[]>([]);

  const isDarkMode = useSelector<RootState, boolean | undefined>(
    (state) => state.persisted.users.isDarkMode
  );

  const detailClass = useSelector<RootState, ClassType | null>(
    (state) => state.classes.detailClass
  );

  const grades = useSelector<RootState, Grade[]>(
    (state) => state.classes.detailClassGrades
  );

  const getClassGradeStructure = async () => {
    try {
      const accessToken = localStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/classes/${detailClass?.id}/grades`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("get class all grades structure", response.data)
      setFields(response.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        "Can not see grade structure for now! Please try again later"
      );
    }
  };

  //load grade on enter
  useEffect(() => {
    // setFields(data);
    getClassGradeStructure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (grades.length !== 0) {
  //     const headingData = ["#", "Student ID", "Student name"];
  //     const bodyData: any[] = [];

  //     // Heading handle
  //     const points = grades.map((grade: any) => {
  //       return grade.student.points;
  //     });

  //     const examName = findMaxExamGrades(points)?.map((value: any) => {
  //       return value.exam.name;
  //     });

  //     examName?.map((name: string) => {
  //       headingData.push(name);
  //     });

  //     headingData.push("Overall");

  //     setGradeHeading(headingData);

  //     // Body handle
  //     grades.map((grade: any, index) => {
  //       const student: any = {
  //         order: index + 1,
  //         studentId: grade.studentId,
  //       };

  //       const name = grade.student.firstName + " " + grade.student.lastName;

  //       student["studentName"] = name;

  //       const pointList = grade.student.points;

  //       // Grades
  //       for (let i = 0; i < examName.length; ++i) {
  //         const point = getExamPoint(examName[i], pointList);
  //         if (point === null) student[examName[i]] = "";
  //         else student[examName[i]] = point;
  //       }

  //       student["overall"] = grade.overall;

  //       bodyData.push(student);
  //     });

  //     setGradeBody(bodyData);
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [grades]);

  // //==================== All Grades
  // const handleExportAllGradesExcel = () => {
  //   const SHEET_NAME = "Grades";

  //   const workbook = new ExcelJS.Workbook();

  //   const sheet = workbook.addWorksheet(SHEET_NAME);

  //   sheet.properties.defaultRowHeight = 20;

  //   const columnsData = [
  //     {
  //       header: "#",
  //       key: "#",
  //       width: 5,
  //     },
  //     {
  //       header: "Student ID",
  //       key: "studentId",
  //       width: 20,
  //     },
  //     {
  //       header: "Student Name",
  //       key: "studentName",
  //       width: 40,
  //     },
  //   ];

  //   const points = grades.map((grade: any) => {
  //     return grade.student.points;
  //   });

  //   const examName = findMaxExamGrades(points).map((value: any) => {
  //     return value.exam.name;
  //   });

  //   examName?.map((exam: any) => {
  //     columnsData.push({
  //       header: exam,
  //       key: exam,
  //       width: 10,
  //     });
  //   });

  //   columnsData.push({
  //     header: "Overall",
  //     key: "overall",
  //     width: 10,
  //   });

  //   sheet.columns = columnsData;

  //   gradeBody?.map((g) => {
  //     const keys = [];

  //     for (const key in g) {
  //       keys.push(key);
  //     }

  //     const row: any = { ["#"]: g.order };

  //     keys.map((key) => {
  //       row[key] = g[key];
  //     });

  //     sheet.addRow(row);
  //   });

  //   workbook.xlsx.writeBuffer().then(function (data) {
  //     const blob = new Blob([data], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     });

  //     const url = window.URL.createObjectURL(blob);
  //     const anchor = document.createElement("a");
  //     anchor.href = url;
  //     anchor.download = `${detailClass !== null
  //       ? detailClass.name + "-" + detailClass.code
  //       : "grades"
  //       }.xlsx`;
  //     anchor.click();
  //     window.URL.revokeObjectURL(url);
  //   });
  // };

  const handleExportExcel = () => {
    let SHEET_NAME = "";

    if (targetField && targetContent) SHEET_NAME = targetContent.name;
    else SHEET_NAME = "grades";

    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet(SHEET_NAME);

    sheet.properties.defaultRowHeight = 20;

    sheet.columns = SHEET_STUDENTS_GRADES_COLUMN;

    data?.map((d) => {
      sheet.addRow({
        ["#"]: d.key,
        ID: d.id,
        Name: d.name,
        Grades: d.grades,
      });
    });

    console.log(sheet);

    workbook.xlsx.writeBuffer().then(function (data) {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${targetField.name}.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const onCloseViewAllGrades = () => {
    setShowAllGrades(false);
  };

  const loadModifyModalContent = async (content: any) => {
    try {
      const accessToken = localStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/exam/${content?.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data.points
    }
    catch (error) {
      return null
    }
  }

  //==================== Modify Field Content
  const showModifyContentModal = async (content: FieldContentType) => {
    const loadedData = await loadModifyModalContent(content);
    if (loadedData) {
      const mapDataToExcel = loadedData.map((data: any, index: any) => {
        return ({
          key: index,
          id: data.studentId,
          name: data.student.firstName + " " + data.student.lastName,
          grades: data.point
        })
      })
      setData(mapDataToExcel)
    }
    setModifyContentModal(true);
    setTargetContent(content);
  };

  const onClose = () => {
    setModifyContentModal(false);
    setTargetContent(null);
    setContentList([]);
    setData([]);
  };

  const handleDownloadGradesTemplate = (SHEET_COLUMN: any[]) => {
    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("Grades");

    sheet.properties.defaultRowHeight = 20;

    sheet.columns = SHEET_COLUMN;

    workbook.xlsx.writeBuffer().then(function (data) {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `template.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const { key } = e;
    console.log("click", key);

    if (key === "1") handleDownloadGradesTemplate(SHEET_GRADES_COLUMN);
    if (key === "2") handleDownloadGradesTemplate(SHEET_STUDENTS_GRADES_COLUMN);
  };

  return (
    <div className="w-[100%] md:w-[80%] 2xl:w-[70%] mx-auto flex flex-col items-center">

      <Drawer
        title="All Class Grades"
        placement={"left"}
        closable={false}
        onClose={onCloseViewAllGrades}
        width={"100vw"}
        open={showAllGrades}
        extra={
          <div className="flex items-center gap-3">
            <Button
              type="primary"
              onClick={() => {
                // handleExportAllGradesExcel();
              }}
              danger
            >
              Export
            </Button>
            <Button onClick={onCloseViewAllGrades}>Close</Button>
          </div>
        }
      >
        <div className={`${isDarkMode ? "text-white" : "text-black"}`}>
          <table
            className={`rounded-md w-[100%] border border-solid ${isDarkMode ? "border-gray-500" : "border-gray-300"
              }`}
          >
            <thead
              className={`${isDarkMode ? "bg-[#1d1d1d]" : "bg-[#fafafa]"}`}
            >
              <tr>
                {gradeHeading.map((heading) => {
                  const uid = uuidv4();
                  return (
                    <th key={uid} className="p-4">
                      <p className="text-left font-bold">{heading}</p>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody
              className={`${isDarkMode ? "bg-[#141414]" : "bg-white border"}`}
            >
              {gradeBody.map((body) => {
                const uid = uuidv4();
                const keys = [];

                for (const key in body) {
                  keys.push(key);
                }

                return (
                  <tr key={uid}>
                    {keys.map((key) => {
                      const uid2 = uuidv4();
                      return (
                        <td
                          key={uid2}
                          className={`p-4 ${isDarkMode
                            ? ""
                            : "border-[1px] border-solid border-gray-200"
                            }`}
                        >
                          {body[key]}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-10 flex items-center justify-end gap-1">
            <Button>1</Button>
            <Button>2</Button>
            <Button>3</Button>
          </div>
        </div>
      </Drawer>

      <Drawer
        title="Modify Content"
        placement={"left"}
        closable={false}
        onClose={onClose}
        open={modifyContentModal}
        width={"100vw"}
        extra={
          <div className="flex items-center gap-3">
            <Button
              danger
              onClick={() => {
                if (data.length === 0) {
                  toast.error("Data is empty to export");
                  return;
                }

                handleExportExcel();
              }}
            >
              Export
            </Button>

            <Button onClick={onClose}>Close</Button>
          </div>
        }
      >
        <div className={`${isDarkMode ? "text-white" : "text-black"}`}>
          <p className="text-center text-2xl font-bold my-5">
            Modify Grades of {targetContent?.name}
          </p>

          <ContentTable
            contentList={contentList}
            setContentList={setContentList}
            data={data}
            setData={setData}
          />
        </div>
      </Drawer>

      <div className="flex gap-5 mb-5 self-end">
        <Button
          type="primary"
          danger
          onClick={() => {
            setShowAllGrades(true);
            // console.log(grades);
          }}
        >
          View All Grades
        </Button>
      </div>

      <div className="mt-10 mb-[50px] w-[100%] pb-4 overflow-auto">
        {(fields.length === 0 || fields[0] == undefined) && (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}

        {fields.length !== 0 && fields[0] != undefined && (
          <div className="flex gap-[50px]">
            {fields?.map((field) => {
              return (
                <div key={uuidv4()}>
                  {field.id !== undefined && (
                    <div
                      className={`min-w-[300px] p-4
                                  border border-solid rounded-md ${isDarkMode
                          ? "border-zinc-700"
                          : "border-zinc-300 shadow-md"
                        }`}
                    >
                      <div className="flex items-center justify-between mb-5">
                        <p className="font-bold">
                          {field.name} ({field.scale}%)
                        </p>
                      </div>

                      <div
                        className="mt-10 flex flex-col gap-3 min-h-[400px] max-h-[400px]
                                      overflow-x-hidden overflow-y-auto"
                      >
                        {/* {getFieldContentByIdLength(fieldsContents, field.id) ===
                          0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />} */}

                        {field.exams?.length == 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : field.exams?.map((content: any) => {
                          if (content?.gradeCompositionId === field.id) {
                            return (
                              <Card
                                key={isNaN(content?.id) ? uuidv4() : content?.id}
                                title={
                                  <p className="truncate">{content.name}</p>
                                }
                                extra={
                                  content?.isFinalized &&
                                  <div className="pl-5 flex gap-3">
                                    <Button
                                      type="primary"
                                      onClick={() => {
                                        showModifyContentModal(content);
                                      }}
                                    >
                                      Result
                                    </Button>
                                  </div>
                                }
                                style={{ width: 280 }}
                              >
                                <div className="flex items-center justify-between">
                                  <p>Due: {content?.dueDate.substring(0, 10)}</p>
                                  {
                                    content?.isFinalized
                                    &&
                                    <div className="text-red-600">
                                      Finalized
                                    </div>
                                  }
                                </div>
                              </Card>
                            );
                          }
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailClassGradesStudent;
