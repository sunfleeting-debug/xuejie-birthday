import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LETTER, PROFILE } from "../../data/content.js";
import Lantern from "../Lantern.jsx";

const fade = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Letter() {
  const [wishOpen, setWishOpen] = useState(false);

  return (
    <main className="w-full my-auto flex flex-col items-center relative">
      <div className="w-full max-w-5xl px-5 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-14">
        {/* 左：信 */}
        <div className="flex-1 min-w-0">
          <motion.h1
            variants={fade}
            custom={0}
            initial="hidden"
            animate="show"
            className="font-display italic font-medium leading-[0.95] tracking-hero text-ink"
            style={{ fontSize: "clamp(2rem, 5.2vw, 3.7rem)" }}
          >
            {LETTER.title[0]}
            <span className="text-cinnabar">{LETTER.title[1]}</span>
          </motion.h1>

          <motion.div
            variants={fade}
            custom={1}
            initial="hidden"
            animate="show"
            className="mt-6 md:mt-8 max-w-xl"
          >
            <p className="font-hand text-[17px] text-ink mb-3">
              {LETTER.salutation}
            </p>
            <div className="space-y-3">
              {LETTER.body.map((t, i) => (
                <p
                  key={i}
                  className={`leading-[2] ${
                    i === 0
                      ? "text-[16px] font-medium text-ink"
                      : "text-[13.5px] text-ink/75"
                  }`}
                >
                  {t}
                </p>
              ))}
            </div>
            <p className="font-hand text-[16px] text-ink/80 mt-5 text-right pr-2">
              {LETTER.signature}
            </p>
          </motion.div>
        </div>

        {/* 右：孔明灯 */}
        <motion.aside
          variants={fade}
          custom={2}
          initial="hidden"
          animate="show"
          className="shrink-0 flex flex-col items-center w-full md:w-[340px]"
        >
          <Lantern
            hintIdle={LETTER.hintIdle}
            hintLit={LETTER.hintLit}
            release={LETTER.release}
            bodyText={LETTER.wishTitle}
            onReleased={() => {
              // 让灯先升起来一点，再弹祝词，顺序更像真的在放灯
              window.setTimeout(() => setWishOpen(true), 1500);
            }}
          />
        </motion.aside>
      </div>

      {/* 放灯之后：全屏浮层，不挤压原布局 */}
      <AnimatePresence>
        {wishOpen && (
          <motion.div
            key="wish"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => setWishOpen(false)}
            className="fixed inset-0 z-[68] flex items-center justify-center px-6 bg-sky-deep/20 backdrop-blur-[2px] cursor-pointer"
          >
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md text-center bg-paper/95 border border-gold/25 rounded-[24px] px-8 py-10 shadow-[0_36px_90px_-34px_rgba(25,27,29,0.55)]"
            >
              <p className="font-display text-[30px] md:text-[36px] text-cinnabar tracking-title leading-tight">
                {LETTER.wishTitle}
              </p>
              <p className="mt-2 font-display italic text-[12px] tracking-[0.14em] text-gold">
                「{PROFILE.motto}」
              </p>
              <p className="mt-5 text-[13px] text-ink/70 leading-[2.1] whitespace-pre-line">
                {LETTER.wishBody}
              </p>
              <p className="mt-7 text-[10px] tracking-[0.3em] uppercase text-ink/35 font-mono">
                {PROFILE.sentOn}
              </p>
              <p className="mt-4 text-[10px] tracking-[0.2em] text-ink/30">
                点一下，接着看信
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
