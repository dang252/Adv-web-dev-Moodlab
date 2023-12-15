import { useState } from "react";

import { Button } from "antd";

import CreateClassGradeModal from "./CreateClassGradeModal";

const DetailClassGrades = () => {
  const [showCreateGrade, setShowCreateGrade] = useState<boolean>(true);
  const [fields, setFields] = useState<any[]>([]);

  const handleCreateGradeOk = (values: any) => {
    const { grades } = values;
    const data = [];

    for (let i = 0; i < fields.length; ++i) {
      const field = { ...grades[fields[i].key], id: i };
      data.push(field);
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
