import { useState } from "react";

import { Button } from "antd";

import CreateClassGradeModal from "./CreateClassGradeModal";

const DetailClassGrades = () => {
  const [showCreateGrade, setShowCreateGrade] = useState<boolean>(true);
  const [fields, setFields] = useState<any[]>([
    { name: "BTCN", scale: "10", id: 0 },
    { name: "GK", scale: "30", id: 1 },
    { name: "CK", scale: "60", id: 2 },
  ]);

  const handleCreateGradeOk = (values: any) => {
    const { grades } = values;
    const data = [];

    for (let i = 0; i < fields.length; ++i) {
      if (fields[i].key !== undefined) {
        const field = { ...grades[fields[i].key], id: i };
        data.push(field);
      } else {
        const field = { ...fields[i], id: i };
        data.push(field);
      }
    }

    console.log(data);
  };

  return (
    <div className="w-[100%] md:w-[80%] 2xl:w-[70%] mx-auto flex flex-col items-center">
      <div className="flex gap-5 mb-5 self-end">
        <Button
          type="primary"
          onClick={() => {
            setShowCreateGrade(!showCreateGrade);
          }}
        >
          Create Grade
        </Button>
      </div>

      {showCreateGrade && (
        <CreateClassGradeModal
          fields={fields}
          setFields={setFields}
          handleCreateGradeOk={handleCreateGradeOk}
        />
      )}
    </div>
  );
};

export default DetailClassGrades;
