import { Layout } from "antd";

const { Footer } = Layout;

interface propType {
  isDarkMode: boolean;
  Footer: typeof Footer;
}

const MainFooter = (props: propType) => {
  const { isDarkMode, Footer } = props;

  return (
    <Footer
      className={`${isDarkMode ? "bg-zinc-900" : ""}`}
      style={{ textAlign: "center" }}
    >
      Copyright© Created by Moodlab
    </Footer>
  );
};

export default MainFooter;
