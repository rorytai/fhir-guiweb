
import React, { useState } from "react";

// Minimal, dependency-free tabs + JSON tree viewer UI using TailwindCSS classes
// Backend endpoints expected:
//   POST /api/process-data -> { json: <content of output.json> }
//   POST /api/convert -> { json: <content of fhir_conversion_outputs.json> }
//   POST /api/validate -> {
//       status: "success" | "failure",
//       errorCount?: number,
//       errors?: string[],
//       logText: string
//   }
// Implement backend using Node/Express or Python/FastAPI (see chat for sample server code).

export default function App() {
  // 加上一個 "home" 做首頁
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="mx-auto max-w-6xl">
        {/* 共用主標題 */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center tracking-wide">
          FHIR 處理
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 mb-6 justify-center">
          <TabButton
            active={activeTab === "home"}
            onClick={() => setActiveTab("home")}
          >
            首頁
          </TabButton>
          <TabButton
            active={activeTab === "data"}
            onClick={() => setActiveTab("data")}
          >
            資料處理
          </TabButton>
          <TabButton
            active={activeTab === "converter"}
            onClick={() => setActiveTab("converter")}
          >
            Converter
          </TabButton>
          <TabButton
            active={activeTab === "validator"}
            onClick={() => setActiveTab("validator")}
          >
            Validator
          </TabButton>
        </div>

        {/* 內容區 */}
        {activeTab === "home" && <Home onSelectTab={setActiveTab} />}
        {activeTab === "data" && <TabDataProcessing />}
        {activeTab === "converter" && <TabConverter />}
        {activeTab === "validator" && <TabValidator />}
      </div>
    </div>
  );
}


