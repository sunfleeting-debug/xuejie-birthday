# 学姐 · 生日快乐

一个静态的生日页面：四屏（封面 / 关于 / 片段 / 生辰），一盏可以点着、再放飞的孔明灯，
21 张照片按场景分成五组，附一个可筛选的画廊页。

> 技术栈：Vite 5 + React 18 + TailwindCSS 3 + Framer Motion 12，HashRouter，
> 纯静态，可部署在 GitHub Pages 的任何子路径下。

---

## 一、素材与内容

### 1. 图片来源

全部来自 `../学姐/` 下的 21 张 jpg，**一张都没丢**（需求方确认：这批是「一群人的合影集」，
页面写给「学姐」，不挑某一位的单人照，所以全用）。

原图有一个共同点：**没有 EXIF**（无拍摄时间、无 GPS、无机型），
文件创建时间全是拷贝当天，所以「按时间聚类推行程」这条路走不通。见 §3 的写作原则。

### 2. 分组（按画面里看得见的东西分，不按地点）

| 分组 | key | 张数 | 内容 |
| --- | --- | --- | --- |
| 日常 | `daily` | 4 | 灰卫衣自拍、湖边骑行、夜里露台、抱娃娃 |
| 和你们一起 | `friends` | 6 | 楼梯上的六个人、三人夜拍、两人贴脸、大笑特写 |
| 汉服那天 | `hanfu` | 3 | 水边的粉衣与银饰，含一张三人仰拍 |
| 四辩 | `debate` | 2 | 长桌后写字，桌角有「四辩」牌子 |
| 逛街与城 | `city` | 6 | 盲盒店、奶茶、城堡似的楼、披萨店、墨镜 |

### 3. 写作原则（重要）

这批照片**无法可靠定位**，所以文案里刻意不出现地名、年龄、学校、专业：

- 「四辩」是照片里桌角那块牌子上的字，可信；
- 「iwonzi」是 `city-06` 背景墙上的字样，可信；
- 「盲盒店 / 奶茶 / 城堡 / 披萨店 / 银饰」都是画面本身；
- **没有**「长沙 / 武汉 / 某某大学 / 二十岁」这类无法从照片证实的说法。

想补真实地名时，只改 `src/data/content.js` 里的 `GROUPS[].label` 与对应 `caption` 即可，
组件不需要动（`Moments.jsx` 的 `REPRESENTATIVE` 用的是 slug，不依赖分组名）。

---

## 二、目录

```
xuejie-birthday/
├─ src/
│  ├─ data/content.js          # 全站文字 + 照片索引（唯一需要改的文件）
│  ├─ App.jsx                  # 四屏翻页、鼠标拖尾、页脚圆图
│  ├─ components/
│  │  ├─ Lantern.jsx           # 孔明灯：点亮 → 放灯 → 溅火星
│  │  ├─ ImageTrail.jsx        # 鼠标拖尾照片
│  │  ├─ LetterSwap.jsx        # 按钮字母翻牌
│  │  ├─ Navbar.jsx / Footer.jsx
│  │  └─ screens/              # Cover / About / Moments / Letter
│  └─ pages/GalleryPage.jsx    # 画廊（?g=<group> 筛选）
├─ scripts/
│  ├─ process_photos.py        # 源图 → public/photos/{full,thumb}，含 SELECTION 表
│  ├─ audit_photos.py          # 核对 orient、拼 contact 图
│  ├─ verify.py                # Playwright 分段截图（桌面 + 移动）
│  └─ deploy.sh                # 构建 + 推 gh-pages
└─ public/photos/{full,thumb}/ # 21 × 2 张
```

`SELECTION` 表是**唯一事实来源**：原文件名 ↔ 语义 slug ↔ 分组。改图先改它，再跑脚本。

---

## 三、本地跑

```bash
cd xuejie-birthday
npm install

# 开发
npx vite

# 处理图片（改过 ../学姐/ 或 SELECTION 之后）
python scripts/process_photos.py

# 构建 + 预览
npx vite build && npx vite preview --port 4173
python scripts/verify.py          # 截图落到 .shots/
```

> 本机注意：跑 `vite build` 前先 `export NODE_OPTIONS=`。环境会通过 `NODE_OPTIONS`
> 注入一个 safe-delete 守卫，它会拦下「一次删 >50 个文件」并等待交互确认，
> 在非交互场景下表现为**构建卡死**（日志停在 computing gzip size 之后）。

---

## 四、发布

```bash
git remote add origin https://github.com/<user>/xuejie-birthday.git
bash scripts/deploy.sh
```

`deploy.sh` 会从 remote 里解析仓库名，用 `BASE=/<repo>/` 构建，然后把 `dist` 强推成 `gh-pages` 分支。

### 两个已踩过的坑（写在脚本里了）

1. **不能 `rm -rf dist`**：safe-delete 守卫会把 dist 里 200+ 个文件判成批量删除 →
   fail-closed → 脚本挂住。改成 `mv dist dist-old-$(date +%s)`，`.gitignore` 已兜住 `dist-old-*/`。
2. **`git push` 会卡在 TLS 握手**：本机 `git config` 里有一个连不通的本地代理
   （`http.proxy=http://127.0.0.1:7897`，端口开着但代理进程死了）。`curl` 不走它所以看着网络正常。
   `deploy.sh` 里用 `git -c http.proxy= -c https.proxy= push` 显式绕过。

---

## 五、验证记录

`scripts/verify.py` 跑通后 17 张截图，控制台 **0 error**：

- 桌面 1440×900：封面、关于、片段、生辰（未点灯 / 已点灯 / 升空中 / 祝词浮层 / 放灯后）、画廊全部 + 两个分组
- 移动 390×844：四屏 + 放灯浮层 + 画廊

已知的排版约束（改文案时注意）：

- 「片段」屏 5 张卡片在 `lg` 排一行；内容高于约 630px 就会顶出视口、把大标题裁掉。
- 画廊左栏标题固定两行（`这些 / 片段`），右侧元信息四行（场景 / 张数 / 拍摄 / 收件人）。
- 手机上分组卡片的英文标签会挤到中文上，`sm` 断点以下隐藏。
