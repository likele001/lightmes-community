#!/usr/bin/env bash
# 一键发布：拆分 → 导出社区版 + 专业版 → 提交并推送
# 用法:
#   bash scripts/release-all.sh "更新说明：修复报工审核"
#   bash scripts/release-all.sh --dry-run "更新说明"
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
COMMUNITY_DIR="${COMMUNITY_DIR:-$(dirname "$ROOT")/lightmes-community}"
PRO_DIR="${PRO_DIR:-$(dirname "$ROOT")/lightmes-pro}"
COMMUNITY_REMOTE="${COMMUNITY_REMOTE:-git@github.com:likele001/lightmes-community.git}"
PRO_REMOTE="${PRO_REMOTE:-git@github.com:likele001/lightmes-pro.git}"

DRY_RUN=0
MSG=""

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    *) MSG="${MSG:+$MSG }$arg" ;;
  esac
done

if [[ -z "$MSG" ]]; then
  echo "用法: bash scripts/release-all.sh \"更新说明\""
  echo "示例: bash scripts/release-all.sh \"更新社区版与专业版：修复 H5 报工\""
  echo "试跑: bash scripts/release-all.sh --dry-run \"更新说明\""
  exit 1
fi

_run() {
  if [[ "$DRY_RUN" -eq 1 ]]; then
    echo "[dry-run] $*"
  else
    "$@"
  fi
}

_push_repo() {
  local name="$1"
  local dir="$2"
  local remote="$3"
  local commit_msg="$4"

  echo ""
  echo "==> 发布 $name"
  echo "    目录: $dir"

  if [[ ! -d "$dir" ]]; then
    echo "错误: 目录不存在 $dir"
    exit 1
  fi

  cd "$dir"

  if [[ ! -d .git ]]; then
    echo "    初始化 Git 仓库..."
    _run git init
    _run git branch -M main
    _run git remote add origin "$remote"
  elif ! git remote get-url origin &>/dev/null; then
    _run git remote add origin "$remote"
  else
    local url
    url="$(git remote get-url origin)"
    if [[ "$url" != "$remote" ]]; then
      _run git remote set-url origin "$remote"
    fi
  fi

  _run git add -A

  if [[ "$DRY_RUN" -eq 1 ]]; then
    git status --short | head -20
    echo "    （dry-run 跳过 commit / push）"
    return 0
  fi

  if git diff --cached --quiet; then
    echo "    无变更，跳过提交"
  else
    git commit -m "$commit_msg"
  fi

  git push -u origin main
  echo "    ✅ $name 已推送"
}

echo "========================================"
echo " LightMes 一键发布（社区版 + 专业版）"
echo "========================================"
echo "说明: $MSG"
echo "社区: $COMMUNITY_DIR"
echo "专业: $PRO_DIR"

cd "$ROOT"

echo ""
echo "==> 1/4 拆分并校验"
_run bash "$ROOT/scripts/split-packages.sh"
_run bash "$ROOT/scripts/verify-community-clean.sh"

echo ""
echo "==> 2/4 导出社区版"
SKIP_SPLIT=1 _run bash "$ROOT/scripts/export-community-repo.sh" "$COMMUNITY_DIR"

echo ""
echo "==> 3/4 导出专业版"
SKIP_SPLIT=1 _run bash "$ROOT/scripts/export-pro-repo.sh" "$PRO_DIR"

echo ""
echo "==> 4/4 推送到 GitHub"
_push_repo "社区版 (lightmes-community)" "$COMMUNITY_DIR" "$COMMUNITY_REMOTE" \
  "更新社区版：$MSG"
_push_repo "专业版 (lightmes-pro)" "$PRO_DIR" "$PRO_REMOTE" \
  "更新专业版：$MSG"

echo ""
echo "========================================"
echo " 发布完成"
echo " 社区: https://github.com/likele001/lightmes-community"
echo " 专业: https://github.com/likele001/lightmes-pro"
echo "========================================"
