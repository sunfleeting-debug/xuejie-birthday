/**
 * 全站内容与素材索引。
 * 想改文字、换照片顺序，只改这个文件就够了。
 *
 * ⚠️ 这一版的写作原则：**只写照片里看得见的东西**。
 *   - 没有地名：这批图没有 EXIF、没有 GPS，也不确定在哪座城市拍的，
 *     所以一组都不按「地点」命名，按「场景」命名（日常 / 合影 / 汉服 / 四辩 / 逛街）。
 *   - 没有年龄、学校、专业：需求方没有提供，写错比不写更糟。
 *   - 「四辩」是照片里桌角那块牌子上的字；「iwonzi」是背景墙上的字样；
 *     「盲盒店 / 奶茶 / 城堡 / 披萨店」都是画面本身。
 * ⚠️ orient 字段是实测宽高比（scripts/process_photos.py 的输出），改图后请重跑再回来核对。
 *
 * 需求方确认：这 21 张是「一群人的合影集」，页面写给「学姐」，不挑某一位的单人照，
 * 所以全部 21 张都用上了。
 */

const BASE = import.meta.env.BASE_URL || "/";

/** 拼接带 base 前缀的资源路径，保证部署到 GitHub Pages 子路径也能取到图 */
export const asset = (p) =>
  `${BASE.replace(/\/$/, "")}/${String(p).replace(/^\//, "")}`;

export const PROFILE = {
  name: "学姐",
  short: "学姐",
  birthday: "10.23", // 只写月日——年份没有依据，不编
  sentOn: "2026.10.23", // 这份礼物送出的时间
  motto: "岁月不居，时节如流",
  mottoFrom: "孔融《论盛孝章书》",
};

/* ------------------------------------------------------------------ */
/* 照片                                                                */
/* ------------------------------------------------------------------ */

/** 分组元信息：数组顺序即画廊与预览的展示顺序 */
export const GROUPS = [
  {
    key: "daily",
    label: "日常",
    en: "Daily",
    note: "自拍、湖边、夜里的一盏灯。没摆拍的那几张，最好看。",
  },
  {
    key: "friends",
    label: "和你们一起",
    en: "Together",
    note: "一段楼梯能挤下六个人；夜里三颗脑袋凑在同一个镜头前。",
  },
  {
    key: "hanfu",
    label: "汉服那天",
    en: "Hanfu",
    note: "粉色的衣裳、垂到肩头的银饰，和一片被树叶筛碎的光。",
  },
  {
    key: "debate",
    label: "四辩",
    en: "The Fourth",
    note: "长桌、纸笔，桌角立着一块写着「四辩」的牌子。",
  },
  {
    key: "city",
    label: "逛街与城",
    en: "City Walk",
    note: "盲盒店、奶茶、城堡似的楼，和一副黑墨镜。",
  },
];

/**
 * orient: "p" 竖构图 / "l" 横构图 —— 画廊按不同比例排版（实测值，勿凭印象改）
 */
export const PHOTOS = [
  // ---------- 日常 ----------
  { slug: "daily-01-hoodie", group: "daily", orient: "p", hero: true,
    caption: "镜头凑得太近，手一抬就把顶上的光挡掉一半。头发是随手扎的，口红倒是认真涂了。" },
  { slug: "daily-02-lakeside", group: "daily", orient: "l",
    caption: "湖边的风把帽檐往上顶。身后一辆接一辆的自行车过去，白栏杆亮得晃眼。" },
  { slug: "daily-03-night", group: "daily", orient: "p",
    caption: "夜里坐在露台的高脚椅上比了个耶，灯从背后打过来——眼睛笑没了。" },
  { slug: "daily-04-plush", group: "daily", orient: "p",
    caption: "怀里抱着一只软乎乎的娃娃，刘海压到眼睛，认真得有点凶。" },

  // ---------- 和你们一起 ----------
  { slug: "friends-01-stairs", group: "friends", orient: "p", hero: true,
    caption: "六个人挤在一段楼梯上，从最高一级排到最下面一级，谁也不肯站直。" },
  { slug: "friends-02-stairs2", group: "friends", orient: "p",
    caption: "同一段楼梯。这回有人把手伸到镜头前面，整张照片都歪了——但笑得更真。" },
  { slug: "friends-03-three", group: "friends", orient: "l",
    caption: "夜里三个人，头顶上两只手比出歪歪扭扭的兔耳朵。" },
  { slug: "friends-04-two", group: "friends", orient: "p",
    caption: "靠在一起的那张。一个笑得收，一个笑得开。" },
  { slug: "friends-05-closeup", group: "friends", orient: "p",
    caption: "镜头贴到脸上。指甲上的亮片，比眼睛还亮。" },
  { slug: "friends-06-laugh", group: "friends", orient: "p",
    caption: "笑得最开的一张，牙齿全露出来。谁也没在乎好不好看。" },

  // ---------- 汉服那天 ----------
  { slug: "hanfu-01-river", group: "hanfu", orient: "p", hero: true,
    caption: "水边，一身粉色的衣裳，银饰垂到肩头。手指点在脸侧，表情很稳。" },
  { slug: "hanfu-02-gesture", group: "hanfu", orient: "p",
    caption: "同一身衣裳，换了个手势——像在跟谁打招呼，又像要接住什么。" },
  { slug: "hanfu-03-trio", group: "hanfu", orient: "p",
    caption: "三个人躺在树底下仰拍。树叶把光筛成一小块一小块，落了一脸。" },

  // ---------- 四辩 ----------
  { slug: "debate-01-desk", group: "debate", orient: "p",
    caption: "长桌后面，桌角立着一块「四辩」的牌子。笔尖停在纸上，没抬头。" },
  { slug: "debate-02-closeup", group: "debate", orient: "p",
    caption: "换了个机位。同一场比赛，同一支笔，纸上全是刚才记下来的字。" },

  // ---------- 逛街与城 ----------
  { slug: "city-01-jk", group: "city", orient: "p", hero: true,
    caption: "盲盒店里，两根食指戳在脸上。柜台上一排小摆件，全都看着镜头。" },
  { slug: "city-02-shop", group: "city", orient: "p",
    caption: "同一家店，两个人挤在红蓝墙前面。有人贴了一颗爱心，把脸挡住了。" },
  { slug: "city-03-drink", group: "city", orient: "p",
    caption: "一只手举着奶茶，另一只手还拎着刚买的袋子。背后全是软乎乎的毛绒玩具。" },
  { slug: "city-04-castle", group: "city", orient: "p",
    caption: "城堡一样的楼、红色的栏杆、廊下挂着的灯笼。那天天是灰的，反而好看。" },
  { slug: "city-05-pizza", group: "city", orient: "p",
    caption: "披萨店的窗边，玻璃外面是傍晚的树。头发垂下来，挡住半边脸。" },
  { slug: "city-06-shades", group: "city", orient: "p",
    caption: "白针织、黑墨镜，站在一条走廊里。背后墙上的字样是 iwonzi。" },
];

