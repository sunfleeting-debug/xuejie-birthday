import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { ImageTrail } from "./components/ImageTrail.jsx";
import Cover from "./components/screens/Cover.jsx";
import About from "./components/screens/About.jsx";
import Moments from "./components/screens/Moments.jsx";
import Letter from "./components/screens/Letter.jsx";
import { PHOTOS, thumbSrc, fullSrc, PROFILE } from "./data/content.js";

const SCREENS = [Cover, About, Moments, Letter];

// 拖尾用的照片（缩略图，够小够快；方形裁切，优先挑有脸、有人的）
const TRAIL = [
  "daily-01-hoodie",
  "hanfu-01-river",
  "city-01-jk",
  "friends-01-stairs",
  "friends-03-three",
  "city-04-castle",
  "daily-03-night",
  "hanfu-03-trio",
].map((s) => PHOTOS.find((p) => p.slug === s));

// 页脚圆图轮换（圆形裁切，同样优先人像/构图居中的）
const FOOTER_IMG = [
  "hanfu-01-river",
  "friends-01-stairs",
  "city-01-jk",
  "daily-02-lakeside",
].map((s) => PHOTOS.find((p) => p.slug === s));

const TRANSITION = 0.8;
const WHEEL_THRESHOLD = 90;
const WHEEL_COOLDOWN = 620;

const pageVariants = {
  initial: (dir) => ({ opacity: 0, y: dir >= 0 ? 46 : -46 }),
  animate: { opacity: 1, y: 0 },
  exit: (dir) => ({ opacity: 0, y: dir >= 0 ? -46 : 46 }),
};

export default function App() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = SCREENS.length;

  const lockRef = useRef(false);
  const lastWheelRef = useRef(0);
  const accRef = useRef(0);
  const touchYRef = useRef(null);

  // 桌面端才启用「滚轮整屏翻页」，小屏退化成普通滚动
  const [paged, setPaged] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const apply = () => setPaged(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const go = useCallback(
    (delta) => {
      if (lockRef.current) return;
      lockRef.current = true;
      setDirection(delta);
      setPage((p) => (p + delta + total) % total);
      window.setTimeout(() => {
        lockRef.current = false;
      }, TRANSITION * 1000);
    },
    [total],
  );

  // 翻页手势
  useEffect(() => {
    if (!paged) return;

    const onWheel = (e) => {
      const now = Date.now();
      if (lockRef.current || now - lastWheelRef.current < WHEEL_COOLDOWN) return;
      accRef.current += e.deltaY;
      if (accRef.current > WHEEL_THRESHOLD) {
        accRef.current = 0;
        lastWheelRef.current = now;
        go(1);
      } else if (accRef.current < -WHEEL_THRESHOLD) {
        accRef.current = 0;
        lastWheelRef.current = now;
        go(-1);
      }
    };

    const onKey = (e) => {
      if (["ArrowDown", "PageDown"].includes(e.key)) go(1);
      if (["ArrowUp", "PageUp"].includes(e.key)) go(-1);
    };

    const onTouchStart = (e) => {
      touchYRef.current = e.touches[0]?.clientY ?? null;
    };
    const onTouchEnd = (e) => {
      if (touchYRef.current == null) return;
      const endY = e.changedTouches[0]?.clientY ?? touchYRef.current;
      const dy = touchYRef.current - endY;
      if (Math.abs(dy) > 55) go(dy > 0 ? 1 : -1);
      touchYRef.current = null;
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [go, paged]);

  const Current = SCREENS[page];

  /* ---------------- 移动端：普通纵向滚动 ---------------- */
  if (!paged) {
    return (
      <div className="relative w-full min-h-screen">
        <div className="grain-overlay" />
        <Navbar />
        {SCREENS.map((S, i) => (
          <section
            key={i}
            className="min-h-screen w-full flex items-center justify-center px-1 py-28"
          >
            <S />
          </section>
        ))}
        {/* 小屏不做绝对定位的翻页控件，改成一段静态落款 */}
        <div className="w-full flex flex-col items-center gap-4 pb-14 pt-2">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/70 shadow-lg">
            <img
              src={fullSrc(FOOTER_IMG[0])}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-ink/35 font-mono">
            {PROFILE.sentOn}
          </p>
          <p className="font-hand text-[15px] text-ink/60">
            {PROFILE.name} · 生日快乐
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- 桌面端：整屏翻页 ---------------- */
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="grain-overlay" />

      {/* 鼠标拖尾 */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        <ImageTrail
          rotationRange={20}
          interval={85}
          animationSequence={[
            [{ scale: 1.3 }, { duration: 0.15, ease: "circOut" }],
            [{ scale: 0, opacity: 0 }, { duration: 0.6, ease: "circIn" }],
          ]}
        >
          {TRAIL.map((p) => (
            <div
              key={p.slug}
              className="w-[124px] h-[124px] overflow-hidden rounded-[10px] shadow-[0_10px_30px_-10px_rgba(25,27,29,0.6)] border-2 border-white/60"
            >
              <img
                src={thumbSrc(p)}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </ImageTrail>
      </div>

      <Navbar />

      <main className="absolute inset-0 flex items-center justify-center px-4 pt-24 pb-44">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={page}
            custom={direction}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: TRANSITION, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            <Current />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer
        current={page + 1}
        total={total}
        onPrev={() => go(-1)}
        onNext={() => go(1)}
        image={fullSrc(FOOTER_IMG[page % FOOTER_IMG.length])}
      />
    </div>
  );
}
