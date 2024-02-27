"use client";

import { useAnimation, useInView } from "framer-motion";
import { type ReactNode, useEffect, useRef } from "react";
import { MotionDiv } from "~/components/motion-div";

type Props = {
  children: ReactNode;
};
const MotionOnView = ({ children }: Props) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  const variants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 40 },
  };

  useEffect(() => {
    if (isInView)
      void controls.start("visible", {
        elapsed: 0.5,
        delay: 0.5,
      });
  }, [controls, isInView]);
  return (
    <MotionDiv
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={variants}
    >
      {children}
    </MotionDiv>
  );
};

export default MotionOnView;
