import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import axios from "axios";
import ExcelJS from "exceljs";

import {
  Button,
  Empty,
  Card,
  Drawer,
} from "antd";
import { ClassType, } from "../types/classroom";

import {
  SHEET_STUDENTS_GRADES_COLUMN,
} from "../utils/grades";
import ContentTableStudent from "./ContentTableStudent";

interface FieldContentType {
  id: string;
  fieldId: number;
  name: string;
}

const DetailClassGradesStudent = () => {
  const [targetField, setTargetField] = useState<any>(null);

  const [modifyContentModal, setModifyContentModal] = useState(false);
  const [targetContent, setTargetContent] = useState<FieldContentType | null>(
    null
  );
  const [data, setData] = useState<any[]>([]);
  const [excelData, setExcelData] = useState<any[]>([]);

  const [fields, setFields] = useState<any[]>([]);

  const isDarkMode = useSelector<RootState, boolean | undefined>(
    (state) => state.persisted.users.isDarkMode
  );

  const detailClass = useSelector<RootState, ClassType | null>(
    (state) => state.classes.detailClass
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

  const handleExportExcel = () => {
    let SHEET_NAME = "";

    if (targetField && targetContent) SHEET_NAME = targetContent.name;
    else SHEET_NAME = "grades";

    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet(SHEET_NAME);

    sheet.properties.defaultRowHeight = 20;

    sheet.columns = SHEET_STUDENTS_GRADES_COLUMN;

    excelData?.map((d) => {
      sheet.addRow({
        ["#"]: d.key,
        ID: d.id,
        Name: d.name,
        Grades: d.grades,
      });
    });

    console.log(sheet);

    workbook.xlsx.writeBuffer().then(function (excelData) {
      const blob = new Blob([excelData], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${targetContent?.name}.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
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
      toast.error("Can't get result now! Try again later!")
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
      setExcelData(mapDataToExcel)
      setData(loadedData)
      setModifyContentModal(true);
      setTargetContent(content);
    }
  };

  const onClose = () => {
    setModifyContentModal(false);
    setTargetContent(null);
    setData([]);
  };

  return (
    <div className="w-[100%] md:w-[80%] 2xl:w-[70%] mx-auto flex flex-col items-center">

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
            Result of {targetContent?.name}
          </p>

          <ContentTableStudent
            data={data}
            isDarkMode={isDarkMode} colorBgContainer={""}
          />
        </div>
      </Drawer>
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
                                        setTargetField(field);
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
