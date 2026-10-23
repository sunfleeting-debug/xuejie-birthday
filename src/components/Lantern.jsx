import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * 可交互的孔明灯 —— 全站的「点题」交互。
 *
 * 交互弧线：
 *   idle（未点）──点一下──▶ lit（灯芯点亮、灯腹透光）──放 灯──▶ released
 *   released 时整盏灯缓缓升起、飘出画面顶端，同时溅起一串上升的光点，
 *   随后由 Letter 屏弹出祝词浮层。
 *
 * 之所以用放灯而不是吹蜡烛：寿星的名字不宜拿来玩谐音，但「放一盏灯许愿」
 * 这件事本身跟生日是对得上的；而且灯升空之后那种「飘到看不见」的画面，
 * 比吹灭蜡烛更适合当整个页面的收尾。（这个组件是从 fuyao 站沿用过来的，
 * 灯腹上的四个字由 bodyText 传入，默认「生日快乐」。）
 */

const EMBER_COLORS = [
  "#ffd790",
  "#ffb347",
  "#e0913a",
  "#fff0cc",
  "#c98a2e",
  "#ffcf7a",
];

/** 纸身（未点亮）与被点亮的两种底面 */
const PAPER = "linear-gradient(180deg,#f8efdc 0%,#f1e2c4 46%,#e7d2aa 100%)";
const PAPER_LIT =
  "radial-gradient(circle at 50% 76%, rgba(255,224,164,0.98) 0%, rgba(255,191,100,0.80) 36%, rgba(255,152,52,0.34) 64%, rgba(255,152,52,0) 100%)";

/** 放灯后从灯底溅起的一串光点（会带着横向漂移一起升上去） */
function Embers({ show }) {
  const sparks = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: 50 + (Math.random() - 0.5) * 40,
        delay: Math.random() * 1300,
        duration: 2800 + Math.random() * 2200,
        size: 3 + Math.random() * 5,
        color: EMBER_COLORS[i % EMBER_COLORS.length],
        drift: (Math.random() - 0.5) * 150,
      })),
    [],
  );

  if (!show) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      {/* 带 --dx 漂移的上升，所以关键字定义在组件里，而不是 tailwind.config */}
      <style>{`
        @keyframes emberRise {
          0%   { transform: translate3d(0, 0, 0) scale(0.4); opacity: 0; }
          12%  { opacity: 0.95; }
          100% { transform: translate3d(var(--dx,0px), -430px, 0) scale(0.8); opacity: 0; }
        }
      `}</style>
      {sparks.map((s) => (
        <span
          key={s.id}
          className="absolute bottom-10 rounded-full"
          style={{
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            background: s.color,
            boxShadow: `0 0 9px ${s.color}`,
            ["--dx"]: `${s.drift}px`,
            animation: `emberRise ${s.duration}ms ease-out ${s.delay}ms forwards`,
          }}
        />
      ))}
    </div>
  );
}

