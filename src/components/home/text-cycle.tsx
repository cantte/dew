"use client";

import { AnimatePresence, motion } from "framer-motion";
import { startTransition, useEffect, useState } from "react";

const texts = ["ventas", "inventarios", "productos"];
const variants = {
  enter: (_: unknown) => {
    return {
      y: -20,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    y: 0,
    opacity: 1,
  },
  exit: (_: unknown) => {
    return {
      zIndex: 0,
      opacity: 0,
    };
  },
};

const TextCycle = () => {
  const [index, setIndex] = useState(0);

  // Update the index every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      startTransition(() => {
        setIndex((prevIndex) => {
          return (prevIndex + 1) % texts.length;
        });
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      <motion.span
        className="absolute ml-3 text-primary-text"
        variants={variants}
        key={index}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          y: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.5 },
        }}
      >
        {texts[index]}
      </motion.span>
    </AnimatePresence>
  );
};

export default TextCycle;
