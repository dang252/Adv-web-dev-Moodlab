import { useEffect } from "react";
import { Layout, theme } from "antd";
import { useSelector } from "react-redux";
import { useTitle } from "../hooks/useTitle";
import { Link } from "react-router-dom";
import { FaYoutube } from "react-icons/fa";
import { GithubOutlined } from "@ant-design/icons";

import { RootState } from "../redux/store";

import LandingHeader from "../components/LandingHeader";
import MainFooter from "../components/MainFooter";
import ContributorCard from "../components/ContributorCard";

const { Header, Content, Footer } = Layout;

interface PropType {
  triggerOpen: boolean;
  setTriggerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  switchMode: (_checked: boolean) => void;
}

const Landing = (props: PropType) => {
  const { triggerOpen, setTriggerOpen, switchMode } = props;

  const isDarkMode = useSelector<RootState, boolean>(
    (state) => state.persisted.users.isDarkMode
  );

  useTitle("Moodlab | Welcome");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <>
      <LandingHeader
        Header={Header}
        isDarkMode={isDarkMode}
        colorBgContainer={colorBgContainer}
        triggerOpen={triggerOpen}
        setTriggerOpen={setTriggerOpen}
        switchMode={switchMode}
      />
      <Layout className={`${isDarkMode ? "bg-zinc-900" : ""}`}>
        <Content
          className="mt-[80px] mb-0 mx-[10px] xl:mt-[0px] sm:mx-[40px]"
          style={{ overflow: "initial" }}
        >
          <div
            className={`rounded-md ${isDarkMode ? "" : ""}`}
            style={{
              minHeight: "100vh",
              padding: 24,
              color: isDarkMode ? "#fff" : undefined,
              // background: !isDarkMode ? colorBgContainer : undefined,
            }}
          >
            <div
              className={`hidden xl:block absolute z-10 mt-100 w-[100%] h-[750px] left-0 ${isDarkMode ? "bg-zinc-800" : "bg-blue-500"
                }`}
            ></div>
            <section className="relative z-20">
              <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
                <div className="flex justify-center items-center">
                  <div>
                    <h1 className="mb-4 text-[50px] text-blue-500 xl:text-white font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl">
                      Welcome to Moodlab
                    </h1>
                    <p className="mb-8 text-lg font-normal text-gray-400 xl:text-gray-300 lg:text-xl">
                      Here we provide the best solution for your learning
                      process.
                    </p>
                  </div>
                  <img
                    src="./landing hero.png"
                    alt="hero"
                    className="hidden w-[600px] xl:block"
                  />
                </div>
                <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                  <Link
                    to="/login"
                    className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-600 hover:bg-blue-700 hover:text-white"
                  >
                    Learn more
                    <svg
                      className="ml-2 -mr-1 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </Link>
                  <a
                    href="#"
                    className={`inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center rounded-lg border border-solid border-gray-400 hover:border-blue-500 hover:text-blue-500 ${isDarkMode ? "text-white" : "text-black xl:bg-white"
                      }`}
                  >
                    <svg
                      className="mr-2 -ml-1 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                    </svg>
                    Watch video
                  </a>
                </div>
                <div className="px-4 mx-auto text-[18px] md:max-w-screen-md lg:max-w-screen-lg lg:px-36">
                  <span className="text-center font-semibold text-gray-400 uppercase">
                    FEATURED IN
                  </span>
                  <div className="flex gap-10 flex-wrap justify-center items-center mt-8 text-gray-500">
                    <a
                      href="#"
                      className="lg:mb-0 flex gap-3 hover:text-gray-800 dark:hover:text-gray-400"
                    >
                      <FaYoutube className="text-5xl" />
                    </a>
                    <a
                      href="https://github.com/dang252/Adv-web-dev-Moodlab"
                      className="lg:mb-0 flex gap-3 hover:text-gray-800 dark:hover:text-gray-400"
                    >
                      <GithubOutlined className="text-5xl" />
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <section className="my-40">
              <h1 className="mb-20 text-2xl text-blue-500 text-center font-bold tracking-tight leading-none">
                Contributors
              </h1>
              <div className="flex flex-col flex-wrap gap-[150px] items-center justify-around sm:gap-0 md:flex-row">
                <ContributorCard
                  name="Nguyễn Nhật Đăng"
                  src="./avatar/nhatdang.jpg"
                  role="Leader, Developer"
                  fb="https://www.facebook.com/dageng.252"
                  github="https://github.com/dang252"
                />
                <ContributorCard
                  name="Lê Minh Trí"
                  src="./avatar/minhtri.jpg"
                  role="Developer"
                  fb="https://www.facebook.com/minhtrifit"
                  github="https://github.com/minhtrifit"
                />
                <ContributorCard
                  name="Trần Gia Bảo"
                  src="./avatar/giabao.jpg"
                  role="Developer"
                  fb="https://www.facebook.com/profile.php?id=100010425813591"
                  github="https://github.com/trangiabao2702"
                />
              </div>
            </section>
          </div>
        </Content>
      </Layout>
      <MainFooter Footer={Footer} isDarkMode={isDarkMode} />
    </>
  );
};

export default Landing;
