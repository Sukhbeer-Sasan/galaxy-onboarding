"use client";

import { useState } from "react";
import {
  Landmark,
  Wallet,
  ClipboardCheck,
  Settings2,
  ChevronDown,
  Plus,
  Trash2,
  Plug,
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
  danger: "#c0392b",
};

const SCENARIOS = [
  { key: "specific", title: "Bank has its own core", desc: "Connect only the specific capabilities they need from us." },
  { key: "full", title: "Finzly fronts the core", desc: "We sit in front of the core for every capability below." },
  { key: "hybrid", title: "Hybrid / custom", desc: "Mixed setup — some capabilities native, some custom-built." },
];

const AUTH_OPTIONS = [
  "OAuth 2.0 (Client credentials)",
  "API key + secret",
  "Mutual TLS (mTLS)",
  "JWT bearer token",
  "Basic auth",
];

const CONNECTION_OPTIONS = [
  "Real-time REST",
  "Real-time SOAP / XML",
  "Async + callback",
  "Batch / EOD file",
  "ISO 8583",
];

const METHODS = ["GET", "POST", "PUT", "PATCH"];
const ENV_TYPES = ["Dev", "UAT", "Prod"];

const STATUS_CATEGORIES_EXTENDED = [
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

const CORE_PROVIDERS = [
  { name: "Fiserv", flavours: ["Cleartouch", "Premier", "DNA"] },
  { name: "FIS", flavours: ["Profile", "Modern Banking Platform"] },
  { name: "Finxact", flavours: ["Standard"] },
  { name: "Jack Henry", flavours: ["SilverLake", "CIF"] },
  { name: "Temenos", flavours: ["Transact"] },
  { name: "Wells Fargo", flavours: ["Correspondent API"] },
  { name: "MCB", flavours: ["Standard"] },
  { name: "Custom / other core", flavours: ["Custom"] },
];

const FLAVOUR_HINTS = {
  Cleartouch: "Typically batch / EOD fixed-width files, limited real-time.",
  Premier: "Real-time REST for balances, nightly batch for postings.",
  DNA: "Real-time SOAP / XML services (IBS).",
  Profile: "Real-time REST, well-documented modern API.",
  "Modern Banking Platform": "Real-time REST, event-driven callbacks available.",
  Standard: "Real-time REST.",
  SilverLake: "Real-time SOAP / XML, some batch reporting.",
  CIF: "Mostly batch / EOD file exchange.",
  Transact: "Real-time REST, strong async callback support.",
  "Correspondent API": "Real-time REST via correspondent banking gateway.",
  Custom: "Connection shape defined entirely below.",
};

const CAPABILITY_OPTIONS = ["Account inquiry", "Memo post", "Validate", "Custom core facility"];
const CAPABILITY_ABBR = {
  "Account inquiry": "AI",
  "Memo post": "Memo",
  Validate: "VAL",
  "Custom core facility": "Custom",
};

const VALIDATE_CHECKS = [
  { key: "Account existence / status" },
  { key: "Ownership / name match", extra: "fuzzy" },
  { key: "Available balance (NSF) check" },
  { key: "Restriction / hold check" },
  { key: "Routing (ABA / SWIFT / BIC) validation", extra: "directory" },
  { key: "Currency / product eligibility" },
];

const AUTH_TYPES = ["OAuth 2.0 (Client Credentials)", "API Key + Secret", "Mutual TLS (mTLS)", "JWT Bearer Token", "Basic Authentication"];
const AUTH_FIELD_CONFIG = {
  "OAuth 2.0 (Client Credentials)": ["Token URL", "Client ID", "Client Secret", "Scope (optional)"],
  "API Key + Secret": ["API Key", "API Secret", "API Base URL"],
  "Mutual TLS (mTLS)": ["Client Certificate", "Client Private Key", "Certificate Password (optional)", "CA / Root Certificate (optional)"],
  "JWT Bearer Token": ["JWT Token", "JWT Issuer (iss)", "JWT Audience (optional)"],
  "Basic Authentication": ["Username", "Password"],
};

// Memo Post status: how the API response maps to what actually happened.
const STATUS_CATEGORIES = [
  { key: "Succeeded", defaultCodes: "200, 201", required: true },
  { key: "Failed — client input", defaultCodes: "400", required: true },
  { key: "Failed authentication", defaultCodes: "401", required: true },
  { key: "Not allowed", defaultCodes: "403", required: true },
  { key: "Resource not found", defaultCodes: "404", required: true },
  { key: "Conflict / duplicate", defaultCodes: "409", required: false },
  { key: "Server failed", defaultCodes: "500", required: true },
  { key: "Service unavailable / timeout", defaultCodes: "503", required: true },
];


function selectStyle(mono) {
  return {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "8px",
    border: `1px solid ${TOKENS.border}`,
    fontSize: "13px",
    fontFamily: mono ? "'IBM Plex Mono', monospace" : "'Inter', sans-serif",
    background: TOKENS.white,
  };
}

function inputStyle(mono) {
  return {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "8px",
    border: `1px solid ${TOKENS.border}`,
    fontSize: "13px",
    fontFamily: mono ? "'IBM Plex Mono', monospace" : "'Inter', sans-serif",
    outline: "none",
  };
}

function Checkbox({ label, checked, onChange, mono }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "7px 10px",
        borderRadius: "8px",
        border: `1px solid ${checked ? TOKENS.primary : TOKENS.border}`,
        background: checked ? "#f6ecfd" : TOKENS.white,
        cursor: "pointer",
        fontSize: "13px",
        color: checked ? TOKENS.primary : TOKENS.ink,
        fontFamily: mono ? "'IBM Plex Mono', monospace" : "'Inter', sans-serif",
        userSelect: "none",
      }}
    >
      <input type="checkbox" checked={checked} onChange={onChange} style={{ accentColor: TOKENS.primary, width: "14px", height: "14px" }} />
      {label}
    </label>
  );
}