export default function Lantern({
  hintIdle,
  hintLit,
  release = "放 灯",
  bodyText = "生日快乐",
  onReleased,
}) {
  const [phase, setPhase] = useState("idle");
  const lit = phase === "lit";
  const released = phase === "released";

  const handleLight = useCallback(() => {
    if (phase === "idle") setPhase("lit");
  }, [phase]);

  const handleRelease = useCallback(
    (e) => {
      e.stopPropagation();
      if (phase !== "lit") return;
      setPhase("released");
      onReleased?.();
    },
    [phase, onReleased],
  );

  // 键盘可达性：回车 / 空格也能走完这条弧线
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      if (phase === "idle") {
        setPhase("lit");
      } else if (phase === "lit") {
        setPhase("released");
        onReleased?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, onReleased]);

  const hint = phase === "idle" ? hintIdle : phase === "lit" ? hintLit : null;

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* 光点层放在外层，不受灯本身升空位移的影响 */}
      <Embers show={released} />

      <button
        type="button"
        onClick={handleLight}
        disabled={phase !== "idle"}
        aria-label={phase === "idle" ? "点亮孔明灯" : "孔明灯"}
        className={`relative group flex flex-col items-center pt-10 ${
          phase === "idle" ? "cursor-pointer" : "cursor-default"
        }`}
      >
        {/* 灯：放灯后整盏向上飘走 */}
        <motion.div
          initial={false}
          animate={
            released
              ? { y: -720, x: 54, scale: 0.32, rotate: 7, opacity: 0 }
              : { y: 0, x: 0, scale: 1, rotate: 0, opacity: 1 }
          }
          transition={
            released
              ? {
                  duration: 3.8,
                  ease: [0.36, 0.05, 0.86, 0.6],
                  // 先稳稳升起来，快出画时才淡掉
                  opacity: { duration: 1.3, delay: 2.5, ease: "easeIn" },
                }
              : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
          }
          className="relative"
        >
          {/* 挂着灯的那根细绳 */}
          <div className="absolute left-1/2 top-[99%] -translate-x-1/2 w-[1px] h-9 bg-[rgba(25,27,29,0.16)]" />

          {/* 未点亮时轻轻起伏，像还提在手里 */}
          <motion.div
            animate={lit ? { y: [0, -7, 0] } : { y: 0 }}
            transition={
              lit
                ? { duration: 4.6, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.4 }
            }
            className={`relative w-[168px] h-[200px] md:w-[186px] md:h-[222px] rounded-[50%_50%_14%_14%/46%_46%_10%_10%] ${
              lit || released ? "lantern-lit lantern-glow" : ""
            }`}
            style={{ background: PAPER }}
          >
            {/* 透光的灯腹：点亮后从内部亮起来 */}
            <motion.span
              initial={false}
              animate={{ opacity: lit || released ? 1 : 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="pointer-events-none absolute inset-0 rounded-[50%_50%_14%_14%/46%_46%_10%_10%]"
              style={{ background: PAPER_LIT }}
            />

            {/* 竹篾：三道横向的弧 */}
            {[26, 50, 74].map((t) => (
              <span
                key={t}
                className="pointer-events-none absolute inset-x-[6%] h-[10%] rounded-[50%] border-t border-[rgba(120,86,40,0.20)]"
                style={{ top: `${t}%` }}
              />
            ))}

            {/* 拼接的竖缝 */}
            {[30, 70].map((l) => (
              <span
                key={l}
                className="pointer-events-none absolute top-[5%] bottom-[5%] w-[1px] bg-[rgba(120,86,40,0.12)]"
                style={{ left: `${l}%` }}
              />
            ))}

            {/* 灯身上写的四个字：点亮前是淡淡的墨痕，点亮后是朱砂 */}
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span
                className="vertical-text font-display tracking-[0.18em] transition-colors duration-700"
                style={{
                  fontSize: "clamp(20px, 5.4vw, 26px)",
                  color: lit || released ? "#b5432e" : "rgba(25,27,29,0.30)",
                  textShadow:
                    lit || released ? "0 0 14px rgba(255,190,110,0.85)" : "none",
                }}
              >
                {bodyText}
              </span>
            </span>

            {/* 灯芯：一缕向上舔的火苗 */}
            <AnimatePresence>
              {lit && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="pointer-events-none absolute bottom-[9%] left-1/2 -translate-x-1/2 z-20"
                >
                  <span className="block animate-flicker origin-bottom w-[15px] h-[24px] rounded-[50%_50%_50%_50%/64%_64%_36%_36%] bg-[radial-gradient(circle_at_50%_70%,#fff6cf_0%,#ffbe3d_46%,#ff7a18_80%,rgba(255,90,0,0)_100%)]" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 顶部封盖 */}
          <span className="pointer-events-none absolute -top-[6px] left-1/2 -translate-x-1/2 w-[44%] h-[13px] rounded-[50%] bg-[#8a5f26]" />
          <span className="pointer-events-none absolute -top-[3px] left-1/2 -translate-x-1/2 w-[24%] h-[7px] rounded-[50%] bg-[#a9793a]" />

          {/* 底部开口（燃料盘） */}
          <span className="pointer-events-none absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-[78%] h-[17px] rounded-[50%] bg-[radial-gradient(ellipse_at_50%_32%,#6b4a1e_0%,#a9793a_48%,#dcc192_100%)] shadow-[0_8px_16px_-8px_rgba(25,27,29,0.5)] z-20" />
        </motion.div>
      </button>

      {/* 提示 / 放灯按钮 */}
      <div className="h-16 mt-5 flex flex-col items-center justify-start">
        <AnimatePresence mode="wait">
          {phase === "lit" ? (
            <motion.button
              key="release"
              type="button"
              onClick={handleRelease}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-2 rounded-full border border-gold text-gold text-[12px] tracking-[0.2em] hover:bg-gold hover:text-paper transition-colors cursor-pointer"
            >
              {release}
            </motion.button>
          ) : hint ? (
            <motion.p
              key={hint}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[12px] tracking-[0.18em] text-ink/50"
            >
              {hint}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
