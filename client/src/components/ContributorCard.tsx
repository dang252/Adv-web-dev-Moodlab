import { Avatar } from "antd";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { RootState } from "../redux/store";

import { FaFacebook, FaGithub } from "react-icons/fa";

interface PropType {
  name: string;
  src: string;
  role: string;
  fb: string;
  github: string;
}

const ContributorCard = (props: PropType) => {
  const { name, src, role, fb, github } = props;

  const isDarkMode = useSelector<RootState, boolean>(
    (state) => state.users.isDarkMode
  );

  return (
    <div className="flex flex-col items-center gap-10">
      <Avatar
        className="hover:cursor-pointer"
        style={{ verticalAlign: "middle" }}
        src={src}
        size={200}
        gap={5}
      >
        {name}
      </Avatar>
      <div className="flex flex-col items-center gap-3">
        <p className="text-xl font-semibold">{name}</p>
        <p className="text-md text-gray-500">{role}</p>
      </div>
      <div className="flex gap-5 text-4xl">
        <Link to={fb} className={`${isDarkMode ? "text-white" : "text-black"}`}>
          <FaFacebook className="hover:text-blue-500 hover:cursor-pointer" />
        </Link>
        <Link
          to={github}
          className={`${isDarkMode ? "text-white" : "text-black"}`}
        >
          <FaGithub className="hover:text-blue-500 hover:cursor-pointer" />
        </Link>
      </div>
    </div>
  );
};

export default ContributorCard;
