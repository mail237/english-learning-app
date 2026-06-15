import fs from 'fs';
import https from 'https';
import { google } from 'googleapis';

const SPREADSHEET_ID = '1AFlFcfVoX5CH28ah8G12Cc58iYv2qpvdXHyhY4FuH-E';
const WEB_APP_URL =
  'https://script.google.com/macros/s/AKfycbz1yYhIxY27DMJwx6ViaHj9TdOdiipUdY_o4wKHeDIO29uC_vHMZ-6GsbSveqv3DvV9/exec';

const STUDENTS = [
  '中垣 心結', '井上 丈', '和田 美倖', '大崎 薫', '川辺 詩月', '片尾 心音', '畑中 結弦', '石川 栄人', '筒井 結唯', '高木 佳希', '谷村 瞬',
  '上西 佑奈', '北市 渉', '吉田 尚仁', '川内 慎司', '川村 龍', '戸田 イゴル', '植盛 倖多', '横山 将吾', '清水 悠富', '篠崎 晴輝', '葛井 優太',
  '中西 奏羽', '伊藤 かほ', '古園井 千晶', '吉田 しゅん', '大塚 五十楽', '岡 彩乃', '岡田 命絆', '林田 朝香', '芦谷 天眞', '酒井 紫えん', '野田 柚花',
];

const clasprc = JSON.parse(
  fs.readFileSync(`${process.env.HOME}/.clasprc.json`, 'utf8'),
);
const token = clasprc.tokens.default;

const auth = new google.auth.OAuth2(token.client_id, token.client_secret);
auth.setCredentials({
  access_token: token.access_token,
  refresh_token: token.refresh_token,
  token_type: token.token_type,
});

const sheets = google.sheets({ version: 'v4', auth });

async function ensureSheet(title, headers) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  let sheet = meta.data.sheets?.find((s) => s.properties?.title === title);
  if (!sheet) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { requests: [{ addSheet: { properties: { title } } }] },
    });
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${title}'!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: [headers] },
    });
    return;
  }
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${title}'!A1:A1`,
  });
  if (!res.data.values?.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${title}'!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: [headers] },
    });
  }
}

async function seedStudents() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "'生徒'!A2:B",
  });
  if ((res.data.values?.length ?? 0) > 0) {
    console.log('生徒シート: 既にデータあり');
    return;
  }
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: "'生徒'!A2",
    valueInputOption: 'RAW',
    requestBody: {
      values: STUDENTS.map((name) => [name, true]),
    },
  });
  console.log('生徒シート: 初期データ投入完了');
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            fetchJson(res.headers.location).then(resolve).catch(reject);
            return;
          }
          resolve({ status: res.statusCode, body });
        });
      })
      .on('error', reject);
  });
}

async function testWebApp() {
  const ping = await fetchJson(`${WEB_APP_URL}?action=ping`);
  console.log('ping:', ping.status, ping.body.slice(0, 200));
  const students = await fetchJson(`${WEB_APP_URL}?action=students`);
  console.log('students:', students.status, students.body.slice(0, 300));
}

async function main() {
  await ensureSheet('生徒', ['名前', '有効']);
  await ensureSheet('進捗', ['名前', 'データJSON', '更新日時']);
  await ensureSheet('記録', [
    '日時', '生徒名', '単元', '練習正答率', 'テスト正解数', 'テスト問題数',
    'テスト正答率', '単語正解数', '単語問題数', '単語正答率',
    'スピーキングOK', 'スピーキング総数', 'スピーキング正答率', '総合評価',
  ]);
  await seedStudents();
  console.log('スプレッドシート:', `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`);
  await testWebApp();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
