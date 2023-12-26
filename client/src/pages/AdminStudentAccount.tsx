import { useEffect } from "react";

interface PropType {
  isDarkMode: boolean;
  colorBgContainer: string;
}

const AdminStudentAccount = (props: PropType) => {
  const { isDarkMode } = props;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className={`rounded-md flex flex-col gap-[100px] md:gap-[200px] ${
        isDarkMode ? "" : ""
      }`}
      style={{
        minHeight: "100vh",
        padding: 24,
        color: isDarkMode ? "#fff" : undefined,
      }}
    >
      AdminStudentAccount
    </div>
  );
};

export default AdminStudentAccount;
