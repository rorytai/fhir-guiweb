
// server.js
// npm i express cors
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const multer = require("multer");
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
//  - ext=json 時：只列 .json（給 Tab2, Tab3 用）
app.get("/api/list-datafiles", async (req, res) => {
  try {
    const dir = (req.query.dir || "hospData").trim();
    const targetDir = path.resolve(process.cwd(), dir);

    const entries = await fsp.readdir(targetDir, { withFileTypes: true });
    let files = entries.filter(e => e.isFile()).map(e => e.name);

    if (dir === "fhirData" || dir === "convData") {
      // fhirData / convData：列 .json
      files = files.filter(name => /\.json$/i.test(name));
    } else if (dir === "config") {
      // config：列 .js
      files = files.filter(name => /\.js$/i.test(name));
    } else {
      // 其餘（例如 hospData）：列 .csv / .txt
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


// 設定上傳目的地：hospData 目錄，檔名用原檔名
const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.resolve(process.cwd(), "hospData");
    // 確保目錄存在
    fs.mkdir(dest, { recursive: true }, (err) => cb(err, dest));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: uploadStorage });

// 上傳 csv / txt 檔到 hospData
app.post("/api/upload-datafile", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const allowed = /\.(csv|txt)$/i;
    if (!allowed.test(req.file.originalname)) {
      // 若不是 csv/txt，就刪掉
      try {
        await fsp.unlink(req.file.path);
      } catch (e) {
        // ignore
      }
      return res.status(400).send("Only .csv or .txt files are allowed");
    }

    // 上傳成功，檔案已在 hospData/<原檔名>
    res.json({ filename: req.file.originalname });
  } catch (e) {
    res.status(500).send(String(e?.message || e));
  }
});




/** ----------------------------------------------------------------
 * Tab2: Converter -> 先 node，再 python
 * ---------------------------------------------------------------- */
app.post('/api/convert', async (req, res) => {
  try {
    const { inputFile, configName } = req.body || {};

    if (!inputFile || !configName) {
      return res.status(400).send("inputFile 或 configName 未提供");
    }

    // convData 下的來源檔
    const inputPath = path.resolve('convData', inputFile);
    const cfgBase = String(configName).trim(); // 例如 "pasbundle_config"

    // 1) node convert_json_via_lib.js <inputPath> <cfgBase>
    const step1 = await runCmd('node', ['convert_json_via_lib.js', inputPath, cfgBase]);
    if (step1.code !== 0) {
      return res
        .status(500)
        .send(`convert_json_via_lib.js 失敗(code=${step1.code})\n${step1.stderr || step1.stdout}`);
    }

    // 2) python3 json_convert.py
    const step2 = await runCmd('python3', ['json_convert.py']);
    if (step2.code !== 0) {
      return res
        .status(500)
        .send(`json_convert.py 失敗(code=${step2.code})\n${step2.stderr || step2.stdout}`);
    }

    // 如同之前：讀取 fhir_conversion_outputs.json 回前端
    const outPath = path.resolve('fhir_conversion_outputs.json');
    const jsonText = await fsp.readFile(outPath, 'utf-8');
    const json = JSON.parse(jsonText);

    res.json({ json });
  } catch (e) {
    res.status(500).send(String(e?.message || e));
  }
});


// 讀 config 與 pasbundle template：
//   config/<name>.js → configText + configGlobalResource
//   template/config/pasbundle_config_template.js → templateGlobalResource
app.get("/api/config-info", async (req, res) => {
  try {
    const name = (req.query.name || "").trim();  // 例如 "pasbundle_config" 或 "pasOrganization_config"
    if (!name) {
      return res.status(400).send("name is required");
    }

    if (name.includes("..") || name.includes("/") || name.includes("\\")) {
      return res.status(400).send("invalid name");
    }

    const baseDir = __dirname || process.cwd();

    // 1) config/<name>.js
    const configPath = path.resolve(baseDir, "config", `${name}.js`);
    const configText = await fsp.readFile(configPath, "utf-8");

    delete require.cache[configPath];
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const cfgRaw = require(configPath);
    const cfgModule = cfgRaw && cfgRaw.default ? cfgRaw.default : cfgRaw;

    const configGlobalResource =
      cfgModule && cfgModule.globalResource && typeof cfgModule.globalResource === "object"
        ? cfgModule.globalResource
        : {};

    // 2) template/config/pasbundle_config_template.js (固定這一個)
    const tplPath = path.resolve(baseDir, "template", "config", "pasbundle_config_template.js");
    delete require.cache[tplPath];
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const tplRaw = require(tplPath);
    const tplModule = tplRaw && tplRaw.default ? tplRaw.default : tplRaw;

    const templateGlobalResource =
      tplModule && tplModule.globalResource && typeof tplModule.globalResource === "object"
        ? tplModule.globalResource
        : {};

    res.json({
      configText,
      configGlobalResource,
      templateGlobalResource,
    });
  } catch (err) {
    res.status(500).send(String(err?.message || err));
  }
});


