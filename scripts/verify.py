# -*- coding: utf-8 -*-
"""
对 学姐 生日站做分段截图核验（桌面 + 移动），落盘到 .shots/。
用法：NODE_OPTIONS= <venv python> -u scripts/verify.py
需先在 4173 端口起 `npm run preview`。
"""
import os, re, sys, pathlib
from playwright.sync_api import sync_playwright

# 本机 ms-playwright 的内核编号与当前 Playwright 期望的不一致，
# 直接指定已有内核，避免 playwright install 拉几百 MB。
_SHELLS = [
    r"C:\Users\Lenovo\AppData\Local\ms-playwright\chromium_headless_shell-1228\chrome-headless-shell-win64\chrome-headless-shell.exe",
    r"C:\Users\Lenovo\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-headless-shell-win64\chrome-headless-shell.exe",
]
EXE = next((pathlib.Path(p) for p in _SHELLS if pathlib.Path(p).exists()), None)
print("using shell:", EXE, flush=True)

BASE = "http://localhost:4173"
OUT = r"F:\MyProject\个人网站\xuejie-birthday\.shots"
os.makedirs(OUT, exist_ok=True)
errs = []


def shot(page, name):
    page.screenshot(path=os.path.join(OUT, name + ".png"))
    print("  ->", name, flush=True)


with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path=str(EXE) if EXE else None)

    # ---------------- 桌面 ----------------
    ctx = b.new_context(viewport={"width": 1440, "height": 900})
    page = ctx.new_page()
    page.set_default_timeout(15000)
    page.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: errs.append("PAGEERROR: " + str(e)))

    page.goto(BASE + "/", wait_until="networkidle")
    page.wait_for_timeout(1600)

    # 划一下鼠标，触发拖尾
    page.mouse.move(400, 500)
    for x in range(420, 1120, 45):
        page.mouse.move(x, 470 + (x % 100))
        page.wait_for_timeout(26)
    shot(page, "01-cover-desktop")

    def next_page():
        page.mouse.move(720, 450)
        page.mouse.wheel(0, 220)
        # 翻页动画 0.8s + 屏内元素错峰入场（最长约 0.63s 延迟 + 0.75s 时长），
        # 等够了再截，否则会拍到半透明的一帧
        page.wait_for_timeout(2100)

    next_page(); shot(page, "02-about-desktop")
    next_page(); shot(page, "03-moments-desktop")
    next_page(); shot(page, "04-letter-idle-desktop")

    # 点亮孔明灯
    page.get_by_role("button", name="点亮孔明灯").click()
    page.wait_for_timeout(1100)
    shot(page, "05-letter-lit-desktop")

    # 放灯 → 上升中抓一张，再等祝词浮层
    page.get_by_role("button", name=re.compile("^放")).click()
    page.wait_for_timeout(1300)
    shot(page, "06-letter-floating-desktop")
    page.wait_for_timeout(1800)
    shot(page, "07-letter-wish-overlay-desktop")

    # 关掉浮层，看放灯之后的第四屏
    page.mouse.click(720, 450)
    page.wait_for_timeout(900)
    shot(page, "08-letter-after-desktop")

    # 画廊
    page.goto(BASE + "/#/gallery", wait_until="networkidle")
    page.wait_for_timeout(1300)
    shot(page, "09-gallery-all-desktop")

    page.get_by_role("button", name=re.compile("汉服那天")).click()
    page.wait_for_timeout(1100)
    shot(page, "10-gallery-hanfu-desktop")

    page.get_by_role("button", name=re.compile("逛街与城")).click()
    page.wait_for_timeout(1100)
    shot(page, "11-gallery-city-desktop")

    ctx.close()

    # ---------------- 移动端 ----------------
    m = b.new_context(
        viewport={"width": 390, "height": 844},
        device_scale_factor=2,
        is_mobile=True,
        has_touch=True,
    )
    mp = m.new_page()
    mp.set_default_timeout(15000)
    mp.goto(BASE + "/", wait_until="networkidle")
    mp.wait_for_timeout(1500)
    shot(mp, "12-mobile-cover")

    for i, name in enumerate(["13-mobile-about", "14-mobile-moments", "15-mobile-letter"], start=1):
        mp.evaluate(f"window.scrollTo(0, window.innerHeight*{i})")
        mp.wait_for_timeout(900)
        shot(mp, name)

    # 手机上把灯放了
    try:
        mp.get_by_role("button", name="点亮孔明灯").scroll_into_view_if_needed()
        mp.wait_for_timeout(400)
        mp.get_by_role("button", name="点亮孔明灯").click()
        mp.wait_for_timeout(800)
        mp.get_by_role("button", name=re.compile("^放")).click()
        mp.wait_for_timeout(1800)
        shot(mp, "16-mobile-wish")
    except Exception as e:
        print("  [mobile lantern] FAILED:", e, flush=True)

    mp.goto(BASE + "/#/gallery", wait_until="networkidle")
    mp.wait_for_timeout(1300)
    shot(mp, "17-mobile-gallery")
    m.close()

print("\n=== console errors ===", flush=True)
print("  none" if not errs else "\n".join("  " + e for e in errs[:20]), flush=True)
sys.stdout.flush()
os._exit(0)  # 直接退出：本机 browser.close() 偶发挂住，截完图就够
