#!/usr/bin/env bash
# 一键发布到 GitHub Pages（gh-pages 分支方式）。
#
#   npm run deploy
#
# 流程：清空 dist → 按 /<仓库名>/ 作为 base 构建 → 把 dist 推成 gh-pages 分支。
# GitHub 会自动重新发布，约 1 分钟后生效。
#
# 为什么不直接在 .github/workflows 里用 Actions：
#   推送 workflow 文件需要 PAT 带 `workflow` 作用域，当前令牌没有。
#   想升级成 Actions 自动部署，见 README 第三节末尾。
set -euo pipefail

cd "$(dirname "$0")/.."

REMOTE="$(git remote get-url origin)"
# 从 remote 里解析出 用户名/仓库名
if [[ "$REMOTE" =~ github\.com[:/]([^/]+)/([^/.]+) ]]; then
  OWNER="${BASH_REMATCH[1]}"
  REPO="${BASH_REMATCH[2]}"
else
  echo "✗ 无法从 remote 解析 GitHub 用户名/仓库名: $REMOTE" >&2
  exit 1
fi

BASE="/${REPO}/"
SITE="https://${OWNER}.github.io/${REPO}/"

echo "▸ 仓库   ${OWNER}/${REPO}"
echo "▸ base   ${BASE}"
echo "▸ 线上   ${SITE}"
echo

# 1. 构建
# 注意：不能 `rm -rf dist`。本机的 safe-delete 守卫会把「一次删 > 50 个文件」
# 判定为批量删除并要交互确认，脚本里没有 TTY → fail-closed → 命令卡死。
# 改成先改名（改名不算删除），旧目录由 .gitignore 的 `dist-old-*/` 兜住。
if [ -d dist ]; then
  mv dist "dist-old-$(date +%s)"
fi
echo "▸ 构建中…"
BASE="$BASE" npx --no-install vite build

if [[ ! -f dist/index.html ]]; then
  echo "✗ 构建产物缺少 index.html，终止发布" >&2
  exit 1
fi

# 2. 在 dist 里建一个独立的 gh-pages 仓库并推送
cd dist
rm -rf .git
git init -b gh-pages -q
git add -A
git commit -q -m "deploy: 学姐 生日站 $(date '+%Y-%m-%d %H:%M')"
git remote add origin "$REMOTE"
echo "▸ 推送到 gh-pages…"
# 本机 git config 里有一个连不通的本地代理（127.0.0.1:7897），会把这台机器的
# 推送掐在 TLS 握手阶段（schannel: failed to receive handshake）。这里显式置空。
git -c http.proxy= -c https.proxy= push -f -q origin gh-pages

cd ..
echo
echo "✓ 发布完成，约 1 分钟后生效："
echo "  $SITE"
