import { AnimatePresence, motion } from "framer-motion";

/** 圆盘形的上一页 / 下一页 */
function PageNav({ current, total, onPrev, onNext }) {
  return (
    <div className="relative w-32 h-32 border border-ink/25 rounded-full flex items-center justify-center p-4">
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute w-[120%] h-[1px] bg-ink/20 rotate-[-45deg]" />
        <button
          onClick={onPrev}
          aria-label="上一屏"
          className="absolute left-1 text-xs text-ink/60 cursor-pointer hover:text-ink transition-colors"
        >
          ←
        </button>
        <div className="text-4xl font-light tracking-tighter flex items-center justify-center z-10">
          <AnimatePresence mode="wait">
            <motion.span
              key={current}
              className="absolute top-0 left-3 font-mono"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {String(current).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.span
              key={total}
              className="absolute bottom-0 right-3 font-mono text-ink/40"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {String(total).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
        </div>
        <button
          onClick={onNext}
          aria-label="下一屏"
          className="absolute right-1 text-xs text-ink/60 cursor-pointer hover:text-ink transition-colors"
        >
          →
        </button>
      </div>
    </div>
  );
}

export default function Footer({ current, total, onPrev, onNext, image }) {
  return (
    <footer className="absolute bottom-0 left-0 right-0 w-full flex flex-col md:flex-row justify-between items-end gap-8 p-6 md:p-12 md:py-7 pointer-events-auto z-40">
      <PageNav current={current} total={total} onPrev={onPrev} onNext={onNext} />

      <div className="hidden md:flex flex-col space-y-4 md:mb-4 justify-center items-center">
        <span className="text-[10px] italic text-ink/45 tracking-[0.35em] vertical-text">
          滚 动
        </span>
        <div className="w-[1px] h-16 bg-ink/25" />
      </div>

      <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden flex items-center justify-center shadow-lg border-4 border-white/60 shrink-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={image}
            src={image}
            alt="随手一张"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>
    </footer>
  );
}
