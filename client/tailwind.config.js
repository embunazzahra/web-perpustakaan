module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        signika: ["Signika", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        teal: "#5F9EA0",
      },
    },
  },
  variants: {
    display: ["responsive", "dropdown"],
  },
  plugins: [require("tailwindcss-dropdown")],
};