function Radio({ label, name, checked, onChange, mono }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "7px 10px",
        borderRadius: "8px",
        border: `1px solid ${checked ? TOKENS.primary : TOKENS.border}`,
        background: checked ? "#f6ecfd" : TOKENS.white,
        cursor: "pointer",
        fontSize: "13px",
        color: checked ? TOKENS.primary : TOKENS.ink,
        fontFamily: mono ? "'IBM Plex Mono', monospace" : "'Inter', sans-serif",
        userSelect: "none",
      }}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} style={{ accentColor: TOKENS.primary, width: "14px", height: "14px" }} />
      {label}
    </label>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: TOKENS.inkMuted, margin: "0 0 8px" }}>
      {children}
    </p>
  );
}

function Divider({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "16px", marginBottom: "16px" }}>
      <span style={{ fontSize: "13px", fontWeight: 600, color: TOKENS.ink, whiteSpace: "nowrap" }}>{children}</span>
      <div style={{ flex: 1, height: "1px", background: TOKENS.border }} />
    </div>
  );
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
        <SectionLabel>{title}</SectionLabel>
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

// function AuthBlockWireframe({ authType, setAuthType, authValues, setAuthValues }) {
//   const fields = AUTH_FIELD_CONFIG[authType] || [];
//   const changeType = (t) => {
//     setAuthType(t);
//     setAuthValues({});
//   };

//   return (
//     <div>
//       <SectionLabel>Auth</SectionLabel>
//       <select value={authType} onChange={(e) => changeType(e.target.value)} style={{ ...selectStyle(false), marginBottom: "10px" }}>
//         {AUTH_TYPES.map((t) => (
//           <option key={t}>{t}</option>
//         ))}
//       </select>
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
//         {fields.map((f) => (
//           <div key={f.key}>
//             <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 8px", color: TOKENS.inkMuted }}>
//               {f.label}
//               {f.required ? <span style={{ color: TOKENS.danger }}> *</span> : <span style={{ fontStyle: "italic", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}> (optional)</span>}
//             </p>
//             <input
//               type={f.secret ? "password" : "text"}
//               value={authValues[f.key] || ""}
//               onChange={(e) => setAuthValues({ ...authValues, [f.key]: e.target.value })}
//               placeholder={f.placeholder}
//               style={inputStyle(true)}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

