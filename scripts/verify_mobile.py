# -*- coding: utf-8 -*-
"""移动端逐屏定点截图（用 section 索引而非 window.innerHeight 倍数）"""
import os, pathlib, sys
from playwright.sync_api import sync_playwright

EXE = next((pathlib.Path(p) for p in [
    r"C:\Users\Lenovo\AppData\Local\ms-playwright\chromium_headless_shell-1228\chrome-headless-shell-win64\chrome-headless-shell.exe",
    r"C:\Users\Lenovo\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-headless-shell-win64\chrome-headless-shell.exe",
] if pathlib.Path(p).exists()), None)

OUT = r"F:\MyProject\个人网站\fuyao-birthday\.shots"
errs = []

with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path=str(EXE) if EXE else None)
    m = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2,
                      is_mobile=True, has_touch=True)
    mp = m.new_page()
    mp.on("pageerror", lambda e: errs.append("PAGEERROR: " + str(e)))
    mp.goto("http://localhost:4173/", wait_until="networkidle")
    mp.wait_for_timeout(1500)

    n = mp.evaluate("() => document.querySelectorAll('section').length")
    print("sections:", n, flush=True)

    for i in range(n):
        mp.evaluate(f"() => document.querySelectorAll('section')[{i}].scrollIntoView({{block:'start'}})")
        mp.wait_for_timeout(900)
        name = f"m{i}-mobile-section"
        mp.screenshot(path=os.path.join(OUT, name + ".png"))
        print("  ->", name, flush=True)

    # 尾部落款
    mp.evaluate("() => window.scrollTo(0, document.body.scrollHeight)")
    mp.wait_for_timeout(800)
    mp.screenshot(path=os.path.join(OUT, "m9-mobile-footer.png"))
    print("  -> m9-mobile-footer", flush=True)

    print("errors:", errs, flush=True)
    sys.stdout.flush()
    os._exit(0)
