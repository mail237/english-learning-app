#!/bin/bash
cd "$(dirname "$0")"
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"
PORT=5173
LAN_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "（ターミナルで ipconfig getifaddr en0）")
LOCAL_NAME=$(scutil --get LocalHostName 2>/dev/null || true)

echo ""
echo "【英語学習アプリ】このウィンドウを閉じるとサーバーが止まります。"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Macのブラウザ:     http://127.0.0.1:${PORT}"
echo "  iPad（同じWi‑Fi）: http://${LAN_IP}:${PORT}"
if [[ -n "$LOCAL_NAME" && "$LOCAL_NAME" != *"not set"* ]]; then
  echo "  iPad（.local）:    http://${LOCAL_NAME}.local:${PORT}"
fi
echo ""
echo "  iPadでホーム画面に追加:"
echo "  Safari → 共有 → ホーム画面に追加"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if ! command -v node >/dev/null 2>&1; then
  echo "エラー: node が見つかりません。https://nodejs.org から Node.js を入れてください。"
  read -r _
  exit 1
fi

if [[ ! -d node_modules ]]; then
  echo "初回のみ依存関係を入れます（npm install）…"
  npm install || { echo "npm install に失敗しました。"; read -r _; exit 1; }
fi

open "http://127.0.0.1:${PORT}" 2>/dev/null || true
npm run dev:ipad
