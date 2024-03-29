// tailwind.config.js
module.exports = {
  content: ["./static/**/*.html", "./src/**/*.{ts,tsx,js}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        3: "repeat(3, minmax(0, 1fr))",
        10: "repeat(10, minmax(0, 1fr))",
        12: "repeat(12, minmax(0, 1fr))",
        16: "repeat(16, minmax(0, 1fr))",
        20: "repeat(20, minmax(0, 1fr))",
        24: "repeat(24, minmax(0, 1fr))",
      },
      colors: {
        "hover-yellow": "#ac7c24",
      },
      width: {
        "1/10": "10%",
        "2/10": "20%",
        "3/10": "30%",
        "4/10": "40%",
        "5/10": "50%",
        "6/10": "60%",
        "7/10": "70%",
        "8/10": "80%",
        "9/10": "90%",
        "1/24": (1 / 24) * 100 + "%",
        "2/24": (2 / 24) * 100 + "%",
        "3/24": (3 / 24) * 100 + "%",
        "4/24": (4 / 24) * 100 + "%",
        "5/24": (5 / 24) * 100 + "%",
        "6/24": (6 / 24) * 100 + "%",
        "7/24": (7 / 24) * 100 + "%",
        "8/24": (8 / 24) * 100 + "%",
        "9/24": (9 / 24) * 100 + "%",
        "10/24": (10 / 24) * 100 + "%",
        "11/24": (11 / 24) * 100 + "%",
        "12/24": (12 / 24) * 100 + "%",
        "13/24": (13 / 24) * 100 + "%",
        "14/24": (14 / 24) * 100 + "%",
        "15/24": (15 / 24) * 100 + "%",
        "16/24": (16 / 24) * 100 + "%",
        "17/24": (17 / 24) * 100 + "%",
        "18/24": (18 / 24) * 100 + "%",
        "19/24": (19 / 24) * 100 + "%",
        "20/24": (20 / 24) * 100 + "%",
        "21/24": (21 / 24) * 100 + "%",
        "22/24": (22 / 24) * 100 + "%",
        "23/24": (23 / 24) * 100 + "%",
      },
      margin: {
        "21p": "21vw",
        "26p": "26vw",
      },
    },
  },
  variants: {},
  plugins: [],
};
