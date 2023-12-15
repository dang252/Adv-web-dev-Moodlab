import { useState } from "react";

import { Button } from "antd";

import CreateClassGradeModal from "./CreateClassGradeModal";

const DetailClassGrades = () => {
  const [showCreateGrade, setShowCreateGrade] = useState<boolean>(true);

  const handleCreateGradeOk = (values: any) => {
    console.log(values);
  };

  return (
    <div className="w-[100%] 2xl:w-[70%] mx-auto flex flex-col items-center">
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
        <CreateClassGradeModal handleCreateGradeOk={handleCreateGradeOk} />
      )}
    </div>
  );
};

export default DetailClassGrades;
