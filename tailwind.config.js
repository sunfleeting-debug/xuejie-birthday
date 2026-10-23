/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 纸底 —— 偏冷的米白，像宣纸
        paper: "#f4f5f2",
        "paper-soft": "#e9ebe7",
        "paper-cool": "#eef1f0",
        "paper-warm": "#f5f1e8",
        // 墨
        ink: "#191b1d",
        "ink-dim": "#6c7276",
        "ink-soft": "#979c9f",
        line: "rgba(25,27,29,0.10)",
        "line-strong": "rgba(25,27,29,0.20)",
        // 天青 —— 远山与江，主色
        sky: "#3c5a70",
        "sky-soft": "#7d96a7",
        "sky-deep": "#2a4152",
        "sky-pale": "#c7d4dc",
        // 暮金 —— 灯火与匾额
        gold: "#ad7a33",
        "gold-soft": "#d2aa66",
        "gold-pale": "#ecd9b4",
        // 朱砂 —— 只在生日处小面积出现
        cinnabar: "#b5432e",
        "cinnabar-soft": "#d0664e",
      },
      fontFamily: {
        // 大标题：中文宋体（衬线），拉丁用 Georgia
        display: [
          '"Songti SC"',
          '"STSong"',
          '"Noto Serif SC"',
          '"Source Han Serif SC"',
          '"SimSun"',
          "Georgia",
          '"Times New Roman"',
          "serif",
        ],
        sans: [
          "Inter",
          '"Helvetica Neue"',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          "system-ui",
          "sans-serif",
        ],
        mono: [
          '"JetBrains Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
        // 手写感 —— 落款与便签
        hand: ['"Kaiti SC"', '"STKaiti"', '"KaiTi"', '"Songti SC"', "serif"],
      },
      maxWidth: {
        container: "1200px",
      },
      borderRadius: {
        "4xl": "18px",
      },
      letterSpacing: {
        hero: "-0.04em",
        title: "-0.03em",
        subhead: "-0.02em",
      },
      transitionTimingFunction: {
        "bounce-out": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        // 灯焰摇曳
        flicker: {
          "0%, 100%": { transform: "scaleY(1) rotate(-1deg)", opacity: "0.95" },
          "25%": { transform: "scaleY(1.1) rotate(1.6deg)", opacity: "1" },
          "50%": { transform: "scaleY(0.92) rotate(-1.6deg)", opacity: "0.88" },
          "75%": { transform: "scaleY(1.06) rotate(1deg)", opacity: "1" },
        },
        // 灯火本身的呼吸感
        breathe: {
          "0%, 100%": { opacity: "0.85", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.04)" },
        },
        // 火星/余烬向上飘
        floatUp: {
          "0%": { transform: "translateY(0) scale(0.5)", opacity: "0" },
          "18%": { opacity: "1" },
          "100%": { transform: "translateY(-190px) scale(1.1)", opacity: "0" },
        },
      },
      animation: {
        flicker: "flicker 2.4s ease-in-out infinite",
        breathe: "breathe 2.8s ease-in-out infinite",
        "float-up": "floatUp 3.2s ease-out forwards",
      },
    },
  },
  plugins: [],
};
