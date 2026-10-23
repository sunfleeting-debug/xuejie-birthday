# -*- coding: utf-8 -*-
"""
核验已处理照片的：
  1) 真实朝向（宽高比）—— 对照 content.js 里手写的 orient，找出不一致的；
  2) 生成带 slug 标签的分组拼图（PNG），用于人工通读选片与分组的正确性。

用法：<python> scripts/audit_photos.py
产出：.shots/contact-<group>.png  + 控制台打印的 orient 核对表
"""
import json
import os
import pathlib
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
FULL = ROOT / "public" / "photos" / "full"
THUMB = ROOT / "public" / "photos" / "thumb"
OUT = ROOT / ".shots"
OUT.mkdir(exist_ok=True)

GROUPS = ["daily", "friends", "hanfu", "debate", "city"]

# ---- 1. 读出真实尺寸 ----
sizes = {}
for p in sorted(FULL.glob("*.jpg")):
    with Image.open(p) as im:
        sizes[p.stem] = im.size

print("=== 尺寸 / 朝向 ===", flush=True)
for slug, (w, h) in sizes.items():
    print(f"  {slug:22s} {w:5d}x{h:<5d} ratio={w / h:.3f} -> {'l (横)' if w >= h else 'p (竖)'}", flush=True)

print(f"\n共 {len(sizes)} 张", flush=True)

# 顺便验证 thumb 与 full 数量一一对应
th = {p.stem for p in THUMB.glob("*.jpg")}
fu = set(sizes)
print("thumb 缺:", sorted(fu - th) or "无", flush=True)
print("thumb 多:", sorted(th - fu) or "无", flush=True)

# ---- 2. 分组拼图 ----
try:
    FONT = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", 13)
except Exception:
    FONT = ImageFont.load_default()

CELL = 300
PAD = 8
LABEL_H = 20
COLS = 4

for g in GROUPS:
    files = sorted(FULL.glob(f"{g}-*.jpg"))
    if not files:
        continue
    rows = (len(files) + COLS - 1) // COLS
    sheet = Image.new("RGB", (COLS * (CELL + PAD) + PAD, rows * (CELL + PAD + LABEL_H) + PAD), "#f4f5f2")
    d = ImageDraw.Draw(sheet)
    for i, f in enumerate(files):
        r, c = divmod(i, COLS)
        x = PAD + c * (CELL + PAD)
        y = PAD + r * (CELL + PAD + LABEL_H)
        with Image.open(f) as im:
            im = im.convert("RGB")
            im.thumbnail((CELL, CELL))
            sheet.paste(im, (x + (CELL - im.width) // 2, y + (CELL - im.height) // 2))
        d.text((x, y + CELL + 3), f.stem, fill="#191b1d", font=FONT)
    out = OUT / f"contact-{g}.png"
    sheet.save(out)
    print(f"  -> {out.name}  ({len(files)} 张)", flush=True)

# 也把尺寸导出，方便和 content.js 比对
(OUT / "photo-sizes.json").write_text(
    json.dumps({k: list(v) for k, v in sizes.items()}, ensure_ascii=False, indent=1), encoding="utf-8"
)
print("  -> photo-sizes.json", flush=True)
sys.stdout.flush()
