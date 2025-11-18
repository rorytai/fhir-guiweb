
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
  const [activeTab, setActiveTab] = useState("data");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold mb-4">FHIR多分頁指令執行檢視</h1>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 mb-4">
          <TabButton active={activeTab === "data"} onClick={() => setActiveTab("data")}>資料處理</TabButton>
          <TabButton active={activeTab === "converter"} onClick={() => setActiveTab("converter")}>Converter</TabButton>
          <TabButton active={activeTab === "validator"} onClick={() => setActiveTab("validator")}>Validator</TabButton>
        </div>

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

  // 這裡會向後端拿某個目錄 (現在是 hospData) 底下的 csv/txt 清單
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

  // 展開「來源檔案內容」時，讀取 hospData/選取的檔案，
  // 後端把 csv/txt 轉成 JSON 結構回傳，前端用 JsonTree 顯示
  const loadSourcePreview = async () => {
    setSourcePreviewErr("");
    setSourcePreview(null);
    try {
      const res = await fetch(`/api/read-datafile?dir=hospData&filename=${encodeURIComponent(sourceFile)}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setSourcePreview(data);
    } catch (e) {
      setSourcePreviewErr(String(e.message || e));
    }
  };

  // ★ 這裡按「執行」時，會把選到的 sourceFile 傳到後端
  //   後端就可以拿這個檔名去替換原本 twpas_exam.csv
  const run = async () => {
    setError("");
    setLoading(true);
    setJson(null);
    try {
      const res = await fetch("/api/process-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: sourceFile })  // ← 關鍵
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setJson(data.json ?? data);  // 期望 backend 回傳 { json: <output.json 內容> }
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
          {/* 第一個按鈕 (下拉)：選取來源檔案 */}
          <div className="flex items-center gap-3 w-full">
            <label className="text-sm text-gray-700 w-28">來源檔案</label>
            <select
              value={sourceFile}
              onChange={(e) => setSourceFile(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-sm"
              title="選擇 hospData 目錄下的 .csv / .txt 檔"
            >
              {availableFiles.length === 0 ? (
                <option value="">（尚無檔案）</option>
              ) : (
                availableFiles.map(f => <option key={f} value={f}>{f}</option>)
              )}
            </select>
            <span className="text-sm text-blue-700 underline truncate max-w-[24rem]" title={sourceFile}>
              {sourceFile || "未選擇"}
            </span>
          </div>

          {/* 第二個按鈕：執行 */}
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
      {/* 上方：來源檔案內容，可收合，JSON 樹狀＋可捲動 */}
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
                  <span className="text-[10px] text-gray-500">可展開/收合 · 可捲動</span>
                </div>
                <JsonTree data={sourcePreview} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 下方：output.json 內容，JSON 樹狀＋可捲動 */}
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
            <span className="text-[10px] text-gray-500">可展開/收合 · 可捲動</span>
          </div>
          <JsonTree data={json} />   {/* ← 區塊＋可捲動＋樹狀視圖 */}
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

  const run = async () => {
    setError("");
    setLoading(true);
    setJson(null);
    try {
      const res = await fetch("/api/convert", { method: "POST" });
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
        <button
          onClick={run}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? <Spinner /> : null}
          <span>{loading ? "轉換中" : "執行"}</span>
        </button>
      }
    >
      {loading && <Loading label="產出 fhir_conversion_outputs.json" />}
      {error && (
        <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}
      {json && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2"><h3 className="text-sm font-medium">fhir_conversion_outputs.json</h3><span className="text-[10px] text-gray-500">可展開/收合 · 可捲動</span></div>
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