export const fullSrc = (photo) => asset(`photos/full/${photo.slug}.jpg`);
export const thumbSrc = (photo) => asset(`photos/thumb/${photo.slug}.jpg`);

export const photosByGroup = (key) =>
  key === "all" ? PHOTOS : PHOTOS.filter((p) => p.group === key);

/** 最能代表本人的几张——拖尾、页脚圆图、预览卡的候选池 */
export const HERO_PHOTOS = PHOTOS.filter((p) => p.hero);

/* ------------------------------------------------------------------ */
/* 各屏文案                                                            */
/* ------------------------------------------------------------------ */

export const SCREENS = [
  { key: "cover", label: "封面", en: "Cover" },
  { key: "about", label: "关于", en: "About" },
  { key: "moments", label: "片段", en: "Frames" },
  { key: "letter", label: "生辰", en: "Birthday" },
];

/** 第二屏：关于 */
export const ABOUT = {
  title: ["关于", "你"],
  en: "About You",
  index: "01",
  paragraphs: [
    "认识你有一阵子了。把这二十一张翻完才发现，你几乎没有一张是正正经经站好拍的。",
    "要么笑到失控，要么就被人挤在台阶最中间那一级。",
    "辩论赛那天你坐在四辩的位置上，笔一直没停；换一身汉服，你又能安安静静站在水边，让银饰垂到肩头。",
    "逛盲盒店会伸两根手指戳脸，抱着娃娃的时候认真得有点凶——这些大概都不是「学姐」两个字能装下的。",
    "所以这个页面不写你是什么样的人，只把拍到的这些摆出来。你自己看。",
    "今天生日。愿你今年少一点需要端着的时候。",
  ],
  facts: [
    { k: "生日", v: "十月二十三" },
    { k: "这些照片", v: "21 张" },
    { k: "常见动作", v: "比耶 · 戳脸" },
    { k: "最常出现", v: "人群中间" },
  ],
};

/** 第三屏：这些片段 */
export const MOMENTS = {
  title: ["这些", "片段"],
  en: "Twenty-One Frames",
  index: "02",
  lead: "二十一张，分成五组：日常、和你们一起、汉服那天、四辩、逛街与城。没有一张是摆好了等的。",
};

/** 第四屏：生辰 */
export const LETTER = {
  title: ["写给", "你"],
  en: "To You",
  index: "03",
  salutation: "学姐：",
  body: [
    "今天是你生日。这个页面做得有点笨——没有蛋糕，没有音乐，只有一堆你的照片和一盏能点着的灯。",
    "照片是从各处凑来的。凑的时候才发现，你很少好好站着让人拍：不是笑到模糊，就是被朋友挤在中间。",
    "这样挺好的。被人围着的样子，比任何一张精修图都好看。",
    "所以别急着变成那种「很得体」的大人。该笑到露牙的时候就笑，该伸两根手指戳脸的时候就戳。",
    "右边那盏灯点一下，许个愿——我这儿没有蜡烛，只能借你一盏孔明灯。",
  ],
  signature: "—— 学弟",
  // 孔明灯三态提示
  hintIdle: "点一下，把灯点亮。",
  hintLit: "心里想一句，然后放手。",
  release: "放 灯",
  wishTitle: "生日快乐",
  wishBody:
    "—— 灯会一直往上飘，飘到看不见为止。\n愿望不用说给谁听，说给自己就够了。\n剩下的，慢慢来。",
};