// 儲存 Resource 模板為可使用的 config：
// body: { rootName: string, resources: { [ResourceName]: any } }
// 流程：
//   1. 讀 template/template_empty_config.js（保留原始文字，含 const..., module.exports...）
//   2. 讀 template/config/pasbundle_config_template.js → 取得 fields(list)
//   3. 依 resources 的 key(Resource 名) 從 fields(list) 挑出有用到這些 Resource 名的 dict
//   4. 在 new 檔案的最後面加上一段覆寫：
//        - module.exports.globalResource = <resources>
//        - module.exports.fields = <pickedFields>
//        - module.exports.config = Object.assign({}, module.exports.config, { name: "pas{Resource}_config" })
//   5. 寫到 config/pas{Resource}_config.js
app.post("/api/save-config-template", async (req, res) => {
  try {
    const { rootName, resources } = req.body || {};

    if (!rootName || !resources || typeof resources !== "object") {
      return res.status(400).send("rootName 或 resources 不正確");
    }

    const safeName = rootName.trim();
    if (!safeName || safeName.includes("..") || safeName.includes("/") || safeName.includes("\\")) {
      return res.status(400).send("rootName 非法");
    }

    const baseDir = __dirname || process.cwd();

    // 1. 讀 template_empty_config.js 原始文字
    const emptyTplPath = path.resolve(baseDir, "template", "template_empty_config.js");
    const emptyText = await fsp.readFile(emptyTplPath, "utf-8");

    // 2. 讀 pasbundle_config_template.js 的 fields
    const pasTplPath = path.resolve(baseDir, "template", "config", "pasbundle_config_template.js");
    delete require.cache[pasTplPath];
    const pasTplRaw = require(pasTplPath);
    const pasTpl = pasTplRaw.default || pasTplRaw;
    const allFields = Array.isArray(pasTpl.fields) ? pasTpl.fields : [];

    // 挑出包含 Resource 名字的 fields
    const keys = Object.keys(resources);
    const pickedFields = allFields.filter(f => {
      const s = JSON.stringify(f);
      return keys.some(k => s.includes(k));
    });

    // 3. 重新構建 JS 版 module.exports.config / globalResource / fields
    const newConfigObj = {
      ...pasTpl.config,        // 保留版本、serverURL 等原來設定
      name: `pas${safeName}_config`
    };

    // JS 物件輸出工具（避免 key 加引號）
    const toJsObject = (obj, indent = 2) => {
      return JSON.stringify(obj, null, indent)
        .replace(/"([^"]+)":/g, "$1:")  // 移除 key 的引號
        .replace(/\"([^"]+)\"/g, '"$1"');
    };

    const newConfigText = `
module.exports.config = ${toJsObject(newConfigObj)};
    
module.exports.globalResource = ${toJsObject(resources)};

module.exports.fields = ${toJsObject(pickedFields)};
`;

    // 4. 移除舊的三段 (module.exports.config / globalResource / fields)
    const cleaned = emptyText
      .replace(/module\\.exports\\.config[\\s\\S]*?};/m, "")
      .replace(/module\\.exports\\.globalResource[\\s\\S]*?};/m, "")
      .replace(/module\\.exports\\.fields[\\s\\S]*?];/m, "");

    // 5. 把新內容插入「beforeProcess」之前
    const outText = cleaned.replace(
      /module\.exports\.beforeProcess/,
      newConfigText + "\nmodule.exports.beforeProcess"
    );

    // 6. 寫出到 config/pas{Resource}_config.js
    const cfgDir = path.resolve(baseDir, "config");
    await fsp.mkdir(cfgDir, { recursive: true });

    const filename = `pas${safeName}_config.js`;
    const targetPath = path.resolve(cfgDir, filename);
    await fsp.writeFile(targetPath, outText, "utf-8");

    res.json({ filename });

  } catch (err) {
    res.status(500).send(String(err.message || err));
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

