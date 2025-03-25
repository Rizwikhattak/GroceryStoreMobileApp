/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: { 100: "#ea7173", 700: "#dc3545" },
        secondary: "#4ab7b6",
        light: {
          100: "#ffffff",
        },
        dark: {
          100: "#293041",
          300: "#000000",
        },
        customgray: {
          100: "#c5c5c5",
        },
        customblue: {
          100: "#7d8fab",
          700: "#293041",
        },
      },
    },
  },
  plugins: [],
};
// const secondaryText = "#dc3545";
// const primaryText = "#000000";
// const grayIconColor = "#7d8fab";
// const primaryColor = "#ffffff";
// const secondaryColor = "#ea7173";
// const ternaryColor = "#4ab7b6";
// const customgray = "#c5c5c5";
// const customdarkblue = "#293041";
