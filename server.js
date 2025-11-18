
// server.js
// npm i express cors
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

// 小工具：以 Promise 方式執行指令並擷取 stdout/stderr
function runCmd(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { shell: false, ...opts });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => (stdout += d.toString()));
    child.stderr.on('data', (d) => (stderr += d.toString()));
    child.on('error', reject);
    child.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });
  });
}

// 清除 ANSI 顏色碼：\x1B = ESC
const ANSI_REGEX = /\x1B\[[0-9;]*m/g;

/** ----------------------------------------------------------------
 * Tab1: 資料處理
 * ---------------------------------------------------------------- */

// 列出某目錄下的檔案
//  - 預設 dir=hospData
//  - ext 未指定時：只列 .csv/.txt（給 Tab1 用）
//  - ext=json 時：只列 .json（給 Tab3 用）
app.get("/api/list-datafiles", async (req, res) => {
  try {
    const dir = (req.query.dir || "hospData").trim();
    const targetDir = path.resolve(process.cwd(), dir);

    const entries = await fsp.readdir(targetDir, { withFileTypes: true });
    let files = entries.filter(e => e.isFile()).map(e => e.name);

    // ★ 重點：依目錄決定要列什麼副檔名
    if (dir === "fhirData") {
      // 第三分頁用：只列出 .json
      files = files.filter(name => /\.json$/i.test(name));
    } else {
      // 預設（第一分頁 hospData）：只列出 .csv / .txt
      files = files.filter(name => /\.(csv|txt)$/i.test(name));
    }

    files.sort();
    res.json({ files });
  } catch (err) {
    res.status(500).send(String(err?.message || err));
  }
});


// 讀取單一 .csv/.txt 檔並轉為 JSON 回傳（Tab1 用：來源檔案預覽）
app.get("/api/read-datafile", async (req, res) => {
  try {
    const dir = (req.query.dir || "hospData").trim();
    const filename = (req.query.filename || "").trim();

    if (!filename || !/\.(csv|txt)$/i.test(filename)) {
      return res.status(400).send("Invalid filename");
    }

    const filePath = path.resolve(process.cwd(), dir, filename);
    const text = await fsp.readFile(filePath, "utf-8");

    let json;

    // csv → JSON
    if (/\.csv$/i.test(filename)) {
      const lines = text.split(/\r?\n/).filter(l => l.trim());
      if (lines.length === 0) return res.json([]);

      const headers = lines.shift().split(",").map(h => h.trim());

      json = lines.map(row => {
        const cells = row.split(",").map(c => c.trim());
        const obj = {};
        headers.forEach((h, i) => obj[h || `col${i + 1}`] = cells[i] || "");
        return obj;
      });
    }
    // txt → 每行一個陣列元素
    else {
      json = text.split(/\r?\n/);
    }

    res.json(json);

  } catch (err) {
    res.status(500).send(String(err?.message || err));
  }
});

// Tab1: 資料處理執行
// 前端會 POST { filename: <選到的 csv/txt> }
// 這裡用它來取代原本的 twpas_exam.csv
app.post("/api/process-data", async (req, res) => {
  try {
    const filename = (req.body.filename || "").trim();

    if (!filename) {
      return res.status(400).send("No filename selected");
    }

    const filePath = path.resolve("hospData", filename);

    const { stdout, stderr } = await runCmd(
      "python3",
      ["data_csv_convert.py", filePath],
      { env: process.env }
    );

    // python 產生 output.json
    const outText = await fsp.readFile("output.json", "utf-8");
    const outJson = JSON.parse(outText);

    res.json({ json: outJson });

  } catch (err) {
    res.status(500).send(String(err?.message || err));
  }
});


/** ----------------------------------------------------------------
 * Tab2: Converter -> 先 node，再 python
 * ---------------------------------------------------------------- */
app.post('/api/convert', async (req, res) => {
  try {
    const step1 = await runCmd('node', ['convert_json_via_lib.js', 'pasbundle_config']);
    if (step1.code !== 0) {
      return res.status(500).send(`convert_json_via_lib.js 失敗(code=${step1.code})\n${step1.stderr || step1.stdout}`);
    }

    const step2 = await runCmd('python3', ['json_convert.py']);
    if (step2.code !== 0) {
      return res.status(500).send(`json_convert.py 失敗(code=${step2.code})\n${step2.stderr || step2.stdout}`);
    }

    const outPath = path.resolve('fhir_conversion_outputs.json');
    const jsonText = await fsp.readFile(outPath, 'utf-8');
    const json = JSON.parse(jsonText);
    res.json({ json });
  } catch (e) {
    res.status(500).send(String(e?.message || e));
  }
});


/** ----------------------------------------------------------------
 * Tab3: Validator
 *  - 第三分頁第一個按鈕：選 fhirData 目錄下 *.json 檔案
 *  - /api/list-datafiles?dir=fhirData&ext=json 會供前端下拉
 *  - /api/validate：使用選到的 filename 取代原本 fhir_conversion_outputs.json
 *  - /api/read-json：讀取 fhirData 下指定 json 檔給前端預覽
 * ---------------------------------------------------------------- */

// 驗證：接受前端傳來的 filename 與 ig，帶入指令
app.post("/api/validate", async (req, res) => {
  try {
    const { filename = "fhir_conversion_outputs.json", ig = "tw.gov.mohw.nhi.pas#1.0.7" } = req.body || {};

    // ★ 把選到的檔案視為 fhirData 目錄下的 json
    const filePath = path.resolve("fhirData", filename);

    const args = [
      "-jar", "validator_cli.jar",
      filePath,         // 原本是 fhir_conversion_outputs.json，現在改成使用選中的檔案路徑
      "-version", "4.0",
      "-ig", ig
    ];

    const { code, stdout, stderr } = await runCmd("java", args, { env: process.env });

    const rawLog = `${stdout}\n${stderr}`;
    fs.writeFileSync(path.resolve("validator_raw.log"), rawLog, "utf-8");

    // 去 ANSI
    const cleaned = rawLog.replace(ANSI_REGEX, "");

    // 前端會依規則計算：含 "Error" 行數 N -> N-1
    res.json({ logText: cleaned });
  } catch (e) {
    res.status(500).send(String(e?.message || e));
  }
});


/** （舊）列出 *_outputs.json 的 API
 *   如果新版前端不用 /api/list-outputs，可以移除
 *   暫時保留，不影響新版實作
 */
app.get("/api/list-outputs", async (req, res) => {
  try {
    const cwd = process.cwd();
    const entries = await fsp.readdir(cwd, { withFileTypes: true });
    const files = entries
      .filter(e => e.isFile() && /_outputs\.json$/i.test(e.name))
      .map(e => e.name)
      .sort();
    if (!files.includes("fhir_conversion_outputs.json")) {
      files.unshift("fhir_conversion_outputs.json");
    }
    res.json({ files });
  } catch (e) {
    res.status(500).send(String(e?.message || e));
  }
});

// 讀取指定 JSON 檔，回傳其 JSON 內容
//  - 若有帶 dir，會從該目錄底下讀取（例如 dir=fhirData）
//  - 僅允許 .json 副檔名
app.get('/api/read-json', async (req, res) => {
  try {
    const dir = (req.query.dir || "fhirData").trim();   // 可為空或 "fhirData"
    const filename = String(req.query.filename || '').trim();

    if (!filename || !/\.json$/i.test(filename)) {
      return res.status(400).send('Invalid filename');
    }

    // 防止路徑跳脫
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return res.status(400).send('Invalid filename');
    }

    const baseDir = dir ? path.resolve(process.cwd(), dir) : process.cwd();
    const filePath = path.resolve(baseDir, filename);

    const text = await fsp.readFile(filePath, 'utf-8');
    const json = JSON.parse(text);
    res.json(json);
  } catch (e) {
    res.status(500).send(String(e?.message || e));
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});

