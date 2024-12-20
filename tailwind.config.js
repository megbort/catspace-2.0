/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    boxShadow: {
      card: "0px 4px 12px 0px rgba(0, 0, 0, 0.15)",
    },
    extend: {
      colors: {
        "catspace-orange": "#eb9477",
        "catspace-dark-orange": "#C67E66",
        "catspace-beige": "#efe2d9",
        "catspace-dark-beige": "#baafa8",
        "catspace-black": "#0D0D0D",
        "catspace-white": "#fefdf8",
        "catspace-grey": "#e8e8e8",
        "catspace-brown": "#86736d",
      },
    },
  },
  plugins: [],
};
