import type { Config } from "tailwindcss";
import sharedPreset from "../../design/tailwind.preset";

const config: Config = {
  presets: [sharedPreset],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [],
};

export default config;
