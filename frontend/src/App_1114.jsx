
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

  const run = async () => {
    setError("");
    setLoading(true);
    setJson(null);
    try {
      const res = await fetch("/api/process-data", { method: "POST" });
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
        <button
          onClick={run}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? <Spinner /> : null}
          <span>{loading ? "處理中" : "執行"}</span>
        </button>
      }
    >
      {loading && <Loading label="生成 output.json" />}
      {error && (
        <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}
      {json && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2"><h3 className="text-sm font-medium">output.json</h3><span className="text-[10px] text-gray-500">可展開/收合 · 可捲動</span></div>​
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

  const [targetFile, setTargetFile] = useState("fhir_conversion_outputs.json");
  const [availableFiles, setAvailableFiles] = useState([]);
  const [ig, setIg] = useState("tw.gov.mohw.nhi.pas#1.0.7");
  const igOptions = [
    "tw.gov.mohw.nhi.pas#1.0.7",
    "tw.gov.mohw.emr#0.2.0",
    "tw.gov.mohw.twcore#0.3.2",
  ];

  const [showFilePanel, setShowFilePanel] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [fileJson, setFileJson] = useState(null);
  const [fileJsonError, setFileJsonError] = useState("");

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/list-outputs");
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        const list = Array.isArray(data.files) ? data.files : [];
        setAvailableFiles(list);
        if (list.length > 0 && !list.includes("fhir_conversion_outputs.json")) {
          setTargetFile(list[0]);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const loadFileJson = async () => {
    setFileJsonError("");
    setFileJson(null);
    try {
      const res = await fetch(`/api/read-json?filename=${encodeURIComponent(targetFile)}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setFileJson(data);
    } catch (e) {
      setFileJsonError(String(e.message || e));
    }
  };

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
          <div className="flex items-center gap-3 w-full">
            <label className="text-sm text-gray-700 w-24">受檢檔案</label>
            <select
              value={targetFile}
              onChange={(e) => setTargetFile(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-sm"
              title="選擇受檢檔案 (*.json)"
            >
              {availableFiles.length === 0 ? (
                <option value="fhir_conversion_outputs.json">fhir_conversion_outputs.json</option>
              ) : (
                availableFiles.map(f => <option key={f} value={f}>{f}</option>)
              )}
            </select>
            <span className="text-sm text-blue-700 underline truncate max-w-[20rem]" title={targetFile}>{targetFile}</span>
          </div>

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
            <span className="text-sm text-purple-700 underline truncate max-w-[20rem]" title={ig}>{ig}</span>
          </div>

          <div className="flex items-center gap-3 w-full">
            <label className="text-sm text-gray-700 w-24">動作</label>
            <button
              onClick={run}
              disabled={loading}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 shadow-sm"
            >
              {loading ? <Spinner /> : null}
              <span className="text-base">{loading ? "驗證中" : "執行驗證"}</span>
            </button>
          </div>
        </div>
      }
    >
      {status && (
        <div className="mb-4">
          {status.type === "success" ? (
            <StatusPill color="green" size="lg" label="Success (0)" />
          ) : (
            <StatusPill color="red" size="lg" label={`Error (${status.count ?? 0})`} />
          )}
        </div>
      )}

      {errMsg && (
        <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
          {errMsg}
        </div>
      )}

      <div className="mt-3">
        <button
          onClick={async () => { 
            const next = !showFilePanel; 
            setShowFilePanel(next); 
            if (next) await loadFileJson(); 
          }}
          className="text-sm px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
        >
          {showFilePanel ? "收合受檢檔案內容" : "顯示受檢檔案內容"}
        </button>
        {showFilePanel && (
          <div className="mt-3">
            {fileJsonError && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{fileJsonError}</div>
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

      {!!errors?.length && (
        <div className="mb-4 mt-4">
          <h3 className="text-sm font-medium mb-2">Error Rows</h3>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            {errors.map((line, idx) => (
              <li key={idx} className="whitespace-pre-wrap">{line}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-3">
        <button
          onClick={() => setShowLog(v => !v)}
          className="text-sm px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
        >
          {showLog ? "收合驗證 Log" : "顯示驗證 Log"}
        </button>
        {showLog && logText && (
          <div className="mt-2">
            <h3 className="text-sm font-medium mb-2">Log</h3>
            <div className="max-h-[40vh] overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
              <pre className="text-sm whitespace-pre-wrap">{logText}</pre>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}function StatusPill({ color, label, size = 'md' }) {
  const colorMap = {
    green: {
      dot: "bg-green-500",
      text: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-200",
    },
    red: {
      dot: "bg-red-500",
      text: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
    },
  }[color];

  const sizeMap = size === 'lg' ? { dot: 'h-3.5 w-3.5', text: 'text-base' } : { dot: 'h-2.5 w-2.5', text: 'text-sm' };
  return (
    <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full ${colorMap.bg} ${colorMap.border} border` }>
      <span className={`${sizeMap.dot} rounded-full ${colorMap.dot}`} />
      <span className={`${colorMap.text} font-semibold ${sizeMap.text}`}>{label}</span>
    </div>
  );
}


