import { useState } from "react";
import {
  Landmark,
  ArrowLeftRight,
  ShieldCheck,
  Globe2,
  FileBarChart2,
  Smartphone,
  ChevronDown,
  Lock,
  Plus,
  Trash2,
  CircleDot,
  Check,
} from "lucide-react";

const TOKENS = {
  primary: "#7a00df",
  bright: "#7f30ff",
  surface: "#ebebeb",
  ink: "#150f1e",
  inkMuted: "#6f6a78",
  border: "#dcd8e2",
  borderStrong: "#c7c1d3",
  white: "#ffffff",
  success: "#1a9c6d",
  successBg: "#e6f5ee",
};

const DOMAINS = [
  { key: "core", label: "Core Banking", icon: Landmark, live: true },
  { key: "screening", label: "OFAC / Screening", icon: ShieldCheck, live: false },
  { key: "payments", label: "Payment Rails", icon: ArrowLeftRight, live: false },
  { key: "trade", label: "Foreign trade", icon: Globe2, live: false },
  { key: "reporting", label: "Reporting", icon: FileBarChart2, live: false },
  { key: "digital", label: "Digital Channel", icon: Smartphone, live: false },
];

const CORE_PROVIDERS = [
  { name: "Fiserv", flavours: ["Cleartouch", "Premier", "DNA"] },
  { name: "FIS", flavours: ["Profile", "Modern Banking Platform"] },
  { name: "Finxact", flavours: ["Standard"] },
  { name: "Jack Henry", flavours: ["SilverLake", "CIF"] },
  { name: "Temenos", flavours: ["Transact"] },
  { name: "Custom / other core", flavours: ["Custom"] },
];

const AUTH_TYPES = ["OAuth 2.0 (Client Credentials)", "API Key + Secret", "Mutual TLS (mTLS)", "JWT Bearer Token", "Basic Authentication"];
const AUTH_FIELD_CONFIG = {
  "OAuth 2.0 (Client Credentials)": ["Token URL", "Client ID", "Client Secret", "Scope (optional)"],
  "API Key + Secret": ["API Key", "API Secret", "API Base URL"],
  "Mutual TLS (mTLS)": ["Client Certificate", "Client Private Key", "Certificate Password (optional)", "CA / Root Certificate (optional)"],
  "JWT Bearer Token": ["JWT Token", "JWT Issuer (iss)", "JWT Audience (optional)"],
  "Basic Authentication": ["Username", "Password"],
};

const METHODS = ["GET", "POST", "PUT", "PATCH"];
const ENV_TYPES = ["Dev", "UAT", "Prod"];

const STATUS_CATEGORIES = [
  { key: "Succeeded", options: ["200 OK", "201 Created"] },
  { key: "Failed due to client input", options: ["400 Bad Request"] },
  { key: "Failed authentication", options: ["401 Unauthorized"] },
  { key: "Was not allowed", options: ["403 Forbidden"] },
  { key: "Resource not found", options: ["404 Not Found"] },
  { key: "Conflict / Duplicate", options: ["409 Conflict"] },
  { key: "Server failed", options: ["500 Internal Server Error"] },
  { key: "Service unavailable / Timeout", options: ["503 Service Unavailable", "504 Gateway Timeout"] },
];

const VALIDATION_FIELDS = ["Account Number", "Customer ID", "Routing Number", "Account Status", "Currency", "Amount Limits", "Branch", "Beneficiary", "Memo Post Eligibility"];

const VALIDATION_TYPES = ["Validate Account", "Validate Customer", "Validate Beneficiary", "Validate Routing Number", "Validate Memo Post", "Validate Funds Availability", "Validate Payment"];

function label(children) {
  return (
    <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: TOKENS.inkMuted, margin: "0 0 8px" }}>
      {children}
    </p>
  );
}

function selectStyle() {
  return { width: "100%", padding: "8px 10px", borderRadius: "8px", border: `1px solid ${TOKENS.border}`, fontSize: "13px", background: TOKENS.white, fontFamily: "'Inter', sans-serif" };
}
function inputStyle(mono) {
  return { width: "100%", padding: "8px 10px", borderRadius: "8px", border: `1px solid ${TOKENS.border}`, fontSize: "13px", outline: "none", fontFamily: mono ? "'IBM Plex Mono', monospace" : "'Inter', sans-serif" };
}

