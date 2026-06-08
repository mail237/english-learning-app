/**
 * 英語学習アプリ — Google スプレッドシート + Apps Script
 *
 * セットアップ: tools/SHEETS-SETUP-ja.md を参照
 */

const SHEET_STUDENTS = "生徒";
const SHEET_PROGRESS = "進捗";
const SHEET_SESSIONS = "記録";
const SECRET = "";
const SPREADSHEET_ID = "";

const DEFAULT_STUDENTS = [
  "田中 太郎",
  "佐藤 花子",
  "鈴木 一郎",
  "高橋 美咲",
  "伊藤 健太",
  "渡辺 さくら",
  "山本 大輔",
  "中村 愛",
  "小林 翔太",
  "加藤 結衣",
  "植盛 倖多"
];

function doOptions(e) {
  return jsonOut_({ ok: true }, e);
}

function doGet(e) {
  const action = (e.parameter.action || "").trim();
  const secret = (e.parameter.secret || "").trim();
  if (!allow_(secret)) return jsonOut_({ ok: false, error: "forbidden" }, e);

  ensureSheets_();

  if (action === "students") {
    return jsonOut_({ ok: true, students: listStudents_() }, e);
  }

  if (action === "progress") {
    const name = (e.parameter.name || "").trim();
    if (!name) return jsonOut_({ ok: false, error: "missing_name" }, e);
    const data = getProgress_(name);
    return jsonOut_({ ok: true, data: data }, e);
  }

  if (action === "ping") {
    return jsonOut_({ ok: true, message: "pong" }, e);
  }

  return jsonOut_({ ok: false, error: "bad_request" }, e);
}

function doPost(e) {
  let body = {};
  try {
    body = JSON.parse(e.postData && e.postData.contents ? e.postData.contents : "{}");
  } catch (err) {
    return jsonOut_({ ok: false, error: "bad_json" }, e);
  }

  const action = String(body.action || "").trim();
  const secret = String(body.secret || "").trim();
  if (!allow_(secret)) return jsonOut_({ ok: false, error: "forbidden" }, e);

  ensureSheets_();

  if (action === "saveProgress") {
    const name = String(body.name || "").trim();
    const data = body.data || {};
    if (!name) return jsonOut_({ ok: false, error: "missing_name" }, e);
    saveProgress_(name, data);
    return jsonOut_({ ok: true }, e);
  }

  if (action === "saveSession") {
    const record = body.record || {};
    if (!record.studentName) return jsonOut_({ ok: false, error: "missing_record" }, e);
    saveSession_(record);
    return jsonOut_({ ok: true }, e);
  }

  return jsonOut_({ ok: false, error: "bad_request" }, e);
}

// ---------- internals ----------

function allow_(secret) {
  if (!SECRET) return true;
  return secret && secret === SECRET;
}

function spreadsheet_() {
  if (SPREADSHEET_ID) return SpreadsheetApp.openById(SPREADSHEET_ID);
  return SpreadsheetApp.getActiveSpreadsheet();
}

function ensureSheets_() {
  const ss = spreadsheet_();

  let students = ss.getSheetByName(SHEET_STUDENTS);
  if (!students) {
    students = ss.insertSheet(SHEET_STUDENTS);
    students.appendRow(["名前", "有効"]);
    DEFAULT_STUDENTS.forEach(function (name) {
      students.appendRow([name, true]);
    });
  } else if (students.getLastRow() <= 1) {
    DEFAULT_STUDENTS.forEach(function (name) {
      students.appendRow([name, true]);
    });
  }

  let progress = ss.getSheetByName(SHEET_PROGRESS);
  if (!progress) {
    progress = ss.insertSheet(SHEET_PROGRESS);
    progress.appendRow(["名前", "データJSON", "更新日時"]);
  }

  let sessions = ss.getSheetByName(SHEET_SESSIONS);
  if (!sessions) {
    sessions = ss.insertSheet(SHEET_SESSIONS);
    sessions.appendRow([
      "日時",
      "生徒名",
      "単元",
      "練習正答率",
      "テスト正解数",
      "テスト問題数",
      "テスト正答率",
      "単語正解数",
      "単語問題数",
      "単語正答率",
      "スピーキングOK",
      "スピーキング総数",
      "スピーキング正答率",
      "総合評価"
    ]);
  }
}

function listStudents_() {
  const sh = spreadsheet_().getSheetByName(SHEET_STUDENTS);
  const values = sh.getDataRange().getValues();
  const students = [];
  for (let i = 1; i < values.length; i++) {
    const name = String(values[i][0] || "").trim();
    const active = values[i][1];
    if (!name) continue;
    if (active === false || String(active).toUpperCase() === "FALSE") continue;
    students.push(name);
  }
  return students;
}

function getProgress_(name) {
  const sh = spreadsheet_().getSheetByName(SHEET_PROGRESS);
  const values = sh.getDataRange().getValues();
  for (let i = values.length - 1; i >= 1; i--) {
    if (String(values[i][0]) === name) {
      try {
        return JSON.parse(String(values[i][1] || "{}"));
      } catch (err) {
        return null;
      }
    }
  }
  return null;
}

function saveProgress_(name, data) {
  const sh = spreadsheet_().getSheetByName(SHEET_PROGRESS);
  const values = sh.getDataRange().getValues();
  const json = JSON.stringify(data);
  const now = new Date();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === name) {
      sh.getRange(i + 1, 2, 1, 2).setValues([[json, now]]);
      return;
    }
  }
  sh.appendRow([name, json, now]);
}

function saveSession_(record) {
  const sh = spreadsheet_().getSheetByName(SHEET_SESSIONS);
  sh.appendRow([
    record.date || new Date().toISOString(),
    record.studentName || "",
    record.unit || "",
    record.practiceAccuracy || 0,
    record.testCorrect || 0,
    record.testTotal || 0,
    record.testAccuracy || 0,
    record.vocabCorrect || 0,
    record.vocabTotal || 0,
    record.vocabAccuracy || 0,
    record.speakingPassed || 0,
    record.speakingTotal || 0,
    record.speakingAccuracy || 0,
    record.overallScore || 0
  ]);
}

function jsonOut_(obj, e) {
  const json = JSON.stringify(obj);
  const cb = e && e.parameter ? String(e.parameter.callback || "").trim() : "";
  if (cb && /^[A-Za-z_$][\w$]*$/.test(cb)) {
    return ContentService.createTextOutput(cb + "(" + json + ")").setMimeType(
      ContentService.MimeType.JAVASCRIPT
    );
  }
  return ContentService.createTextOutput(json).setMimeType(
    ContentService.MimeType.JSON
  );
}
