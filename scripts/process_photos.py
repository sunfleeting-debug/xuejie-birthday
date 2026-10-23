# -*- coding: utf-8 -*-
"""
处理 学姐/ 里的 21 张素材，输出 学姐生日站 用图。

做四件事：
  1. 全部 21 张都用（需求方确认「不用挑，全用」—— 这是一群人的合影集，
     页面写给「学姐」，不强调某一位的单人照）
  2. 缩到长边 1600px（大图）/ 640px（缩略图）+ 压缩
  3. 按场景语义重命名，顺序即画廊顺序
  4. 打印真实宽高比，用来核对 content.js 里的 orient

分组（全部按画面里能看见的东西分，不猜地名）：
  daily   日常      —— 自拍、湖边、夜里、抱娃娃
  friends 和你们一起 —— 楼梯上的六个人、三人夜拍、两人贴脸
  hanfu   汉服那天  —— 水边那一身粉衣与银饰
  debate  四辩      —— 辩论赛长桌后的记录
  city    逛街与城  —— 盲盒店、奶茶、城堡、披萨店、墨镜

复核方式：scripts/audit_photos.py 会拼 contact 图并打印尺寸。
"""
import os
from collections import Counter
from PIL import Image, ImageOps

SRC = r"F:\MyProject\个人网站\学姐"
ROOT = r"F:\MyProject\个人网站\xuejie-birthday"
FULL = os.path.join(ROOT, "public", "photos", "full")
THUMB = os.path.join(ROOT, "public", "photos", "thumb")
os.makedirs(FULL, exist_ok=True)
os.makedirs(THUMB, exist_ok=True)

# (原文件名, 语义名, 分组)
SELECTION = [
    # ---------- 日常 ----------
    ("064d6a22500ddd6531a06bc5a8a22dcd.jpg", "daily-01-hoodie",   "daily"),
    ("52f93cfe686bac984054ebdf6362d432.jpg", "daily-02-lakeside", "daily"),
    ("9fa35cef2eacbed9d1c19b4a9e2e8950.jpg", "daily-03-night",    "daily"),
    ("8c001d257fb270891927dda88230b8cf.jpg", "daily-04-plush",    "daily"),

    # ---------- 和你们一起 ----------
    ("5579c6b55c71e8a854ee69985bde4b32.jpg", "friends-01-stairs",   "friends"),
    ("676ff45f2f03826ff3da4e9ab12e5b6e.jpg", "friends-02-stairs2",  "friends"),
    ("0c03e85c3d70aeb41a83d5fccf876282.jpg", "friends-03-three",    "friends"),
    ("9c64b33fb96cec51d922d38bf036bc13.jpg", "friends-04-two",      "friends"),
    ("9223009eb01166d29d48a9a489bf4a01.jpg", "friends-05-closeup",  "friends"),
    ("7304f720a9b5b08cc1de730017f2ce71.jpg", "friends-06-laugh",    "friends"),

    # ---------- 汉服那天 ----------
    ("dd2060223a04321fff6e76bfe8c75137.jpg", "hanfu-01-river",   "hanfu"),
    ("f648bbfe765b9e95e92b7715788af065.jpg", "hanfu-02-gesture", "hanfu"),
    ("78b8a4b6ba1c8f0414043d82a1133f98.jpg", "hanfu-03-trio",    "hanfu"),

    # ---------- 四辩 ----------
    ("4725a6bdb46ce44a388e2ec8161c79d6.jpg", "debate-01-desk",    "debate"),
    ("c9f431eb7acea993f81f54f930ece2ba.jpg", "debate-02-closeup", "debate"),

    # ---------- 逛街与城 ----------
    ("8133e3135f5275c3b69b64d33170bc0c.jpg", "city-01-jk",     "city"),
    ("be9ba2dcc8cc6bb90abf14324ef18d55.jpg", "city-02-shop",   "city"),
    ("e8c950c47222067872f1524d69941eec.jpg", "city-03-drink",  "city"),
    ("f52129d7743a82f4e504d51036a404f4.jpg", "city-04-castle", "city"),
    ("f227b7428fc5c8e42e1dca8f8938733e.jpg", "city-05-pizza",  "city"),
    ("cff7aa7ccbaebf671aa338f430b3ef14.jpg", "city-06-shades", "city"),
]

# 手工旋转覆盖（单位：度，逆时针为正，等同 PIL Image.rotate 的语义）。
# 这批原图的 EXIF 方向标记全为空，exif_transpose 不起作用；
# 逐张目视核对过，没有需要转正的（两张横图本来就是横着拍的）。
ROTATE = {}

# 剔除掉、不输出到站点的原图（仅记录，便于复核）
EXCLUDED = []

MAX_FULL, MAX_THUMB = 1600, 640

rows, missing = [], []
for fn, slug, group in SELECTION:
    src = os.path.join(SRC, fn)
    if not os.path.exists(src):
        missing.append(fn)
        continue
    im = ImageOps.exif_transpose(Image.open(src))
    if slug in ROTATE:
        im = im.rotate(ROTATE[slug], expand=True)
    if im.mode != "RGB":
        im = im.convert("RGB")
    w, h = im.size

    big = im.copy()
    big.thumbnail((MAX_FULL, MAX_FULL), Image.LANCZOS)
    big.save(os.path.join(FULL, slug + ".jpg"), "JPEG",
             quality=80, optimize=True, progressive=True)

    sm = im.copy()
    sm.thumbnail((MAX_THUMB, MAX_THUMB), Image.LANCZOS)
    sm.save(os.path.join(THUMB, slug + ".jpg"), "JPEG",
            quality=76, optimize=True, progressive=True)

    # 真实朝向：以处理后的像素为准，content.js 的 orient 必须与这里一致
    rows.append((slug, group, "l" if w > h else "p", f"{w}x{h}",
                 os.path.getsize(os.path.join(FULL, slug + ".jpg")) / 1024,
                 os.path.getsize(os.path.join(THUMB, slug + ".jpg")) / 1024))

print(f"{'slug':<22}{'grp':<9}{'ori':<5}{'px':>11}{'fullKB':>8}{'thumbKB':>9}")
for r in rows:
    print(f"{r[0]:<22}{r[1]:<9}{r[2]:<5}{r[3]:>11}{r[4]:>8.0f}{r[5]:>9.0f}")

print()
print("分组统计:", dict(Counter(r[1] for r in rows)))
print(f"输出 {len(rows)} 张，大图共 {sum(r[4] for r in rows)/1024:.2f} MB")
if missing:
    print("!! 缺失文件:", missing)
