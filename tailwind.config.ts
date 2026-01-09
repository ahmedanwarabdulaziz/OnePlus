import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0f1b4b",
          dark: "#0a1335",
        },
        secondary: {
          DEFAULT: "#701621",
          dark: "#4d0f17",
        },
      },
    },
  },
  plugins: [],
};
export default config;
