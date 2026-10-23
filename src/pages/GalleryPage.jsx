import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar.jsx";
import { LetterSwapPingPong } from "../components/LetterSwap.jsx";
import {
  GROUPS,
  PHOTOS,
  fullSrc,
  thumbSrc,
  photosByGroup,
} from "../data/content.js";

const FILTERS = [{ key: "all", label: "全部", en: "All" }, ...GROUPS];

export default function GalleryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get("g") || "all";
  const [pct, setPct] = useState(0);
  const scrollRef = useRef(null);

  const list = useMemo(() => photosByGroup(active), [active]);
  const activeGroup = GROUPS.find((g) => g.key === active);

  // 切分组时回到顶部
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setPct(0);
  }, [active]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setPct(max > 0 ? Math.round((el.scrollTop / max) * 100) : 0);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [list.length]);

  return (
    <div className="w-full h-screen relative flex flex-col p-4 md:px-10 md:pt-16 md:pb-6 select-none overflow-hidden">
      <Navbar />

      <main className="w-full flex-1 flex flex-col md:flex-row justify-between items-stretch my-4 md:my-6 relative min-h-0">
        {/* 左：标题 / 计数 / 返回 */}
        <div className="w-full md:w-[26%] flex flex-col justify-between py-2 z-20 shrink-0">
          <div className="mt-12 md:mt-4">
            <h1
              className="font-display italic text-[2.6rem] md:text-[3.4rem] font-medium leading-[0.88] text-ink"
              style={{ letterSpacing: "-0.05em" }}
            >
              这些
              <br />
              片段
            </h1>
            <p className="text-[11.5px] text-ink/55 max-w-[230px] leading-relaxed mt-5">
              {activeGroup
                ? activeGroup.note
                : `${PHOTOS.length} 张随手拍。没有一张是摆好了等的。`}
            </p>

            {/* 分组筛选 */}
            <div className="flex flex-wrap gap-2 mt-6">
              {FILTERS.map((f) => {
                const on = f.key === active;
                const n =
                  f.key === "all"
                    ? PHOTOS.length
                    : PHOTOS.filter((p) => p.group === f.key).length;
                return (
                  <button
                    key={f.key}
                    onClick={() =>
                      f.key === "all"
                        ? setSearchParams({}, { replace: true })
                        : setSearchParams({ g: f.key }, { replace: true })
                    }
                    className={`px-3 py-1 rounded-full border text-[11px] tracking-wider transition-colors cursor-pointer ${
                      on
                        ? "bg-ink text-paper border-ink"
                        : "border-ink/25 text-ink/65 hover:border-ink/60"
                    }`}
                  >
                    {f.label}
                    <span className="ml-1.5 font-mono opacity-55">{n}</span>
                  </button>
                );
              })}
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-5 border border-ink rounded-full px-4 py-1.5 text-[11px] font-medium tracking-[0.18em] mt-7 hover:bg-ink hover:text-paper transition-colors"
            >
              <LetterSwapPingPong
                label="回到封面"
                className="text-[11px] font-medium tracking-[0.18em]"
              />
              <span aria-hidden>←</span>
            </Link>
          </div>

          {/* 滚动进度圆盘 */}
          <div className="hidden md:flex relative w-32 h-32 border border-ink/20 rounded-full items-center justify-center mt-6">
            <span className="text-3xl font-light tracking-tighter font-mono">
              {pct}%
            </span>
            <svg
              className="absolute inset-0 -rotate-90"
              viewBox="0 0 128 128"
              aria-hidden
            >
              <circle
                cx="64"
                cy="64"
                r="62"
                fill="none"
                stroke="#3c5a70"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 62}
                strokeDashoffset={2 * Math.PI * 62 * (1 - pct / 100)}
                style={{ transition: "stroke-dashoffset 120ms linear" }}
              />
            </svg>
          </div>
        </div>

        {/* 中：照片流 */}
        <div
          ref={scrollRef}
          className="w-full md:w-[46%] flex-1 min-h-0 md:h-full md:flex-none overflow-y-auto no-scrollbar py-2 px-1 z-10"
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              {list.map((p, i) => (
                <figure key={p.slug} className="group">
                  <div
                    className="w-full rounded-[20px] overflow-hidden bg-paper-soft shadow-[0_18px_44px_-30px_rgba(25,27,29,0.6)]"
                    style={{ aspectRatio: p.orient === "p" ? "3 / 4" : "4 / 3" }}
                  >
                    <img
                      src={i < 3 ? fullSrc(p) : thumbSrc(p)}
                      alt={p.caption}
                      loading={i < 2 ? "eager" : "lazy"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 flex items-start gap-3">
                    <span className="font-mono text-[10px] text-ink/35 pt-1 shrink-0">
                      {String(PHOTOS.indexOf(p) + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[12.5px] text-ink/70 leading-relaxed">
                      {p.caption}
                    </span>
                  </figcaption>
                </figure>
              ))}

              <div className="pt-2 pb-10 text-center">
                <p className="text-[10px] tracking-[0.3em] uppercase text-ink/35 font-mono">
                  — 到底了 —
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 右：元信息 */}
        <div className="hidden md:flex w-[24%] flex-col justify-between items-end py-2 z-20 shrink-0">
          <div className="text-right mt-4">
            <div className="text-4xl font-light tracking-tighter text-ink font-mono">
              {String(list.length).padStart(2, "0")}
              <span className="text-ink/25 text-2xl mx-1">/</span>
              <span className="text-ink/35">{PHOTOS.length}</span>
            </div>

            <div className="mt-8 space-y-4 text-[10px] tracking-[0.14em] uppercase text-left inline-block">
              <div>
                <p className="text-ink/35">场景</p>
                <p className="text-ink/80 font-medium mt-0.5">
                  日常 · 合影 · 汉服 · 四辩 · 逛街
                </p>
              </div>
              <div>
                <p className="text-ink/35">张数</p>
                <p className="text-ink/80 font-medium mt-0.5">
                  {PHOTOS.length} 张
                </p>
              </div>
              <div>
                <p className="text-ink/35">拍摄</p>
                <p className="text-ink/80 font-medium mt-0.5">随手</p>
              </div>
              <div>
                <p className="text-ink/35">收件人</p>
                <p className="text-ink/80 font-medium mt-0.5">学姐</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
