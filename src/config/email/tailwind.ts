import type { TailwindConfig } from "@react-email/components";

const tailwindConfig: TailwindConfig = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(275 86% 36%)",
          foreground: "hsl(60 100% 99%)",
          text: "hsl(275 86% 36%)",
        },
      },
    },
  },
};

export default tailwindConfig;
