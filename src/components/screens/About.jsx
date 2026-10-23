import { motion } from "framer-motion";
import { ABOUT, PHOTOS, fullSrc } from "../../data/content.js";

// 关于屏的圆图：汉服那张，脸在正中，银饰垂到肩头，适合圆形裁切
const portrait = PHOTOS.find((p) => p.slug === "hanfu-01-river");

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function About() {
  return (
    <main className="w-full my-auto flex flex-col items-center relative">
      <div className="w-full max-w-5xl px-5 flex flex-col md:flex-row md:items-start gap-10 md:gap-14">
        {/* 左：标题 + 正文 */}
        <div className="flex-1">
          <motion.h1
            variants={fade}
            custom={0}
            initial="hidden"
            animate="show"
            className="font-display italic font-medium leading-[0.9] tracking-hero text-ink"
            style={{ fontSize: "clamp(2.4rem, 6.6vw, 4.8rem)" }}
          >
            {ABOUT.title[0]}
            <br />
            <span className="pl-6 md:pl-12 text-sky">{ABOUT.title[1]}</span>
          </motion.h1>

          <motion.div
            variants={fade}
            custom={1}
            initial="hidden"
            animate="show"
            className="mt-7 md:mt-9 space-y-3 max-w-xl"
          >
            {ABOUT.paragraphs.map((t, i) => (
              <p
                key={i}
                className={`leading-[1.95] ${
                  i === 0
                    ? "text-[15px] text-ink font-medium"
                    : "text-[13px] text-ink/70"
                }`}
              >
                {t}
              </p>
            ))}
          </motion.div>
        </div>

        {/* 右：圆图 + 词条 */}
        <motion.aside
          variants={fade}
          custom={2}
          initial="hidden"
          animate="show"
          className="shrink-0 flex flex-col items-center md:items-end gap-7"
        >
          <div className="relative w-[180px] h-[180px] md:w-[216px] md:h-[216px] rounded-full overflow-hidden border-4 border-white/70 shadow-[0_20px_50px_-24px_rgba(25,27,29,0.55)]">
            <img
              src={fullSrc(portrait)}
              alt="学姐"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <dl className="grid grid-cols-2 gap-x-9 gap-y-3 text-left">
            {ABOUT.facts.map((f) => (
              <div key={f.k}>
                <dt className="text-[10px] tracking-[0.2em] uppercase text-ink/40">
                  {f.k}
                </dt>
                <dd className="text-[13px] text-ink/85 mt-1">{f.v}</dd>
              </div>
            ))}
          </dl>

          {/* 一点小装饰：三道风痕 —— 像灯升上去之后留下的那几道线 */}
          <svg
            width="132"
            height="34"
            viewBox="0 0 132 34"
            fill="none"
            className="text-sky/45"
            aria-hidden
          >
            <path
              d="M2 9h76c9 0 9-7 17-7 5 0 8 3 8 7s-3 7-8 7h-15"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M2 20h58c8 0 8 7 15 7 5 0 8-3 8-7"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M14 30h42"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>
        </motion.aside>
      </div>

      <motion.p
        variants={fade}
        custom={3}
        initial="hidden"
        animate="show"
        className="mt-10 md:mt-12 text-[10px] tracking-[0.3em] uppercase text-ink/35 font-mono"
      >
        {ABOUT.en}
      </motion.p>
    </main>
  );
}
