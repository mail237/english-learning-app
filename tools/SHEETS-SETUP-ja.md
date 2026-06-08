# スプレッドシート連携 セットアップ

## 1. スプレッドシート作成

1. [Google スプレッドシート](https://sheets.google.com) で **新規作成**
2. 名前を「英語学習アプリ」などに変更
3. **拡張機能 → Apps Script**
4. `コード.gs` の中身を **すべて削除**
5. `tools/english-learning-appscript.gs` を **丸ごとコピー＆貼り付け**
6. **保存**

初回アクセス時に次のシートが自動作成されます：

| シート | 内容 |
|--------|------|
| 生徒 | 名前一覧（植盛 倖多 含む初期データ） |
| 進捗 | 各生徒の学習データ |
| 記録 | テスト結果の履歴 |

**生徒の追加**: 「生徒」シートに行を追加するだけ（デプロイ不要）

## 2. デプロイ

1. **デプロイ → 新しいデプロイ**
2. 種類: **ウェブアプリ**
3. **次のユーザーとして実行**: 自分
4. **アクセスできるユーザー**: **全員**
5. **デプロイ** → **Web アプリの URL** をコピー

## 3. 動作確認

ブラウザで開く（URLの末尾に付ける）:

```
?action=ping
```

→ `{"ok":true,"message":"pong"}` なら OK

```
?action=students
```

→ 生徒リストが返れば OK

## 4. アプリに URL を設定

`public/sheets-config.json` の `url` に Web アプリ URL を入れて Git push する。

```json
{
  "url": "https://script.google.com/macros/s/xxxxx/exec",
  "secret": ""
}
```

Vercel が自動デプロイすれば、全 iPad に反映されます。

## 5. トラブル

| 症状 | 対処 |
|------|------|
| 生徒が出ない | `?action=students` をブラウザで確認 |
| 進捗が保存されない | Apps Script を **新しいデプロイ** |
| forbidden | `SECRET` と `sheets-config.json` の secret を一致させる |