function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg border border-b-0 transition ${
        active
          ? "bg-white text-blue-600 border-gray-200"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-transparent"
      }`}
    >
      {children}
    </button>
  );
}

function SectionCard({ title, children, actions }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex gap-2">{actions}</div>
      </div>
      {children}
    </div>
  );
}

function Loading({ label = "執行中" }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Spinner />
      <span>{label}…</span>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

/** JSON Tree Viewer (collapsible) **/
function JsonTree({ data }) {
  return (
    <div className="max-h-[60vh] overflow-auto rounded-xl border border-gray-200 p-3 bg-white shadow-inner">
      <TreeNode name="root" value={data} depth={0} initiallyOpen />
    </div>
  );
}

function isObject(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

function TreeNode({ name, value, depth, initiallyOpen = false }) {
  const [open, setOpen] = useState(initiallyOpen);
  const isObj = isObject(value) || Array.isArray(value);

  return (
    <div className="font-mono text-[11px] leading-5">
      <div className="flex items-start gap-1">
        {isObj ? (
          <button
            onClick={() => setOpen((o) => !o)}
            className="select-none leading-5 rounded px-1 hover:bg-gray-200"
            aria-label={open ? "Collapse" : "Expand"}
          >
            {open ? "▾" : "▸"}
          </button>
        ) : (
          <span className="w-4 inline-block" />
        )}
        <span className="text-purple-700">{name}</span>
        <span className="mx-1">:</span>
        {isObj ? (
          <span className="text-gray-500">{Array.isArray(value) ? (open ? "[" : "Array") : open ? "{" : "Object"}</span>
        ) : (
          <Leaf value={value} />
        )}
      </div>
      {isObj && open && (
        <div className="pl-6 ml-2 border-l border-dashed border-gray-300">
          {Array.isArray(value)
            ? value.map((v, i) => (
                <TreeNode key={i} name={String(i)} value={v} depth={depth + 1} />
              ))
            : Object.entries(value).map(([k, v]) => (
                <TreeNode key={k} name={k} value={v} depth={depth + 1} />
              ))}
          <div className="text-gray-500">{Array.isArray(value) ? "]" : "}"}</div>
        </div>
      )}
    </div>
  );
}

function Leaf({ value }) {
  let display;
  const type = typeof value;
  if (value === null) display = <span className="text-gray-500">null</span>;
  else if (type === "string") display = <span className="text-green-700">"{value}"</span>;
  else if (type === "number") display = <span className="text-blue-700">{String(value)}</span>;
  else if (type === "boolean") display = <span className="text-orange-700">{String(value)}</span>;
  else display = <span className="text-gray-700">{String(value)}</span>;
  return display;
}


// 從 templateMap 中，從 rootKey 開始，遞迴把所有 reference 相關的 Resource 都收集起來
function collectResources(templateMap, rootKey) {
  const result = {};
  const visited = new Set();

  function walkRefs(obj) {
    if (!obj || typeof obj !== "object") return;
    if (Array.isArray(obj)) {
      obj.forEach(walkRefs);
      return;
    }
    for (const [k, v] of Object.entries(obj)) {
      if (k === "reference" && typeof v === "string") {
        // 例如 "reference": "#SomeResource"
        const m = v.match(/#([A-Za-z0-9_\-\.]+)/);
        if (m) {
          const refKey = m[1];
          dfs(refKey);
        }
      }
      walkRefs(v);
    }
  }

  function dfs(key) {
    if (!key || visited.has(key)) return;
    const tmpl = templateMap?.[key];
    if (!tmpl) return;
    visited.add(key);
    result[key] = tmpl;   // dict 形式：key(Resource 名) -> value(模板內容)

    // 再去看這個模板裡有沒有 reference 指到其他 Resource
    walkRefs(tmpl);
  }

  dfs(rootKey);
  return result;
}




function Home({ onSelectTab }) {
  return (
    <div className="mt-4">
      <p className="text-center text-sm text-gray-600 mb-8">
        依序完成資料處理、FHIR 轉換與檔案檢測
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Data Process */}
        <HomeCard
          borderColor="border-cyan-400"
          title="Data Process"
          subtitle="檔案處理轉換"
          description="csv → json"
          icon={<DataProcessIcon />}
          onClick={() => onSelectTab("data")}
        />

        {/* Converter */}
        <HomeCard
          borderColor="border-lime-400"
          title="Converter"
          subtitle="轉換成 FHIR 格式"
          description=""
          icon={<ConverterIcon />}
          onClick={() => onSelectTab("converter")}
        />

        {/* Validator */}
        <HomeCard
          borderColor="border-orange-400"
          title="Validator"
          subtitle="FHIR 檔案檢測"
          description=""
          icon={<ValidatorIcon />}
          onClick={() => onSelectTab("validator")}
        />
      </div>
    </div>
  );
}

/* ------------------- Icon Cards ------------------- */
function HomeCard({ borderColor, title, subtitle, description, icon, onClick }) {
  return (
    <div
      className={`flex flex-col items-center justify-between rounded-3xl border-2 ${borderColor} bg-white px-6 py-8 shadow-sm`}
    >
      <div className="text-lg font-semibold mb-6">{title}</div>

      {/* Icon 區塊（黑色圓形 + SVG icon） */}
      <button
        type="button"
        onClick={onClick}
        className="focus:outline-none mb-6"
      >
        <div className="h-28 w-28 md:h-32 md:w-32 rounded-full bg-black flex items-center justify-center text-white">
          <div className="w-14 h-14 md:w-16 md:h-16">
            {icon}
          </div>
        </div>
      </button>

      <div className="text-center text-sm text-gray-700 leading-relaxed">
        {subtitle && <div>{subtitle}</div>}
        {description && <div>{description}</div>}
      </div>
    </div>
  );
}


function DataProcessIcon() {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-3-3v6m-7 4h12a2 2 0 002-2V7.5L14.5 3h-9A2 2 0 003 5v14a2 2 0 002 2z"
      />
    </svg>
  );
}

function ConverterIcon() {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 4h4m0 0v4m0-4l-6 6m-6-2H4m0 0V4m0 4l6-6m0 12h6m0 0v4m0-4l-6 6m-6-2H4m0 0v-4m0 4l6 6"
      />
    </svg>
  );
}

function ValidatorIcon() {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2.25l7.5 4.5v6c0 5.25-3.75 9.75-7.5 9.75S4.5 18 4.5 12.75v-6L12 2.25z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 12l1.5 1.5 3-3"
      />
    </svg>
  );
}




/********************** TAB 1: 資料處理 ************************/ 
function TabDataProcessing() {
  const [json, setJson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [availableFiles, setAvailableFiles] = useState([]);
  const [sourceFile, setSourceFile] = useState("");
  const [showSourcePreview, setShowSourcePreview] = useState(false);
  const [sourcePreview, setSourcePreview] = useState(null);
  const [sourcePreviewErr, setSourcePreviewErr] = useState("");

  // 上傳用狀態
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const fileInputRef = React.useRef(null);

  // 一開始載入 hospData 底下 csv/txt
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/list-datafiles?dir=hospData");
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        const list = Array.isArray(data.files) ? data.files : [];
        setAvailableFiles(list);
        if (list.length > 0) setSourceFile(list[0]);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // 顯示來源檔案內容（可收合）
  const loadSourcePreview = async () => {
    setSourcePreviewErr("");
    setSourcePreview(null);
    try {
      const res = await fetch(
        `/api/read-datafile?dir=hospData&filename=${encodeURIComponent(sourceFile)}`
      );
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setSourcePreview(data);
    } catch (e) {
      setSourcePreviewErr(String(e.message || e));
    }
  };

  // 上傳檔案(csv/txt)到 hospData
  const handleUploadChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadMsg("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload-datafile", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const filename = data.filename;

      // 更新下拉清單
      setAvailableFiles((prev) => {
        if (prev.includes(filename)) return prev;
        return [...prev, filename].sort();
      });
      setSourceFile(filename);
      setUploadMsg(`已上傳：${filename}`);
    } catch (err) {
      setUploadMsg(`上傳失敗：${String(err.message || err)}`);
    } finally {
      setUploading(false);
      // 清空 input value，避免同檔案無法再次觸發 change
      e.target.value = "";
    }
  };

  // 執行資料處理：把選到的檔名傳給 /api/process-data
  const run = async () => {
    setError("");
    setLoading(true);
    setJson(null);
    try {
      const res = await fetch("/api/process-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: sourceFile }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setJson(data.json ?? data);
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionCard
      title="資料處理"
      actions={
        <div className="flex flex-col gap-3 items-start w-full">
          {/* 第一列：來源檔案 + 上傳按鈕 */}
          <div className="flex items-center gap-3 w-full flex-wrap">
            <label className="text-sm text-gray-700 w-28">來源檔案</label>

            {/* 下拉選單：選 hospData 下的 csv/txt */}
            <select
              value={sourceFile}
              onChange={(e) => setSourceFile(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-sm"
              title="選擇 hospData 目錄下的 .csv / .txt 檔"
            >
              {availableFiles.length === 0 ? (
                <option value="">（尚無檔案）</option>
              ) : (
                availableFiles.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))
              )}
            </select>

            {/* 右側檔名標示 */}
            <span
              className="text-sm text-blue-700 underline truncate max-w-[18rem]"
              title={sourceFile}
            >
              {sourceFile || "未選擇"}
            </span>

            {/* 上傳按鈕 + 隱藏 input[type=file] */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs"
                disabled={uploading}
              >
                {uploading ? "上傳中..." : "上傳檔案"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                className="hidden"
                onChange={handleUploadChange}
              />
            </div>
          </div>

          {/* 上傳訊息（小字） */}
          {uploadMsg && (
            <div className="ml-28 text-xs text-gray-600">{uploadMsg}</div>
          )}

          {/* 第二列：執行按鈕 */}
          <div className="flex items-center gap-3 w-full">
            <label className="text-sm text-gray-700 w-28">動作</label>
            <button
              onClick={run}
              disabled={loading || !sourceFile}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 shadow-sm"
            >
              {loading ? <Spinner /> : null}
              <span className="text-base">{loading ? "處理中" : "執行"}</span>
            </button>
          </div>
        </div>
      }
    >
      {/* 上方：來源檔案內容（可收合） */}
      <div className="mb-4">
        <button
          onClick={async () => {
            const next = !showSourcePreview;
            setShowSourcePreview(next);
            if (next && sourceFile) await loadSourcePreview();
          }}
          className="text-sm px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
          disabled={!sourceFile}
        >
          {showSourcePreview ? "收合來源檔案內容" : "顯示來源檔案內容"}
        </button>

        {showSourcePreview && (
          <div className="mt-3">
            {sourcePreviewErr && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                {sourcePreviewErr}
              </div>
            )}
            {sourcePreview && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">{sourceFile}</h3>
                  <span className="text-[10px] text-gray-500">
                    可展開/收合 · 可捲動
                  </span>
                </div>
                <JsonTree data={sourcePreview} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 下方：output.json 樹狀結果 */}
      {loading && <Loading label="生成 output.json" />}
      {error && (
        <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}
      {json && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">output.json</h3>
            <span className="text-[10px] text-gray-500">
              可展開/收合 · 可捲動
            </span>
          </div>
          <JsonTree data={json} />
        </div>
      )}
    </SectionCard>
  );
}




/********************** TAB 2: Converter ************************/
function TabConverter() {
  const [json, setJson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveMsg, setSaveMsg] = useState("");

  // 第 1 按鈕：要轉換的來源檔（convData 目錄下 .json）
  const [inputFile, setInputFile] = useState("");
  const [availableInputFiles, setAvailableInputFiles] = useState([]);

  // 第 2 按鈕：config 檔（config 目錄下 .js）
  const [configFile, setConfigFile] = useState("");
  const [availableConfigFiles, setAvailableConfigFiles] = useState([]);

  // config js 原始文字 + 收合狀態
  const [configText, setConfigText] = useState("");
  const [configErr, setConfigErr] = useState("");
  const [showConfigBlock, setShowConfigBlock] = useState(false);

  // pasbundle_config_template.js 的 globalResource map
  const [templateMap, setTemplateMap] = useState(null);

  // Resource 模板檢視：從 config 檔的 globalResource 取得 key
  const [resourceKeys, setResourceKeys] = useState([]);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState("");
  const [showTemplateBlock, setShowTemplateBlock] = useState(false);

  // 載入 convData / config 下可用的檔案
  React.useEffect(() => {
    (async () => {
      try {
        // convData 下的 .json
        {
          const res = await fetch("/api/list-datafiles?dir=convData");
          if (res.ok) {
            const data = await res.json();
            const list = Array.isArray(data.files) ? data.files : [];
            setAvailableInputFiles(list);
            if (list.length > 0) setInputFile(list[0]);
          }
        }

        // config 下的 .js
        {
          const res = await fetch("/api/list-datafiles?dir=config");
          if (res.ok) {
            const data = await res.json();
            const list = Array.isArray(data.files) ? data.files : [];
            setAvailableConfigFiles(list);
            if (list.length > 0) setConfigFile(list[0]);
          }
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const configNameNoExt = (configFile || "").replace(/\.js$/i, "");

  // 當 config 檔案變動時，自動去抓：
  //   - config/<name>.js 的原始文字、globalResource
  //   - template/config/pasbundle_config_template.js 的 globalResource
  React.useEffect(() => {
    // 清掉舊資料
    setConfigText("");
    setConfigErr("");
    setShowConfigBlock(false);

    setTemplateMap(null);
    setResourceKeys([]);
    setSelectedTemplateKey("");
    setShowTemplateBlock(false);
    setSaveMsg("");

    if (!configNameNoExt) return;

    (async () => {
      try {
        const res = await fetch(`/api/config-info?name=${encodeURIComponent(configNameNoExt)}`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        // 後端回傳：{ configText, configGlobalResource, templateGlobalResource }
        setConfigText(data.configText || "");

        // 從 config 檔的 module.exports.globalResource 取 key 當 Resource 清單
        const cfgGR = data.configGlobalResource || {};
        const keys = Object.keys(cfgGR);
        setResourceKeys(keys);
        if (keys.length > 0) {
          setSelectedTemplateKey(keys[0]);
        }

        // pasbundle_config_template.js 的 globalResource map
        const tpl = data.templateGlobalResource || null;
        setTemplateMap(tpl);
      } catch (e) {
        setConfigErr(String(e.message || e));
      }
    })();
  }, [configNameNoExt]);

  const handleSaveTemplateConfig = async () => {
    setSaveMsg("");
    if (!templateMap || !selectedTemplateKey) {
      setSaveMsg("尚未選擇 Resource 模板");
      return;
    }

    // 1) 收集 root Resource 以及所有 reference 相關的 Resource
    const resourcesDict = collectResources(templateMap, selectedTemplateKey);

    try {
      const res = await fetch("/api/save-config-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rootName: selectedTemplateKey,  // 例如 "Patient"
          resources: resourcesDict,       // dict: { Resource名: 模板內容, ... }
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setSaveMsg(`已儲存：${data.filename}`);
    } catch (e) {
      setSaveMsg(`儲存失敗：${String(e.message || e)}`);
    }
  };

  // 執行 converter：
  //   node convert_json_via_lib.js <inputFile> <configNameNoExt>
  //   python3 json_convert.py
  const run = async () => {
    setError("");
    setLoading(true);
    setJson(null);
    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputFile,                // convData 下的 .json
          configName: configNameNoExt, // 例如 pasbundle_config
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setJson(data.json ?? data);
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionCard
      title="Converter"
      actions={
        <div className="flex flex-col gap-3 items-start w-full">
          {/* 第 1 列：來源檔案（convData 下 .json） */}
          <div className="flex items-center gap-3 w-full">
            <label className="text-sm text-gray-700 w-32">來源檔案</label>
            <select
              value={inputFile}
              onChange={(e) => setInputFile(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-sm"
              title="選擇 convData 目錄下的 .json 檔"
            >
              {availableInputFiles.length === 0 ? (
                <option value="">（尚無檔案）</option>
              ) : (
                availableInputFiles.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))
              )}
            </select>
            <span
              className="text-sm text-blue-700 underline truncate max-w-[20rem]"
              title={inputFile}
            >
              {inputFile || "未選擇"}
            </span>
          </div>

          {/* 第 2 列：config 檔案（config 下 .js） */}
          <div className="flex items-center gap-3 w-full">
            <label className="text-sm text-gray-700 w-32">Config 檔案</label>
            <select
              value={configFile}
              onChange={(e) => setConfigFile(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-sm"
              title="選擇 config 目錄下的 .js 檔"
            >
              {availableConfigFiles.length === 0 ? (
                <option value="">（尚無檔案）</option>
              ) : (
                availableConfigFiles.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))
              )}
            </select>
            <span
              className="text-sm text-purple-700 underline truncate max-w-[20rem]"
              title={configNameNoExt || configFile}
            >
              {configNameNoExt || (configFile || "未選擇")}
            </span>
          </div>

          {/* 第 3 列：Resource 模板檢視（從 config.globalResource 的 key 來） */}
          <div className="flex items-center gap-3 w-full">
            <label className="text-sm text-gray-700 w-32">Resource 模板檢視</label>
            <select
              value={selectedTemplateKey}
              onChange={(e) => setSelectedTemplateKey(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-sm"
              disabled={!resourceKeys.length}
              title="從 config 檔的 globalResource 中選擇 Resource 名稱"
            >
              {resourceKeys.length === 0 ? (
                <option value="">（尚無可用 Resource）</option>
              ) : (
                resourceKeys.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))
              )}
            </select>
            <span
              className="text-sm text-emerald-700 underline truncate max-w-[20rem]"
              title={selectedTemplateKey}
            >
              {selectedTemplateKey || "未選擇"}
            </span>
          </div>

          {/* 第 4 列：執行按鈕 */}
          <div className="flex items-center gap-3 w-full">
            <label className="text-sm text-gray-700 w-32">動作</label>
            <button
              onClick={run}
              disabled={loading || !inputFile || !configNameNoExt}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 shadow-sm"
            >
              {loading ? <Spinner /> : null}
              <span className="text-base">{loading ? "轉換中" : "執行"}</span>
            </button>
          </div>
        </div>
      }
    >
      {/* Config js 內容 block：不用 JsonTree，直接顯示原始 js，且可收合 */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setShowConfigBlock((v) => !v)}
          disabled={!configText}
          className="text-sm px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-60"
        >
          {showConfigBlock ? "收合 Config 原始內容" : "顯示 Config 原始內容"}
        </button>

        {configErr && (
          <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
            {configErr}
          </div>
        )}

        {showConfigBlock && configText && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">config/{configFile}</h3>
              <span className="text-[10px] text-gray-500">可捲動 · 原始 js 內容</span>
            </div>
            <div className="max-h-[40vh] overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
              <pre className="text-xs md:text-sm whitespace-pre">
{configText}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Template key 對應的 value block（JsonTree、可收合） */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setShowTemplateBlock((v) => !v)}
          disabled={!templateMap || !selectedTemplateKey}
          className="text-sm px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-60"
        >
          {showTemplateBlock ? "收合 Config Resource 模板內容" : "顯示 Config Resource 模板內容"}
        </button>

        {showTemplateBlock && templateMap && selectedTemplateKey && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">
                template/config/pasbundle_config_template.js · {selectedTemplateKey}
              </h3>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  title="另存可使用的config"
                  onClick={handleSaveTemplateConfig}
                  className="text-xs px-3 py-1.5 rounded-lg border border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                >
                  另存可使用的config
                </button>
                <span className="text-[10px] text-gray-500">
                  可展開/收合 · 可捲動
                </span>
              </div>
            </div>
            <JsonTree data={templateMap[selectedTemplateKey]} />
          </div>
        )}
      </div>

      {saveMsg && (
        <div className="mt-2 text-xs text-gray-700">
          {saveMsg}
        </div>
      )}

      {/* Converter 執行結果 */}
      {loading && <Loading label="產出 fhir_conversion_outputs.json" />}
      {error && (
        <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}
      {json && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">fhir_conversion_outputs.json</h3>
            <span className="text-[10px] text-gray-500">可展開/收合 · 可捲動</span>
          </div>
          <JsonTree data={json} />
        </div>
      )}
    </SectionCard>
  );
}




/********************** TAB 3: Validator ************************/ 
function TabValidator() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'failure', count?: number }
  const [errors, setErrors] = useState([]);
  const [logText, setLogText] = useState("");
  const [errMsg, setErrMsg] = useState("");

  // 受檢檔案（fhirData 目錄下 *.json）
  const [targetFile, setTargetFile] = useState("fhir_conversion_outputs.json");
  const [availableFiles, setAvailableFiles] = useState([]);

  // IG 選擇
  const [ig, setIg] = useState("tw.gov.mohw.nhi.pas#1.0.7");
  const igOptions = [
    "tw.gov.mohw.nhi.pas#1.0.7",
    "tw.gov.mohw.emr#0.2.0",
    "tw.gov.mohw.twcore#0.3.2",
  ];

  // 可收合區塊
  const [showFilePanel, setShowFilePanel] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [fileJson, setFileJson] = useState(null);
  const [fileJsonError, setFileJsonError] = useState("");

  // 初始化：取得 fhirData 目錄下 *.json 檔案
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/list-datafiles?dir=fhirData");
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        const list = Array.isArray(data.files) ? data.files : [];
        setAvailableFiles(list);
        if (list.length > 0) {
          if (list.includes("fhir_conversion_outputs.json")) {
            setTargetFile("fhir_conversion_outputs.json");
          } else {
            setTargetFile(list[0]);
          }
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // 讀取受檢檔案內容
  const loadFileJson = async () => {
    setFileJsonError("");
    setFileJson(null);
    try {
      const res = await fetch(`/api/read-json?dir=fhirData&filename=${encodeURIComponent(targetFile)}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setFileJson(data);
    } catch (e) {
      setFileJsonError(String(e.message || e));
    }
  };

  // 去除 ANSI 顏色碼
  const stripAnsi = (s = "") => s.replace(/\x1B\[[0-9;]*m/g, "");

  const run = async () => {
    setErrMsg("");
    setLoading(true);
    setStatus(null);
    setErrors([]);
    setLogText("");
    try {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: targetFile, ig }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      const cleaned = stripAnsi(data.logText || "");
      const lines = cleaned.split(/\r?\n/).filter(l => l.trim().length > 0);
      const errorLines = lines.filter(l => /error/i.test(l));
      const errorCountMinusOne = Math.max(errorLines.length - 1, 0);

      if (errorCountMinusOne === 0) {
        setStatus({ type: "success", count: 0 });
      } else {
        setStatus({ type: "failure", count: errorCountMinusOne });
      }

      // 只存「第二行（含）之後」的 Error rows
      setErrors(errorLines.slice(1));
      setLogText(cleaned);
      setShowLog(true);
    } catch (e) {
      setErrMsg(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionCard
      title="Validator"
      actions={
        <div className="flex flex-col gap-3 items-start w-full">
          {/* 第一列：選擇受檢檔案（fhirData 下 *.json） */}
          <div className="flex items-center gap-3 w-full">
            <label className="text-sm text-gray-700 w-24">受檢檔案</label>
            <select
              value={targetFile}
              onChange={(e) => setTargetFile(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-sm"
              title="選擇 fhirData 目錄下的 .json 檔"
            >
              {availableFiles.length === 0 ? (
                <option value="">（尚無檔案）</option>
              ) : (
                availableFiles.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))
              )}
            </select>
            <span
              className="text-sm text-blue-700 underline truncate max-w-[20rem]"
              title={targetFile}
            >
              {targetFile || "未選擇"}
            </span>
          </div>

          {/* 第二列：選 IG */}
          <div className="flex items-center gap-3 w-full">
            <label className="text-sm text-gray-700 w-24">IG</label>
            <select
              value={ig}
              onChange={(e) => setIg(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-sm"
              title="選取 IG"
            >
              {igOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <span
              className="text-sm text-purple-700 underline truncate max-w-[20rem]"
              title={ig}
            >
              {ig}
            </span>
          </div>

          {/* 第三列：執行驗證 */}
          <div className="flex items-center gap-3 w-full">
            <label className="text-sm text-gray-700 w-24">動作</label>
            <button
              onClick={run}
              disabled={loading || !targetFile}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 shadow-sm"
            >
              {loading ? <Spinner /> : null}
              <span className="text-base">{loading ? "驗證中" : "執行驗證"}</span>
            </button>
          </div>
        </div>
      }
    >
      {/* 放大版狀態顯示 */}
      {status && (
        <div className="mb-4">
          {status.type === "success" ? (
            <StatusPill color="green" label="Success (0)" />
          ) : (
            <StatusPill color="red" label={`Error (${status.count ?? 0})`} />
          )}
        </div>
      )}

      {errMsg && (
        <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
          {errMsg}
        </div>
      )}

      {/* 受檢檔案內容（可收合，位於 Log 上方） */}
      <div className="mt-3">
        <button
          onClick={async () => {
            const next = !showFilePanel;
            setShowFilePanel(next);
            if (next && targetFile) await loadFileJson();
          }}
          className="text-sm px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
          disabled={!targetFile}
        >
          {showFilePanel ? "收合受檢檔案內容" : "顯示受檢檔案內容"}
        </button>
        {showFilePanel && (
          <div className="mt-3">
            {fileJsonError && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                {fileJsonError}
              </div>
            )}
            {fileJson && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">{targetFile}</h3>
                  <span className="text-[10px] text-gray-500">可展開/收合 · 可捲動</span>
                </div>
                <JsonTree data={fileJson} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ★ Error Rows 區塊：只在「紅色狀態」時顯示，且每條簡化成一行＋右側按鈕展開完整訊息 */}
      {status?.type === "failure" && !!errors?.length && (
        <div className="mb-4 mt-6">
          <h3 className="text-sm font-medium mb-2">Error Rows</h3>
          <div className="space-y-2">
            {errors.map((line, idx) => (
              <ErrorRow key={idx} line={line} />
            ))}
          </div>
        </div>
      )}

      {/* Log（可收合） */}
      <div className="mt-3">
        <button
          onClick={() => setShowLog(v => !v)}
          className="text-sm px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
        >
          {showLog ? "收合驗證 Log" : "顯示驗證 Log"}
        </button>
        {showLog && logText && (
          <div className="mt-2">
            <h3 className="text-sm font-medium mb-2">Log (已去除 ANSI 顏色碼)</h3>
            <div className="max-h-[40vh] overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
              <pre className="text-sm whitespace-pre-wrap">{logText}</pre>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}




function ErrorRow({ line }) {
  const [open, setOpen] = useState(false);

  // 簡化顯示的一行（手動加 "..."）
  const maxLen = 120;
  const short =
    line.length > maxLen ? line.slice(0, maxLen) + " ..." : line;

  return (
    <div className="border border-red-200 bg-red-50/80 rounded-lg px-3 py-2">
      <div className="flex items-center gap-2">
        {/* 左側：一行簡短 + 省略號 */}
        <div className="flex-1 text-sm text-red-800 truncate">
          {short}
        </div>

        {/* 右側：展開 / 收合按鈕 */}
        <button
          onClick={() => setOpen(v => !v)}
          className="flex-shrink-0 text-xs px-2 py-1 rounded border border-red-300 text-red-700 bg-white hover:bg-red-50"
        >
          {open ? "收合" : "檢視完整"}
        </button>
      </div>

      {/* 展開時顯示完整訊息 */}
      {open && (
        <div className="mt-2 text-xs text-red-900 whitespace-pre-wrap border-t border-red-200 pt-2">
          {line}
        </div>
      )}
    </div>
  );
}



function StatusPill({ color, label }) {
  const colorMap = {
    green: {
      dot: "bg-green-500",
      text: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-300",
    },
    red: {
      dot: "bg-red-500",
      text: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-300",
    },
  }[color];

  return (
    <div
      className={`inline-flex items-center gap-4 px-6 py-4 rounded-full border shadow-md ${colorMap.bg} ${colorMap.border}`}
    >
      {/* 圓圈更大 */}
      <span className={`h-8 w-8 rounded-full ${colorMap.dot}`} />
      {/* 文字＋數字放大 */}
      <span className={`${colorMap.text} font-bold text-2xl tracking-wide`}>
        {label}
      </span>
    </div>
  );
}

