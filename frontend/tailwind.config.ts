import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Tailwind utilities reference our CSS variables so Tailwind
      // and the token layer stay in sync
      colors: {
        accent:    "var(--color--accent)",
        dark:      "var(--color--dark)",
        "off-white": "var(--color--off-white)",
        grey1:     "var(--color--grey-1)",
        grey2:     "var(--color--grey-2)",
      },
      fontFamily: {
        display: ["var(--font--display)"],
        body:    ["var(--font--body)"],
      },
    },
  },
  plugins: [],
} satisfies Config;
