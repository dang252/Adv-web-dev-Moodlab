import { Reveal } from "react-awesome-reveal";
import { keyframes } from "@emotion/react";

const customAnimation = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 60px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

const CustomeFadeAnimate = ({ children }: any) => {
  return (
    <Reveal triggerOnce keyframes={customAnimation}>
      {children}
    </Reveal>
  );
};

export default CustomeFadeAnimate;