function SectionCard({ title, subtitle, children }) {
  return (
    <div style={{ border: `1px solid ${TOKENS.border}`, borderRadius: "16px", background: TOKENS.white, padding: "22px", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "19px", fontWeight: 600, margin: "0 0 4px", color: TOKENS.ink }}>{title}</h2>
        {subtitle && <p style={{ fontSize: "12.5px", color: TOKENS.inkMuted, margin: 0 }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Divider({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <span style={{ fontSize: "13px", fontWeight: 600, color: TOKENS.ink, whiteSpace: "nowrap" }}>{children}</span>
      <div style={{ flex: 1, height: "1px", background: TOKENS.border }} />
    </div>
  );
}

function JsonXmlToggle({ value, onChange }) {
  return (
    <div style={{ display: "flex", border: `1px solid ${TOKENS.border}`, borderRadius: "999px", overflow: "hidden" }}>
      {["JSON", "XML"].map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          style={{
            padding: "3px 12px",
            fontSize: "10.5px",
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            background: value === f ? TOKENS.primary : TOKENS.white,
            color: value === f ? "#fff" : TOKENS.inkMuted,
          }}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

function ContextField({ title, format, setFormat, raw, setRaw }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
        {label(title)}
        <JsonXmlToggle value={format} onChange={setFormat} />
      </div>
      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder={format === "JSON" ? '{\n  "field": "value"\n}' : "<Request>\n  <Field>value</Field>\n</Request>"}
        rows={4}
        style={{ ...inputStyle(true), resize: "vertical" }}
      />
    </div>
  );
}

function AuthBlock({ authType, setAuthType, authValues, setAuthValues }) {
  const fields = AUTH_FIELD_CONFIG[authType] || [];
  return (
    <div>
      {label("Auth")}
      <select value={authType} onChange={(e) => { setAuthType(e.target.value); setAuthValues({}); }} style={{ ...selectStyle(), marginBottom: "10px" }}>
        {AUTH_TYPES.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>
      <p style={{ fontSize: "11.5px", color: TOKENS.inkMuted, margin: "0 0 8px", fontStyle: "italic" }}>Fields for selected Auth type</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {fields.map((f) => (
          <input
            key={f}
            value={authValues[f] || ""}
            onChange={(e) => setAuthValues({ ...authValues, [f]: e.target.value })}
            placeholder={f}
            style={inputStyle(true)}
          />
        ))}
      </div>
    </div>
  );
}

function EnvironmentRows({ envs, setEnvs }) {
  const update = (i, key, val) => setEnvs(envs.map((e, idx) => (idx === i ? { ...e, [key]: val } : e)));
  const remove = (i) => setEnvs(envs.filter((_, idx) => idx !== i));
  const add = () => setEnvs([...envs, { type: "Dev", url: "" }]);
  return (
    <div>
      {label("Environment")}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "8px" }}>
        {envs.map((env, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "110px 1fr 28px", gap: "8px" }}>
            <select value={env.type} onChange={(e) => update(i, "type", e.target.value)} style={selectStyle()}>
              {ENV_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <input value={env.url} onChange={(e) => update(i, "url", e.target.value)} placeholder={`${env.type} - URL`} style={inputStyle(true)} />
            <button onClick={() => remove(i)} style={{ border: "none", background: "transparent", cursor: "pointer", color: TOKENS.inkMuted }} aria-label="Remove environment">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
      <button onClick={add} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", color: TOKENS.primary, background: "transparent", border: "none", cursor: "pointer", fontWeight: 500, padding: 0 }}>
        <Plus size={14} /> Add Env
      </button>
    </div>
  );
}

function MappingBlock({ note, rows, setRows }) {
  const update = (i, key, val) => setRows(rows.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)));
  const remove = (i) => setRows(rows.filter((_, idx) => idx !== i));
  const add = () => setRows([...rows, { source: "", target: "" }]);
  return (
    <div>
      {label("Mapping")}
      <p style={{ fontSize: "12.5px", color: TOKENS.inkMuted, margin: "0 0 10px" }}>{note}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 28px", gap: "8px", marginBottom: "6px" }}>
        {label("Core field")}
        {label("Finzly field")}
        <span />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "8px" }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 28px", gap: "8px" }}>
            <input value={r.source} onChange={(e) => update(i, "source", e.target.value)} placeholder="accountId" style={inputStyle(true)} />
            <input value={r.target} onChange={(e) => update(i, "target", e.target.value)} placeholder="account.number" style={inputStyle(true)} />
            <button onClick={() => remove(i)} style={{ border: "none", background: "transparent", cursor: "pointer", color: TOKENS.inkMuted }} aria-label="Remove row">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
      <button onClick={add} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", color: TOKENS.primary, background: "transparent", border: "none", cursor: "pointer", fontWeight: 500, padding: 0 }}>
        <Plus size={14} /> Add mapping row
      </button>
    </div>
  );
}

function StatusCodesBlock({ selections, setSelections, extras, setExtras }) {
  const setSel = (key, val) => setSelections({ ...selections, [key]: val });
  const updateExtra = (i, k, v) => setExtras(extras.map((e, idx) => (idx === i ? { ...e, [k]: v } : e)));
  const removeExtra = (i) => setExtras(extras.filter((_, idx) => idx !== i));
  const addExtra = () => setExtras([...extras, { code: "", meaning: "" }]);

  return (
    <div>
      {label("Status Codes")}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "10px" }}>
        {STATUS_CATEGORIES.map((c) => (
          <div key={c.key} style={{ display: "grid", gridTemplateColumns: "1fr 150px", gap: "10px", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: TOKENS.ink }}>{c.key}</span>
            <select value={selections[c.key] || ""} onChange={(e) => setSel(c.key, e.target.value)} style={selectStyle()}>
              <option value="">Select</option>
              {c.options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {extras.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "8px" }}>
          {extras.map((ex, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 28px", gap: "8px" }}>
              <input value={ex.code} onChange={(e) => updateExtra(i, "code", e.target.value)} placeholder="e.g. 422" style={inputStyle(true)} />
              <input value={ex.meaning} onChange={(e) => updateExtra(i, "meaning", e.target.value)} placeholder="Unprocessable entity" style={inputStyle(false)} />
              <button onClick={() => removeExtra(i)} style={{ border: "none", background: "transparent", cursor: "pointer", color: TOKENS.inkMuted }} aria-label="Remove code">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
      <button onClick={addExtra} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", color: TOKENS.primary, background: "transparent", border: "none", cursor: "pointer", fontWeight: 500, padding: 0 }}>
        <Plus size={14} /> More Status codes
      </button>
    </div>
  );
}

function EndpointsTable({ rows, setRows }) {
  const update = (i, key, val) => setRows(rows.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)));
  const remove = (i) => setRows(rows.filter((_, idx) => idx !== i));
  const add = () => setRows([...rows, { method: "GET", endpoint: "", description: "" }]);
  return (
    <div>
      {label("Endpoints")}
      <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 1fr 28px", gap: "8px", marginBottom: "6px" }}>
        {label("Method")}
        {label("Endpoint")}
        {label("Description")}
        <span />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "8px" }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "90px 1fr 1fr 28px", gap: "8px" }}>
            <select value={r.method} onChange={(e) => update(i, "method", e.target.value)} style={{ ...selectStyle(), fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px" }}>
              {METHODS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <input value={r.endpoint} onChange={(e) => update(i, "endpoint", e.target.value)} placeholder="/getaccount" style={inputStyle(true)} />
            <input value={r.description} onChange={(e) => update(i, "description", e.target.value)} placeholder="Get all accounts" style={inputStyle(false)} />
            <button onClick={() => remove(i)} style={{ border: "none", background: "transparent", cursor: "pointer", color: TOKENS.inkMuted }} aria-label="Remove endpoint">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
      <button onClick={add} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", color: TOKENS.primary, background: "transparent", border: "none", cursor: "pointer", fontWeight: 500, padding: 0 }}>
        <Plus size={14} /> Add endpoint
      </button>
    </div>
  );
}

function ValidationCriteriaList({ items, setItems }) {
  const update = (i, val) => setItems(items.map((it, idx) => (idx === i ? val : it)));
  const remove = (i) => setItems(items.filter((_, idx) => idx !== i));
  const add = () => setItems([...items, ""]);
  return (
    <div>
      {label("Validation Criteria — what needs to be validated")}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "8px" }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 28px", gap: "8px" }}>
            <input value={it} onChange={(e) => update(i, e.target.value)} placeholder="e.g. Account Number" style={inputStyle(false)} />
            <button onClick={() => remove(i)} style={{ border: "none", background: "transparent", cursor: "pointer", color: TOKENS.inkMuted }} aria-label="Remove field">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
      <button onClick={add} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", color: TOKENS.primary, background: "transparent", border: "none", cursor: "pointer", fontWeight: 500, padding: 0 }}>
        <Plus size={14} /> Add validation Url
      </button>
    </div>
  );
}

function ValidationChecklist({ selections, setSelections, extras, setExtras }) {
  const toggle = (key) => setSelections({ ...selections, [key]: !selections[key] });
  const updateExtra = (i, val) => setExtras(extras.map((e, idx) => (idx === i ? val : e)));
  const removeExtra = (i) => setExtras(extras.filter((_, idx) => idx !== i));
  const addExtra = () => setExtras([...extras, ""]);

  return (
    <div>
      {label("Validation types")}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "10px" }}>
        {VALIDATION_TYPES.map((v) => {
          const on = !!selections[v];
          return (
            <button
              key={v}
              onClick={() => toggle(v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: `1px solid ${on ? TOKENS.primary : TOKENS.border}`,
                background: on ? "#f6ecfd" : TOKENS.white,
                color: on ? TOKENS.primary : TOKENS.ink,
                borderRadius: "8px",
                padding: "8px 12px",
                fontSize: "13px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "5px",
                  border: `1.5px solid ${on ? TOKENS.primary : TOKENS.borderStrong}`,
                  background: on ? TOKENS.primary : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {on && <Check size={11} color="#fff" strokeWidth={3} />}
              </span>
              {v}
            </button>
          );
        })}
      </div>

      {extras.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "8px" }}>
          {extras.map((ex, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 28px", gap: "8px" }}>
              <input value={ex} onChange={(e) => updateExtra(i, e.target.value)} placeholder="Custom validation type" style={inputStyle(false)} />
              <button onClick={() => removeExtra(i)} style={{ border: "none", background: "transparent", cursor: "pointer", color: TOKENS.inkMuted }} aria-label="Remove validation">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
      <button onClick={addExtra} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", color: TOKENS.primary, background: "transparent", border: "none", cursor: "pointer", fontWeight: 500, padding: 0 }}>
        <Plus size={14} /> Add More Validations
      </button>
    </div>
  );
}

export default function GalaxyLaunchpadWireframe() {
  // Provider / flavour (shared across the page, as sketched)
  const [provider, setProvider] = useState("Fiserv");
  const [flavour, setFlavour] = useState("Premier");
  const currentProvider = CORE_PROVIDERS.find((p) => p.name === provider) || CORE_PROVIDERS[0];

  // Account Inquiry
  const [aiUrl, setAiUrl] = useState("");
  const [aiEndpoints, setAiEndpoints] = useState([{ method: "GET", endpoint: "/getaccount", description: "Get all accounts" }]);
  const [aiAuthType, setAiAuthType] = useState("OAuth 2.0 (Client Credentials)");
  const [aiAuthValues, setAiAuthValues] = useState({});
  const [aiReqFormat, setAiReqFormat] = useState("JSON");
  const [aiReqRaw, setAiReqRaw] = useState("");
  const [aiResFormat, setAiResFormat] = useState("JSON");
  const [aiResRaw, setAiResRaw] = useState("");
  const [aiEnvs, setAiEnvs] = useState([{ type: "Dev", url: "" }]);
  const [aiMappingRows, setAiMappingRows] = useState([{ source: "", target: "" }]);
  const [aiStatus, setAiStatus] = useState({});
  const [aiStatusExtras, setAiStatusExtras] = useState([]);

  // Memo Post
  const [mpMethod, setMpMethod] = useState("POST");
  const [mpUrl, setMpUrl] = useState("");
  const [mpAuthType, setMpAuthType] = useState("OAuth 2.0 (Client Credentials)");
  const [mpAuthValues, setMpAuthValues] = useState({});
  const [mpReqFormat, setMpReqFormat] = useState("JSON");
  const [mpReqRaw, setMpReqRaw] = useState("");
  const [mpResFormat, setMpResFormat] = useState("JSON");
  const [mpResRaw, setMpResRaw] = useState("");
  const [mpMappingRows, setMpMappingRows] = useState([{ source: "", target: "" }]);
  const [mpStatus, setMpStatus] = useState({});
  const [mpStatusExtras, setMpStatusExtras] = useState([]);

  // Validation
  const [vlMethod, setVlMethod] = useState("GET");
  const [vlUrl, setVlUrl] = useState("");
  const [vlAuthType, setVlAuthType] = useState("OAuth 2.0 (Client Credentials)");
  const [vlAuthValues, setVlAuthValues] = useState({});
  const [vlCriteria, setVlCriteria] = useState(VALIDATION_FIELDS.slice(0, 3));
  const [vlReqFormat, setVlReqFormat] = useState("JSON");
  const [vlReqRaw, setVlReqRaw] = useState("");
  const [vlResFormat, setVlResFormat] = useState("JSON");
  const [vlResRaw, setVlResRaw] = useState("");
  const [vlEnvs, setVlEnvs] = useState([{ type: "Dev", url: "" }]);
  const [vlMappingRows, setVlMappingRows] = useState([{ source: "", target: "" }]);
  const [vlStatus, setVlStatus] = useState({});
  const [vlStatusExtras, setVlStatusExtras] = useState([]);
  const [vlTypes, setVlTypes] = useState({ "Validate Account": true, "Validate Customer": true, "Validate Beneficiary": true, "Validate Routing Number": true, "Validate Memo Post": true });
  const [vlTypeExtras, setVlTypeExtras] = useState([]);

  const [services, setServices] = useState(1);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: TOKENS.surface, minHeight: "100vh", color: TOKENS.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        input:focus, select:focus, textarea:focus { border-color: ${TOKENS.primary} !important; box-shadow: 0 0 0 3px rgba(122,0,223,0.12); }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px", background: TOKENS.ink, color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "26px", height: "26px", borderRadius: "7px", background: `linear-gradient(135deg, ${TOKENS.primary}, ${TOKENS.bright})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CircleDot size={15} color="#fff" strokeWidth={2.2} />
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "15.5px", letterSpacing: "-0.01em" }}>FINZLY</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <span style={{ fontSize: "12.5px", fontFamily: "'IBM Plex Mono', monospace", color: "#c9c2d6" }}>&lt;tenant&gt;</span>
          <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: TOKENS.bright, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 600 }}>U</div>
        </div>
      </div>

      <div style={{ display: "flex", maxWidth: "1180px", margin: "0 auto" }}>
        <div style={{ width: "220px", flexShrink: 0, padding: "24px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {DOMAINS.map((d) => {
            const Icon = d.icon;
            return (
              <div key={d.key} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "9px", fontSize: "13.5px", fontWeight: d.live ? 600 : 500, color: d.live ? TOKENS.primary : TOKENS.inkMuted, background: d.live ? "#f2e6fc" : "transparent", opacity: d.live ? 1 : 0.75 }}>
                <Icon size={16} strokeWidth={1.8} />
                <span style={{ flex: 1 }}>{d.label}</span>
                {!d.live && <Lock size={12} strokeWidth={2} />}
              </div>
            );
          })}
        </div>

        <div style={{ flex: 1, padding: "24px 24px 60px", minWidth: 0, display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "24px", fontWeight: 600, margin: 0 }}>Core Banking</h1>
            <div style={{ display: "flex", gap: "10px" }}>
              <select
                value={provider}
                onChange={(e) => {
                  const next = CORE_PROVIDERS.find((p) => p.name === e.target.value);
                  setProvider(e.target.value);
                  setFlavour(next.flavours[0]);
                }}
                style={{ ...selectStyle(), width: "160px" }}
              >
                {CORE_PROVIDERS.map((p) => (
                  <option key={p.name}>{p.name}</option>
                ))}
              </select>
              <select value={flavour} onChange={(e) => setFlavour(e.target.value)} style={{ ...selectStyle(), width: "140px" }}>
                {currentProvider.flavours.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Account Inquiry */}
          <SectionCard title="Account Inquiry">
            <div>
              {label("URL")}
              <input value={aiUrl} onChange={(e) => setAiUrl(e.target.value)} placeholder="https://core.bank.com/inquiry" style={inputStyle(true)} />
            </div>
            <EndpointsTable rows={aiEndpoints} setRows={setAiEndpoints} />
            <Divider>Auth</Divider>
            <AuthBlock authType={aiAuthType} setAuthType={setAiAuthType} authValues={aiAuthValues} setAuthValues={setAiAuthValues} />
            <Divider>Request / Response</Divider>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <ContextField title="Request" format={aiReqFormat} setFormat={setAiReqFormat} raw={aiReqRaw} setRaw={setAiReqRaw} />
              <ContextField title="Response" format={aiResFormat} setFormat={setAiResFormat} raw={aiResRaw} setRaw={setAiResRaw} />
            </div>
            <EnvironmentRows envs={aiEnvs} setEnvs={setAiEnvs} />
            <Divider>Mapping</Divider>
            <MappingBlock note="Map the request/response fields between Finzly and the Core Banking System." rows={aiMappingRows} setRows={setAiMappingRows} />
            <Divider>Status</Divider>
            <StatusCodesBlock selections={aiStatus} setSelections={setAiStatus} extras={aiStatusExtras} setExtras={setAiStatusExtras} />
          </SectionCard>

          {/* Memo Post */}
          <SectionCard title="Memo Post">
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "12px" }}>
              <div>
                {label("Method")}
                <select value={mpMethod} onChange={(e) => setMpMethod(e.target.value)} style={selectStyle()}>
                  {METHODS.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                {label("URL")}
                <input value={mpUrl} onChange={(e) => setMpUrl(e.target.value)} placeholder="https://core.bank.com/memo/hold" style={inputStyle(true)} />
              </div>
            </div>
            <Divider>Auth</Divider>
            <AuthBlock authType={mpAuthType} setAuthType={setMpAuthType} authValues={mpAuthValues} setAuthValues={setMpAuthValues} />
            <Divider>Request / Response</Divider>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <ContextField title="Request" format={mpReqFormat} setFormat={setMpReqFormat} raw={mpReqRaw} setRaw={setMpReqRaw} />
              <ContextField title="Response" format={mpResFormat} setFormat={setMpResFormat} raw={mpResRaw} setRaw={setMpResRaw} />
            </div>
            <Divider>Mapping</Divider>
            <MappingBlock note="Map the request/response fields between Finzly and the Core Banking System. Map the Memo Post APIs (create, reverse, status)." rows={mpMappingRows} setRows={setMpMappingRows} />
            <Divider>Status</Divider>
            <StatusCodesBlock selections={mpStatus} setSelections={setMpStatus} extras={mpStatusExtras} setExtras={setMpStatusExtras} />
          </SectionCard>

          {/* Validation */}
          <SectionCard title="Validation">
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "12px" }}>
              <div>
                {label("API method")}
                <select value={vlMethod} onChange={(e) => setVlMethod(e.target.value)} style={selectStyle()}>
                  {METHODS.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                {label("URL")}
                <input value={vlUrl} onChange={(e) => setVlUrl(e.target.value)} placeholder="https://core.bank.com/validate" style={inputStyle(true)} />
              </div>
            </div>
            <Divider>Auth & Credentials</Divider>
            <AuthBlock authType={vlAuthType} setAuthType={setVlAuthType} authValues={vlAuthValues} setAuthValues={setVlAuthValues} />
            <Divider>Validation criteria</Divider>
            <ValidationCriteriaList items={vlCriteria} setItems={setVlCriteria} />
            <Divider>Request / Response</Divider>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <ContextField title="Request — context for validation" format={vlReqFormat} setFormat={setVlReqFormat} raw={vlReqRaw} setRaw={setVlReqRaw} />
              <ContextField title="Response" format={vlResFormat} setFormat={setVlResFormat} raw={vlResRaw} setRaw={setVlResRaw} />
            </div>
            <EnvironmentRows envs={vlEnvs} setEnvs={setVlEnvs} />
            <Divider>Mapping</Divider>
            <MappingBlock note="Map the request/response fields between Finzly and the Core Banking System." rows={vlMappingRows} setRows={setVlMappingRows} />
            <Divider>Status</Divider>
            <StatusCodesBlock selections={vlStatus} setSelections={setVlStatus} extras={vlStatusExtras} setExtras={setVlStatusExtras} />
            <Divider>Validation types</Divider>
            <ValidationChecklist selections={vlTypes} setSelections={setVlTypes} extras={vlTypeExtras} setExtras={setVlTypeExtras} />
          </SectionCard>

          <button
            onClick={() => setServices((s) => s + 1)}
            style={{
              alignSelf: "flex-start",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#fff",
              background: `linear-gradient(135deg, ${TOKENS.primary}, ${TOKENS.bright})`,
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              padding: "12px 20px",
            }}
          >
            <Plus size={16} /> Add another Core Banking Service
          </button>
        </div>
      </div>
    </div>
  );
}