function AuthBlockWireframe({ authType, setAuthType, authValues, setAuthValues }) {
  const fields = AUTH_FIELD_CONFIG[authType] || [];

  return (
    <div>
      <SectionLabel>Auth</SectionLabel>
      <select value={authType} onChange={(e) => { setAuthType(e.target.value); setAuthValues({}); }} style={{ ...selectStyle(false), marginBottom: "10px" }}>
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

function makeEnv() {
  return { type: "Dev", url: "", baseUrl: "", authType: "OAuth 2.0 (Client Credentials)", authValues: {} };
}

function EnvironmentRows({ envs, setEnvs }) {
  const update = (i, patch) => setEnvs(envs.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  const remove = (i) => setEnvs(envs.filter((_, idx) => idx !== i));
  const add = () => setEnvs([...envs, makeEnv()]);
  return (
    <div>
      <SectionLabel>Environment</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "10px" }}>
        {envs.map((env, i) => (
          <div key={i} style={{ border: `1px solid ${TOKENS.border}`, borderRadius: "12px", background: TOKENS.white, padding: "14px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <select value={env.type} onChange={(e) => update(i, { type: e.target.value })} style={{ ...selectStyle(false), maxWidth: "140px" }}>
                {ENV_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <span style={{ flex: 1 }} />
              <button onClick={() => remove(i)} style={{ border: "none", background: "transparent", cursor: "pointer", color: TOKENS.inkMuted, display: "flex" }} aria-label="Remove environment">
                <Trash2 size={15} />
              </button>
            </div>
            <div>
              <SectionLabel>Base URL</SectionLabel>
              <input value={env.baseUrl} onChange={(e) => update(i, { baseUrl: e.target.value })} placeholder="https://core.bank.com/" style={inputStyle(true)} />
            </div>
            <div>
              <SectionLabel>URL</SectionLabel>
              <input value={env.url} onChange={(e) => update(i, { url: e.target.value })} placeholder={`${env.type} - URL`} style={inputStyle(true)} />
            </div>
            <AuthBlockWireframe authType={env.authType} setAuthType={(v) => update(i, { authType: v })} authValues={env.authValues} setAuthValues={(v) => update(i, { authValues: v })} />
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
      <SectionLabel>Mapping</SectionLabel>
      <p style={{ fontSize: "12.5px", color: TOKENS.inkMuted, margin: "0 0 10px" }}>{note}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 28px", gap: "8px", marginBottom: "6px" }}>
        <SectionLabel>Request field</SectionLabel>
        <SectionLabel>Finzly field</SectionLabel>
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
      <SectionLabel>Status Codes</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "10px" }}>
        {STATUS_CATEGORIES_EXTENDED.map((c) => (
          <div key={c.key} style={{ display: "grid", gridTemplateColumns: "1fr 150px", gap: "10px", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: TOKENS.ink }}>{c.key}</span>
            <select value={selections[c.key] || ""} onChange={(e) => setSel(c.key, e.target.value)} style={selectStyle(false)}>
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
      <SectionLabel>Endpoints</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 1fr 28px", gap: "8px", marginBottom: "6px" }}>
        <SectionLabel>Method</SectionLabel>
        <SectionLabel>Endpoint</SectionLabel>
        <SectionLabel>Description</SectionLabel>
        <span />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "8px" }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "90px 1fr 1fr 28px", gap: "8px" }}>
            <select value={r.method} onChange={(e) => update(i, "method", e.target.value)} style={{ ...selectStyle(false), fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px" }}>
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
      <SectionLabel>Validation Criteria — what needs to be validated</SectionLabel>
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
        <Plus size={14} /> Add validation field
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
      <SectionLabel>Validation types</SectionLabel>
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
                  border: `1.5px solid ${on ? TOKENS.primary : "#c7c1d3"}`,
                  background: on ? TOKENS.primary : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {on && "✓"}
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

function SubSectionHeader({ title, who }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", borderBottom: `1px solid ${TOKENS.border}`, paddingBottom: "8px" }}>
      <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "13.5px", fontWeight: 600, margin: 0, color: TOKENS.ink }}>{title}</h4>
      {who && <span style={{ fontSize: "11px", color: TOKENS.inkMuted, fontStyle: "italic" }}>{who}</span>}
    </div>
  );
}

function ProviderFlavourSelect({ provider, setProvider, flavour, setFlavour }) {
  const current = CORE_PROVIDERS.find((p) => p.name === provider) || CORE_PROVIDERS[0];
  const multi = current.flavours.length > 1;
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: multi ? "1fr 1fr" : "1fr", gap: "12px" }}>
        <div>
          <SectionLabel>Core provider</SectionLabel>
          <select
            value={provider}
            onChange={(e) => {
              const next = CORE_PROVIDERS.find((p) => p.name === e.target.value);
              setProvider(e.target.value);
              setFlavour(next.flavours[0]);
            }}
            style={selectStyle(false)}
          >
            {CORE_PROVIDERS.map((p) => (
              <option key={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
        {multi && (
          <div>
            <SectionLabel>Flavour</SectionLabel>
            <select value={flavour} onChange={(e) => setFlavour(e.target.value)} style={selectStyle(false)}>
              {current.flavours.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      {FLAVOUR_HINTS[flavour] && (
        <p style={{ fontSize: "11.5px", color: TOKENS.inkMuted, margin: "6px 0 0", fontStyle: "italic" }}>{FLAVOUR_HINTS[flavour]}</p>
      )}
    </div>
  );
}

function EnvironmentFields({ method, setMethod, sandbox, setSandbox, production, setProduction }) {
  return (
    <div>
      <div style={{ marginBottom: "12px", maxWidth: "150px" }}>
        <SectionLabel>Method</SectionLabel>
        <select value={method} onChange={(e) => setMethod(e.target.value)} style={selectStyle(true)}>
          {METHODS.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>
      {[
        ["Sandbox / UAT", sandbox, setSandbox],
        ["Production", production, setProduction],
      ].map(([label, env, setEnv]) => (
        <div key={label} style={{ marginBottom: "10px" }}>
          <SectionLabel>{label}</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <input value={env.url} onChange={(e) => setEnv({ ...env, url: e.target.value })} placeholder={`https://${label.startsWith("Sandbox") ? "sandbox." : ""}core.bank.com/endpoint`} style={inputStyle(true)} />
            <select value={env.auth} onChange={(e) => setEnv({ ...env, auth: e.target.value })} style={selectStyle(true)}>
              {AUTH_OPTIONS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}



const MAX_INQUIRY_APIS = 4;

function makeInquiryApi(n = 1) {
  return {
    id: `api-${Date.now()}-${n}`,
    endpoints: [{ method: "GET", endpoint: "/getaccount", description: "Get all accounts" }],
    reqFormat: "JSON", reqRaw: "", resFormat: "JSON", resRaw: "",
    mappingRows: [{ source: "", target: "" }],
    status: {}, statusExtras: [],
  };
}

function makeCoreConnection(n) {
  return {
    id: `conn-${Date.now()}-${n}`,
    provider: "Fiserv",
    flavour: "Premier",
    functionalities: CAPABILITY_OPTIONS.reduce((acc, c, i) => ({ ...acc, [c]: n === 1 && i === 0 }), {}),
    inquiry: { enabled: false, expanded: false, envs: [makeEnv()], apis: [makeInquiryApi(1)] },
    memo: { enabled: false, expanded: false, method: "POST", url: "", authType: "OAuth 2.0 (Client Credentials)", authValues: {}, reqFormat: "JSON", reqRaw: "", resFormat: "JSON", resRaw: "", mappingRows: [{ source: "", target: "" }], status: {}, statusExtras: [] },
    validate: { enabled: false, expanded: false, method: "GET", url: "", criteria: VALIDATION_FIELDS.slice(0, 3), reqFormat: "JSON", reqRaw: "", resFormat: "JSON", resRaw: "", envs: [makeEnv()], mappingRows: [{ source: "", target: "" }], status: {}, statusExtras: [], types: { "Validate Account": true, "Validate Customer": true, "Validate Beneficiary": true, "Validate Routing Number": true, "Validate Memo Post": true }, typeExtras: [] },
    custom: { enabled: false, expanded: false, protocol: "REST", auth: "OAuth 2.0 (Client credentials)", path: "", logic: "" },
  };
}

function CapabilityCard({ icon: Icon, title, subtitle, state, setState, children }) {
  const enabled = state.enabled;
  const expanded = state.expanded;
  return (
    <div style={{ border: `1px solid ${enabled ? TOKENS.primary : TOKENS.border}`, borderRadius: "14px", background: TOKENS.white, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 18px", cursor: "pointer" }} onClick={() => setState((s) => ({ ...s, expanded: enabled ? !s.expanded : s.expanded }))}>
        <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: enabled ? TOKENS.primary : TOKENS.surface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={19} color={enabled ? "#fff" : TOKENS.inkMuted} strokeWidth={1.8} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "15px", fontWeight: 600, margin: 0, color: TOKENS.ink }}>{title}</p>
          <p style={{ fontSize: "12.5px", color: TOKENS.inkMuted, margin: "2px 0 0" }}>{subtitle}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setState((s) => ({ ...s, enabled: !s.enabled, expanded: !s.enabled }));
          }}
          style={{ border: "none", outline: "none", width: "40px", height: "24px", borderRadius: "999px", background: enabled ? TOKENS.primary : "#d8d5de", position: "relative", cursor: "pointer", flexShrink: 0 }}
          aria-label={enabled ? "Disable capability" : "Enable capability"}
        >
          <span style={{ position: "absolute", top: "3px", left: enabled ? "19px" : "3px", width: "18px", height: "18px", borderRadius: "50%", background: "#fff", transition: "left 150ms ease", boxShadow: "0 1px 2px rgba(0,0,0,0.25)" }} />
        </button>
        <ChevronDown size={17} color={TOKENS.inkMuted} style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 150ms ease", opacity: enabled ? 1 : 0.3, flexShrink: 0 }} />
      </div>
      {enabled && expanded && (
        <div style={{ borderTop: `1px solid ${TOKENS.border}`, padding: "18px", background: "#fbfafd", display: "flex", flexDirection: "column", gap: "18px" }}>{children}</div>
      )}
    </div>
  );
}

function CoreConnectionCard({ conn, update, remove, canRemove }) {
  const set = (patch) => update({ ...conn, ...patch });
  const setInquiry = (fn) => {
    const newInquiry = typeof fn === 'function' ? fn(conn.inquiry) : { ...conn.inquiry, ...fn };
    set({ inquiry: newInquiry });
  };
  const setMemo = (fn) => {
    const newMemo = typeof fn === 'function' ? fn(conn.memo) : { ...conn.memo, ...fn };
    set({ memo: newMemo });
  };
  const setValidate = (fn) => {
    const newValidate = typeof fn === 'function' ? fn(conn.validate) : { ...conn.validate, ...fn };
    set({ validate: newValidate });
  };
  const setCustom = (fn) => {
    const newCustom = typeof fn === 'function' ? fn(conn.custom) : { ...conn.custom, ...fn };
    set({ custom: newCustom });
  };
  const setApi = (apiId, patch) => setInquiry((inq) => ({ ...inq, apis: inq.apis.map((a) => (a.id === apiId ? { ...a, ...patch } : a)) }));
  const addApi = () => setInquiry((inq) => (inq.apis.length >= MAX_INQUIRY_APIS ? inq : { ...inq, apis: [...inq.apis, makeInquiryApi(inq.apis.length + 1)] }));
  const removeApi = (apiId) => setInquiry((inq) => ({ ...inq, apis: inq.apis.filter((a) => a.id !== apiId) }));

  return (
    <div style={{ border: `1px solid ${TOKENS.border}`, borderRadius: "12px", background: TOKENS.white, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px", background: "#f7f4fa" }}>
        <Plug size={15} color={TOKENS.primary} />
        <span style={{ flex: 1, fontSize: "14px", fontWeight: 600, color: TOKENS.ink }}>{conn.provider} — {conn.flavour}</span>
        {canRemove && (
          <button onClick={() => remove(conn.id)} style={{ border: "none", background: "transparent", cursor: "pointer", color: TOKENS.inkMuted, display: "flex" }} aria-label="Remove core connection">
            <Trash2 size={14} />
          </button>
        )}
      </div>

      
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
        <ProviderFlavourSelect provider={conn.provider} setProvider={(v) => set({ provider: v })} flavour={conn.flavour} setFlavour={(v) => set({ flavour: v })} />
            <EnvironmentRows envs={conn.inquiry.envs} setEnvs={(v) => setInquiry({ envs: v })} />

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <CapabilityCard icon={Wallet} title="Account inquiry" subtitle="Balances, statements, account details, holds" state={conn.inquiry} setState={setInquiry}>
            {conn.inquiry.apis.map((api, idx) => (
              <div key={api.id} style={{ border: `1px solid ${TOKENS.border}`, borderRadius: "12px", background: TOKENS.white, padding: "16px", display: "flex", flexDirection: "column", gap: "18px" }}>
                <SubSectionHeader title={`API ${idx + 1}`} who={conn.inquiry.apis.length > 1 ? (
                  <button onClick={() => removeApi(api.id)} style={{ border: "none", background: "transparent", cursor: "pointer", color: TOKENS.inkMuted, display: "flex", alignItems: "center", gap: "4px", fontSize: "11px" }} aria-label="Remove API">
                    <Trash2 size={13} /> Remove
                  </button>
                ) : null} />
                <EndpointsTable rows={api.endpoints} setRows={(v) => setApi(api.id, { endpoints: v })} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <ContextField title="Request" format={api.reqFormat} setFormat={(v) => setApi(api.id, { reqFormat: v })} raw={api.reqRaw} setRaw={(v) => setApi(api.id, { reqRaw: v })} />
                  <ContextField title="Response" format={api.resFormat} setFormat={(v) => setApi(api.id, { resFormat: v })} raw={api.resRaw} setRaw={(v) => setApi(api.id, { resRaw: v })} />
                </div>
                <MappingBlock note="Map the request/response fields between Finzly and the Core Banking System." rows={api.mappingRows} setRows={(v) => setApi(api.id, { mappingRows: v })} />
                <StatusCodesBlock selections={api.status} setSelections={(v) => setApi(api.id, { status: v })} extras={api.statusExtras} setExtras={(v) => setApi(api.id, { statusExtras: v })} />
              </div>
            ))}
            {conn.inquiry.apis.length < MAX_INQUIRY_APIS && (
              <button onClick={addApi} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", color: TOKENS.primary, background: "#f6ecfd", border: `1px solid ${TOKENS.primary}`, borderRadius: "8px", cursor: "pointer", padding: "8px 14px", fontWeight: 500, alignSelf: "flex-start" }}>
                <Plus size={14} /> Add API ({conn.inquiry.apis.length}/{MAX_INQUIRY_APIS})
              </button>
            )}
          </CapabilityCard>

          <CapabilityCard icon={ClipboardCheck} title="Memo post" subtitle="One connection per memo post — URL, auth, and the request/response shape" state={conn.memo} setState={setMemo}>
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "12px" }}>
              <div>
                <SectionLabel>Method</SectionLabel>
                <select value={conn.memo.method} onChange={(e) => setMemo({ method: e.target.value })} style={selectStyle(false)}>
                  {METHODS.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <SectionLabel>URL</SectionLabel>
                <input value={conn.memo.url} onChange={(e) => setMemo({ url: e.target.value })} placeholder="https://core.bank.com/memo/hold" style={inputStyle(true)} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <ContextField title="Request" format={conn.memo.reqFormat} setFormat={(v) => setMemo({ reqFormat: v })} raw={conn.memo.reqRaw} setRaw={(v) => setMemo({ reqRaw: v })} />
              <ContextField title="Response" format={conn.memo.resFormat} setFormat={(v) => setMemo({ resFormat: v })} raw={conn.memo.resRaw} setRaw={(v) => setMemo({ resRaw: v })} />
            </div>
            <MappingBlock note="Map the request/response fields between Finzly and the Core Banking System. Map the Memo Post APIs (create, reverse, status)." rows={conn.memo.mappingRows} setRows={(v) => setMemo({ mappingRows: v })} />
            <StatusCodesBlock selections={conn.memo.status} setSelections={(v) => setMemo({ status: v })} extras={conn.memo.statusExtras} setExtras={(v) => setMemo({ statusExtras: v })} />
          </CapabilityCard>

          <CapabilityCard icon={Settings2} title="Validate" subtitle="Inline pre-transaction checks — one call, several flags back" state={conn.validate} setState={setValidate}>
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "12px" }}>
              <div>
                <SectionLabel>API method</SectionLabel>
                <select value={conn.validate.method} onChange={(e) => setValidate({ method: e.target.value })} style={selectStyle(false)}>
                  {METHODS.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <SectionLabel>URL</SectionLabel>
                <input value={conn.validate.url} onChange={(e) => setValidate({ url: e.target.value })} placeholder="https://core.bank.com/validate" style={inputStyle(true)} />
              </div>
            </div>
            <ValidationCriteriaList items={conn.validate.criteria} setItems={(v) => setValidate({ criteria: v })} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <ContextField title="Request — context for validation" format={conn.validate.reqFormat} setFormat={(v) => setValidate({ reqFormat: v })} raw={conn.validate.reqRaw} setRaw={(v) => setValidate({ reqRaw: v })} />
              <ContextField title="Response" format={conn.validate.resFormat} setFormat={(v) => setValidate({ resFormat: v })} raw={conn.validate.resRaw} setRaw={(v) => setValidate({ resRaw: v })} />
            </div>
            <MappingBlock note="Map the request/response fields between Finzly and the Core Banking System." rows={conn.validate.mappingRows} setRows={(v) => setValidate({ mappingRows: v })} />
            <StatusCodesBlock selections={conn.validate.status} setSelections={(v) => setValidate({ status: v })} extras={conn.validate.statusExtras} setExtras={(v) => setValidate({ statusExtras: v })} />
            <ValidationChecklist selections={conn.validate.types} setSelections={(v) => setValidate({ types: v })} extras={conn.validate.typeExtras} setExtras={(v) => setValidate({ typeExtras: v })} />
          </CapabilityCard>

          <CapabilityCard icon={Landmark} title="Custom core facility" subtitle="Anything outside the standard set above" state={conn.custom} setState={setCustom}>
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr 1fr", gap: "12px" }}>
              <div>
                <SectionLabel>Protocol</SectionLabel>
                <select value={conn.custom.protocol} onChange={(e) => setCustom({ protocol: e.target.value })} style={selectStyle(false)}>
                  <option>REST</option>
                  <option>SOAP</option>
                  <option>File</option>
                  <option>ISO 8583</option>
                </select>
              </div>
              <div>
                <SectionLabel>Endpoint / path</SectionLabel>
                <input value={conn.custom.path} onChange={(e) => setCustom({ path: e.target.value })} placeholder="/core/custom/endpoint" style={inputStyle(true)} />
              </div>
              <div>
                <SectionLabel>Auth</SectionLabel>
                <select value={conn.custom.auth} onChange={(e) => setCustom({ auth: e.target.value })} style={selectStyle(true)}>
                  {AUTH_OPTIONS.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <SectionLabel>Logic instructions</SectionLabel>
              <textarea
                value={conn.custom.logic}
                onChange={(e) => setCustom({ logic: e.target.value })}
                placeholder="e.g. If country is high-risk, also fetch the enhanced profile from CustomerProfileService and include riskScore."
                rows={3}
                style={{ ...inputStyle(false), resize: "vertical" }}
              />
            </div>
          </CapabilityCard>
        </div>
      </div>
    </div>
  );
}


export default function CoreBankingScreen() {
  const [coreConnections, setCoreConnections] = useState([makeCoreConnection(1)]);
  const updateConnection = (updated) => setCoreConnections((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  const removeConnection = (id) => setCoreConnections((prev) => prev.filter((c) => c.id !== id));
  const addConnection = () => setCoreConnections((prev) => [...prev, makeCoreConnection(prev.length + 1)]);

  const enabledCount = coreConnections.reduce((sum, conn) => sum + [conn.inquiry, conn.memo, conn.validate, conn.custom].filter((c) => c.enabled).length, 0);

  return (
    <>
      <style>{`
        input:focus, select:focus, textarea:focus { border-color: ${TOKENS.primary} !important; box-shadow: 0 0 0 3px rgba(122,0,223,0.12); }
      `}</style>

      <div style={{ minWidth: 0 }}>
          <div style={{ background: TOKENS.white, border: `1px solid ${TOKENS.border}`, borderRadius: "16px", padding: "22px 26px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "28px" }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "22px", fontWeight: 600, margin: "0 0 6px", letterSpacing: "-0.01em" }}>Core banking</h1>
              <p style={{ fontSize: "13.5px", color: TOKENS.inkMuted, margin: 0, maxWidth: "460px" }}>
                Pick a core provider, then pick what you want from it. Add another core banking connection below for anything else this client needs.
              </p>
            </div>
            <svg width="220" height="86" viewBox="0 0 220 86" style={{ flexShrink: 0 }}>
              <line x1="34" y1="24" x2="110" y2="43" stroke={TOKENS.border} strokeWidth="2" />
              <line x1="34" y1="62" x2="110" y2="43" stroke={TOKENS.border} strokeWidth="2" />
              <line x1="130" y1="43" x2="186" y2="20" stroke={TOKENS.border} strokeWidth="2" />
              <line x1="130" y1="43" x2="186" y2="43" stroke={TOKENS.border} strokeWidth="2" />
              <line x1="130" y1="43" x2="186" y2="66" stroke={TOKENS.border} strokeWidth="2" />
              <circle cx="20" cy="24" r="11" fill={TOKENS.surface} stroke={TOKENS.borderStrong} strokeWidth="1.5" />
              <text x="20" y="27" textAnchor="middle" fontSize="7" fontFamily="Inter" fill={TOKENS.inkMuted}>Core A</text>
              <circle cx="20" cy="62" r="11" fill={TOKENS.surface} stroke={TOKENS.borderStrong} strokeWidth="1.5" />
              <text x="20" y="65" textAnchor="middle" fontSize="7" fontFamily="Inter" fill={TOKENS.inkMuted}>Core B</text>
              <circle cx="120" cy="43" r="17" fill={TOKENS.primary} />
              <text x="120" y="46" textAnchor="middle" fontSize="8" fontFamily="Inter" fontWeight="600" fill="#fff">Finzly</text>
              <circle cx="196" cy="20" r="9" fill="#fff" stroke={TOKENS.borderStrong} strokeWidth="1.5" />
              <circle cx="196" cy="43" r="9" fill="#fff" stroke={TOKENS.borderStrong} strokeWidth="1.5" />
              <circle cx="196" cy="66" r="9" fill="#fff" stroke={TOKENS.borderStrong} strokeWidth="1.5" />
            </svg>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <SectionLabel>Core banking configurations</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {coreConnections.map((conn) => (
                <CoreConnectionCard key={conn.id} conn={conn} update={updateConnection} remove={removeConnection} canRemove={coreConnections.length > 1} />
              ))}
            </div>
            <button
              onClick={addConnection}
              style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: TOKENS.primary, background: "#f6ecfd", border: `1px solid ${TOKENS.primary}`, borderRadius: "8px", cursor: "pointer", padding: "8px 14px", fontWeight: 500 }}
            >
              <Plus size={14} /> Add another Core Banking
            </button>
          </div>

          <div style={{ marginTop: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: TOKENS.white, border: `1px solid ${TOKENS.border}`, borderRadius: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: TOKENS.successBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: TOKENS.success }}>{enabledCount}</span>
              </div>
              <span style={{ fontSize: "13px", color: TOKENS.inkMuted }}>of 4 core capabilities enabled</span>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button style={{ padding: "10px 18px", borderRadius: "9px", border: `1px solid ${TOKENS.border}`, background: TOKENS.white, fontSize: "13.5px", fontWeight: 500, cursor: "pointer" }}>Save draft</button>
              <button style={{ padding: "10px 20px", borderRadius: "9px", border: "none", background: `linear-gradient(135deg, ${TOKENS.primary}, ${TOKENS.bright})`, color: "#fff", fontSize: "13.5px", fontWeight: 600, cursor: "pointer" }}>Continue to spec →</button>
            </div>
          </div>
        </div>
    </>
  );
}
