import { type ReactNode } from "react";
import { MotionDiv } from "~/components/motion-div";

type Props = {
  children: ReactNode;
};

const RootTemplate = ({ children }: Props) => {
  return (
    <MotionDiv
      className="w-full max-w-7xl"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {children}
    </MotionDiv>
  );
};

export default RootTemplate;
