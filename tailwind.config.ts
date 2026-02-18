import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-blue": "#5172E8",
        "brand-light-blue": "#DCE6FF",
        "brand-gold": "#EBB85E",
        "input-grey": "#D9D9D9",
        "link-blue": "#4A70E2",
      },
      borderRadius: {
        "auth-card": "15px",
        "auth-input": "8px",
      },
      backgroundImage: {
        "auth-gradient": "linear-gradient(to bottom, #5172E8 0%, #DCE6FF 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
