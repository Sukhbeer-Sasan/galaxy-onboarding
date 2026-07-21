import React, { useState, useEffect, useRef } from 'react';
import {
  Rocket, Plus, Search, ChevronRight, ChevronLeft, Check, X, Circle,
  CheckCircle2, AlertTriangle, Clock, Lock, Loader2, FileText, UploadCloud,
  GitBranch, ShieldCheck, ArrowRight, Terminal, Users, Zap
} from 'lucide-react';

const STAGES = ['Draft', 'Detailing', 'Validated', 'Building', 'Testing', 'Review', 'Launched'];

const seed = [
  { id: 'adp_104', bank: 'Summit National Bank', domain: 'Screening', vendor: 'Verafin', stageIdx: 5, updated: '2h ago', blocked: true, days: 4 },
  { id: 'adp_101', bank: 'Cascade Credit Union', domain: 'Screening', vendor: 'LexisNexis', stageIdx: 6, updated: '1d ago', blocked: false, days: 0 },
  { id: 'adp_108', bank: 'Harbor Trust', domain: 'Screening + Fraud', vendor: 'Verafin, Actimize', stageIdx: 3, updated: '20m ago', blocked: false, days: 6 },
  { id: 'adp_097', bank: 'Meridian Bank', domain: 'Screening', vendor: 'Fincom', stageIdx: 1, updated: '3d ago', blocked: false, days: 5 },
];

function statusOf(a) {
  if (a.stageIdx === 6) return { label: 'Launched', dot: '#16a34a', bg: '#f0fdf4', fg: '#15803d', bd: '#bbf7d0', spin: false };
  if (a.blocked) return { label: 'Needs input', dot: '#d97706', bg: '#fffbeb', fg: '#b45309', bd: '#fde68a', spin: false };
  if (a.stageIdx >= 3) return { label: 'Building', dot: '#d97706', bg: '#fffbeb', fg: '#b45309', bd: '#fde68a', spin: true };
  if (a.stageIdx === 2) return { label: 'Validated', dot: '#2563eb', bg: '#eff6ff', fg: '#1d4ed8', bd: '#bfdbfe', spin: false };
  return { label: 'Draft', dot: '#a3a3a3', bg: '#f5f5f5', fg: '#525252', bd: '#e5e5e5', spin: false };
}

function Pill({ s }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5" style={{ background: s.bg, color: s.fg, borderColor: s.bd, fontSize: 12 }}>
      {s.spin ? <Loader2 size={11} className="animate-spin" /> : <span className="rounded-full" style={{ width: 6, height: 6, background: s.dot }} />}
      {s.label}
    </span>
  );
}
function Btn({ children, onClick, disabled, kind = 'primary', size = 'md' }) {
  const base = { fontSize: size === 'sm' ? 12.5 : 13.5, cursor: disabled ? 'not-allowed' : 'pointer' };
  const cls = kind === 'primary'
    ? 'inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 font-medium text-white'
    : 'inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3.5 py-2 font-medium text-neutral-800 hover:bg-neutral-50';
  return <button onClick={onClick} disabled={disabled} className={cls}
    style={{ ...base, background: kind === 'primary' ? (disabled ? '#d4d4d4' : '#171717') : undefined }}>{children}</button>;
}
function Tag() { return <span className="ml-2 rounded px-1.5 py-0.5 font-mono" style={{ background: '#f5f5f5', color: '#737373', fontSize: 10 }}>ISD</span>; }

function Field({ label, value, mono, auto, ro }) {
  return (
    <div>
      <label className="flex items-center text-neutral-500 mb-1.5" style={{ fontSize: 12.5 }}>{label}{auto && <Tag />}</label>
      <input defaultValue={value} disabled={ro}
        className="w-full rounded-md border border-neutral-200 px-3 py-2 text-neutral-900 focus:outline-none focus:border-neutral-900"
        style={{ fontSize: 13.5, fontFamily: mono ? 'ui-monospace,monospace' : 'inherit', background: ro ? '#fafafa' : '#fff' }} />
    </div>
  );
}

/* ---------- Login ---------- */
function Login({ onIn }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#fafafa' }}>
      <div className="w-full" style={{ maxWidth: 360 }}>
        <div className="flex items-center gap-2 justify-center mb-7">
          <div className="rounded-md flex items-center justify-center" style={{ width: 30, height: 30, background: '#171717' }}><Rocket size={16} color="#fff" /></div>
          <span className="font-semibold text-neutral-900" style={{ fontSize: 17, letterSpacing: '-0.02em' }}>Galaxy Launchpad</span>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="text-neutral-900 font-semibold" style={{ fontSize: 15.5, letterSpacing: '-0.01em' }}>Sign in</div>
          <p className="text-neutral-500 mt-1 mb-5" style={{ fontSize: 13 }}>Continue with your Finzly Microsoft account.</p>
          <button onClick={onIn} className="w-full flex items-center justify-center gap-2 rounded-md py-2.5 font-medium text-white" style={{ background: '#171717', fontSize: 13.5 }}>
            <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 14 }}>◧</span> Continue with Microsoft
          </button>
          <p className="text-neutral-400 mt-4" style={{ fontSize: 11.5, lineHeight: 1.5 }}>New accounts are <span className="text-neutral-600">Viewer</span> by default. An admin grants Editor access to PS team members.</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Shell ---------- */
function Shell({ role, setRole, tab, go, canEdit, children }) {
  const tabs = [
    { id: 'adapters', label: 'Adapters', show: true },
    { id: 'new', label: 'New adapter', show: canEdit },
    { id: 'members', label: 'Members', show: role === 'admin' },
  ].filter(t => t.show);
  const activeTop = tab === 'detailing' || tab === 'cockpit' ? 'adapters' : tab;
  return (
    <div className="min-h-screen" style={{ background: '#fafafa' }}>
      <header className="bg-white border-b border-neutral-200">
        <div className="mx-auto flex items-center justify-between px-5 py-3" style={{ maxWidth: 1080 }}>
          <div className="flex items-center gap-2.5">
            <div className="rounded-md flex items-center justify-center" style={{ width: 24, height: 24, background: '#171717' }}><Rocket size={13} color="#fff" /></div>
            <span className="font-semibold text-neutral-900" style={{ fontSize: 14, letterSpacing: '-0.01em' }}>Galaxy Launchpad</span>
            <span className="text-neutral-300" style={{ fontSize: 14 }}>/</span>
            <span className="text-neutral-500 font-mono" style={{ fontSize: 12.5 }}>finzly</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-md border border-neutral-200 px-2 py-1">
              <span className="text-neutral-400" style={{ fontSize: 11 }}>View as</span>
              <select value={role} onChange={e => setRole(e.target.value)} className="bg-transparent text-neutral-800 focus:outline-none" style={{ fontSize: 12 }}>
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="rounded-full flex items-center justify-center text-white" style={{ width: 28, height: 28, background: '#171717', fontSize: 11, fontWeight: 500 }}>PM</div>
          </div>
        </div>
        <div className="mx-auto px-5" style={{ maxWidth: 1080 }}>
          <nav className="flex items-center gap-5" style={{ marginBottom: -1 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => go(t.id)} className="py-2.5" style={{ fontSize: 13.5, color: activeTop === t.id ? '#171717' : '#737373', borderBottom: activeTop === t.id ? '2px solid #171717' : '2px solid transparent', fontWeight: activeTop === t.id ? 500 : 400 }}>
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto px-5 py-7" style={{ maxWidth: 1080 }}>{children}</main>
    </div>
  );
}

/* ---------- Adapters ---------- */
function Adapters({ rows, canEdit, go, open }) {
  const live = rows.filter(r => r.stageIdx === 6).length;
  const stats = [
    ['In flight', rows.length - live], ['Launched', live],
    ['Needs input', rows.filter(r => r.blocked).length], ['Avg days to launch', '5.2'],
  ];
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-neutral-900 font-semibold" style={{ fontSize: 22, letterSpacing: '-0.02em' }}>Adapters</h1>
          <p className="text-neutral-500 mt-0.5" style={{ fontSize: 13 }}>Every bank integration, from draft to launch.</p>
        </div>
        {canEdit ? <Btn onClick={() => go('new')}><Plus size={15} /> New adapter</Btn>
          : <span className="flex items-center gap-1.5 text-neutral-400" style={{ fontSize: 12.5 }}><Lock size={13} /> Viewer access</span>}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {stats.map(([l, v]) => (
          <div key={l} className="rounded-lg border border-neutral-200 bg-white px-4 py-3">
            <div className="text-neutral-500" style={{ fontSize: 12 }}>{l}</div>
            <div className="text-neutral-900 mt-0.5 font-semibold" style={{ fontSize: 20, letterSpacing: '-0.01em' }}>{v}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 mb-3" style={{ maxWidth: 320 }}>
        <Search size={14} className="text-neutral-400" />
        <input placeholder="Search adapters…" className="w-full focus:outline-none text-neutral-800" style={{ fontSize: 13 }} />
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
        {rows.map((a, i) => {
          const s = statusOf(a);
          return (
            <button key={a.id} onClick={() => open(a)} className="w-full text-left px-4 py-3.5 hover:bg-neutral-50 flex items-center gap-4" style={{ borderTop: i === 0 ? 'none' : '1px solid #f0f0f0' }}>
              <span className="rounded-full shrink-0" style={{ width: 8, height: 8, background: s.dot }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-900 font-medium truncate" style={{ fontSize: 14 }}>{a.bank}</span>
                  <span className="text-neutral-400 font-mono shrink-0" style={{ fontSize: 11.5 }}>{a.id}</span>
                </div>
                <div className="text-neutral-500 truncate mt-0.5" style={{ fontSize: 12.5 }}>{a.domain} · {a.vendor}</div>
              </div>
              <div className="hidden sm:block text-neutral-500" style={{ fontSize: 12.5, width: 88 }}>{STAGES[a.stageIdx]}</div>
              <div className="hidden md:block text-neutral-400" style={{ fontSize: 12.5, width: 70 }}>{a.days ? `${a.days}d left` : 'live'}</div>
              <div className="text-neutral-400 hidden sm:block" style={{ fontSize: 12.5, width: 60 }}>{a.updated}</div>
              <Pill s={s} />
              <ChevronRight size={16} className="text-neutral-300 shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- New adapter ---------- */
function NewAdapter({ go, start }) {
  const [tenant, setTenant] = useState('Summit National Bank');
  const [dom, setDom] = useState({ Screening: true, Core: false, Fraud: false });
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [p, setP] = useState(0);
  useEffect(() => {
    if (!busy) return;
    const t = setInterval(() => setP(x => { if (x >= 100) { clearInterval(t); start(tenant); return 100; } return x + 9; }), 85);
    return () => clearInterval(t);
  }, [busy]);
  const steps = ['Reading Summit_Verafin_ISD.docx', 'Extracting endpoints & auth', 'Reading field-mapping table', 'Pre-filling the spec'];
  const at = Math.min(Math.floor(p / 25), 3);
  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <button onClick={() => go('adapters')} className="flex items-center gap-1 text-neutral-500 mb-4" style={{ fontSize: 13 }}><ChevronLeft size={15} /> Back</button>
      <h1 className="text-neutral-900 font-semibold" style={{ fontSize: 22, letterSpacing: '-0.02em' }}>New adapter</h1>
      <p className="text-neutral-500 mt-0.5 mb-5" style={{ fontSize: 13 }}>Pick what to build, import the ISD, and Launchpad pre-fills the rest.</p>

      {!busy ? (
        <div className="space-y-3">
          <div className="rounded-lg border border-neutral-200 bg-white p-5">
            <div className="text-neutral-700 font-medium mb-2" style={{ fontSize: 13 }}>Bank</div>
            <select value={tenant} onChange={e => setTenant(e.target.value)} className="w-full rounded-md border border-neutral-200 px-3 py-2 focus:outline-none focus:border-neutral-900" style={{ fontSize: 13.5 }}>
              {['Summit National Bank', 'Harbor Trust', 'Meridian Bank'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-5">
            <div className="text-neutral-700 font-medium mb-3" style={{ fontSize: 13 }}>Integrations</div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(dom).map(d => {
                const on = dom[d], en = d === 'Screening';
                return (
                  <button key={d} disabled={!en} onClick={() => setDom(s => ({ ...s, [d]: !s[d] }))}
                    className="rounded-md border px-3.5 py-2 flex items-center gap-2"
                    style={{ fontSize: 13, borderColor: on ? '#171717' : '#e5e5e5', background: on ? '#fafafa' : '#fff', color: en ? '#404040' : '#cbcbcb', cursor: en ? 'pointer' : 'not-allowed' }}>
                    {on ? <CheckCircle2 size={15} color="#171717" /> : <Circle size={15} />} {d}{!en && <span style={{ fontSize: 10.5 }}>soon</span>}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-5">
            <div className="text-neutral-700 font-medium mb-3" style={{ fontSize: 13 }}>Interface spec (ISD)</div>
            {!file ? (
              <button onClick={() => setFile('Summit_Verafin_ISD.docx')} className="w-full rounded-lg border border-dashed border-neutral-300 py-8 flex flex-col items-center gap-1.5 hover:border-neutral-400 hover:bg-neutral-50">
                <UploadCloud size={24} className="text-neutral-400" />
                <span className="text-neutral-700 font-medium" style={{ fontSize: 13 }}>Import ISD .docx</span>
                <span className="text-neutral-400" style={{ fontSize: 12 }}>or click to browse</span>
              </button>
            ) : (
              <div className="flex items-center justify-between rounded-md border border-neutral-200 px-3.5 py-2.5">
                <div className="flex items-center gap-2"><FileText size={17} className="text-neutral-700" /><span className="text-neutral-700 font-mono" style={{ fontSize: 12.5 }}>{file}</span></div>
                <button onClick={() => setFile(null)}><X size={15} className="text-neutral-400" /></button>
              </div>
            )}
          </div>
          <div className="flex justify-end pt-1">
            <Btn disabled={!file} onClick={() => setBusy(true)}><Zap size={14} /> Extract & pre-fill</Btn>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-neutral-200 bg-white p-8">
          <div className="flex items-center gap-2 text-neutral-900 font-medium mb-1" style={{ fontSize: 14.5 }}><Loader2 size={15} className="animate-spin" /> Reading your ISD</div>
          <p className="text-neutral-500 mb-5" style={{ fontSize: 12.5 }}>Extracting what it can and pre-filling the spec. You'll review everything next.</p>
          <div className="rounded-full mb-5" style={{ height: 4, background: '#f0f0f0' }}><div style={{ height: 4, width: `${p}%`, background: '#171717', borderRadius: 999, transition: 'width .1s' }} /></div>
          <div className="space-y-2">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2" style={{ fontSize: 13, color: i <= at ? '#404040' : '#a3a3a3' }}>
                {i < at ? <CheckCircle2 size={15} color="#16a34a" /> : i === at ? <Loader2 size={15} className="animate-spin" /> : <Circle size={15} />}{s}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Detailing (linear wizard) ---------- */
const WIZARD = ['Integrations & vendors', 'Connection & auth', 'Screening rules', 'Field mapping', 'Use cases & codes', 'Samples', 'Secrets & connections', 'Customizations', 'Review & run'];

function Detailing({ tenant, canEdit, onRun, onBack }) {
  const [step, setStep] = useState(0);
  const ro = !canEdit;
  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <button onClick={onBack} className="flex items-center gap-1 text-neutral-500 mb-4" style={{ fontSize: 13 }}><ChevronLeft size={15} /> Adapters</button>
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-neutral-900 font-semibold" style={{ fontSize: 20, letterSpacing: '-0.02em' }}>{tenant}</h1>
        <span className="text-neutral-400 font-mono" style={{ fontSize: 12 }}>screening · verafin</span>
        {ro && <span className="flex items-center gap-1 text-neutral-400 ml-auto" style={{ fontSize: 12 }}><Lock size={12} /> read only</span>}
      </div>

      <div className="flex items-center justify-between mb-2 mt-4">
        <div className="text-neutral-900 font-medium" style={{ fontSize: 13.5 }}>{WIZARD[step]}</div>
        <div className="text-neutral-400 font-mono" style={{ fontSize: 12 }}>step {step + 1} / {WIZARD.length}</div>
      </div>
      <div className="flex gap-1 mb-6">
        {WIZARD.map((_, i) => <div key={i} className="h-1 flex-1 rounded-full" style={{ background: i <= step ? '#171717' : '#e5e5e5' }} />)}
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-6" style={{ minHeight: 220 }}>
        <StepBody step={step} ro={ro} />
      </div>

      <div className="flex justify-between mt-4">
        <Btn kind="ghost" onClick={() => setStep(s => Math.max(0, s - 1))}><ChevronLeft size={15} /> Back</Btn>
        {step < WIZARD.length - 1
          ? <Btn onClick={() => setStep(s => s + 1)}>Next <ArrowRight size={15} /></Btn>
          : <Btn disabled={ro} onClick={onRun}><Zap size={14} /> Run build</Btn>}
      </div>
    </div>
  );
}

function StepBody({ step, ro }) {
  const H = ({ t, s }) => <div className="mb-4"><div className="text-neutral-900 font-medium" style={{ fontSize: 14.5 }}>{t}</div>{s && <p className="text-neutral-500 mt-0.5" style={{ fontSize: 12.5 }}>{s}</p>}</div>;

  if (step === 0) return (<div>
    <H t="Integrations & vendors" s="One or more vendors per domain — a bank can screen against several." />
    <div className="space-y-2.5">
      {[{ n: 'Verafin', t: 'OFAC + Fraud', a: true }, { add: true, n: 'Add vendor' }].map(v => (
        <div key={v.n} className="flex items-center gap-2 rounded-md border px-3.5 py-3" style={{ borderColor: v.add ? '#e5e5e5' : '#171717', borderStyle: v.add ? 'dashed' : 'solid', background: v.add ? '#fff' : '#fafafa' }}>
          {v.add ? <Plus size={15} className="text-neutral-400" /> : <ShieldCheck size={15} className="text-neutral-800" />}
          <span className="text-neutral-800" style={{ fontSize: 13.5, fontWeight: v.add ? 400 : 500 }}>{v.n}</span>
          {v.t && <span className="text-neutral-500" style={{ fontSize: 12 }}>· {v.t}</span>}{v.a && <Tag />}
        </div>
      ))}
    </div>
  </div>);

  if (step === 1) return (<div>
    <H t="Connection & auth" s="Verafin is REST — submit, then handle the async callback." />
    <div className="grid sm:grid-cols-2 gap-4">
      <Field label="Base URL" value="https://api.verafin.com/v2" mono auto ro={ro} />
      <Field label="Auth mechanism" value="OAuth 2.0 (client credentials)" auto ro={ro} />
      <Field label="Submit endpoint" value="POST /screening/submit" mono auto ro={ro} />
      <Field label="Callback route" value="POST /callbacks/verafin" mono auto ro={ro} />
      <Field label="Timeout (ms)" value="8000" mono ro={ro} />
      <Field label="Max retries" value="3" mono ro={ro} />
    </div>
  </div>);

  if (step === 2) return (<div>
    <H t="Screening rules" s="What to screen, and how to treat the result." />
    <div className="mb-4"><div className="text-neutral-500 mb-2" style={{ fontSize: 12.5 }}>Screening types</div>
      <div className="flex gap-2">{['OFAC / sanctions', 'Fraud'].map(t => <span key={t} className="rounded-md border px-3 py-1.5 flex items-center gap-1.5" style={{ fontSize: 12.5, borderColor: '#171717', background: '#fafafa', color: '#404040' }}><CheckCircle2 size={14} color="#171717" /> {t}</span>)}</div></div>
    <div className="grid sm:grid-cols-3 gap-4">
      <Field label="Hit threshold" value="0.85" mono ro={ro} /><Field label="Review threshold" value="0.60" mono ro={ro} /><Field label="Auto-clear below" value="0.60" mono ro={ro} />
    </div>
  </div>);

  if (step === 3) return (<div>
    <H t="Field mapping" s="External fields, meaning, and Finzly mapping — from the ISD table." />
    <div className="rounded-md border border-neutral-200 overflow-hidden mb-4">
      <div className="grid grid-cols-3 px-3 py-2 text-neutral-500" style={{ fontSize: 11.5, background: '#fafafa' }}><div>External</div><div>Meaning</div><div>Finzly</div></div>
      {[['customerId', 'Party id', 'party.id'], ['fullName', 'Legal name', 'party.legalName'], ['amount', 'Txn amount', 'transaction.amount'], ['country', 'Bene country', 'transaction.beneCountry']].map((r, i) => (
        <div key={r[0]} className="grid grid-cols-3 px-3 py-2 items-center" style={{ fontSize: 12.5, borderTop: '1px solid #f0f0f0' }}>
          <div className="font-mono text-neutral-900">{r[0]}</div><div className="text-neutral-500">{r[1]}</div><div className="font-mono text-neutral-800">{r[2]}</div>
        </div>
      ))}
    </div>
    <label className="block text-neutral-700 font-medium mb-1.5" style={{ fontSize: 12.5 }}>Logic & special instructions <span className="text-neutral-400 font-normal">(natural language)</span></label>
    <textarea disabled={ro} rows={4} defaultValue={"If country is on the high-risk list, also fetch the enhanced profile from CustomerProfileService and include riskScore. For amounts over 250k, force a Fraud screen even if only OFAC was requested."}
      className="w-full rounded-md border border-neutral-200 px-3 py-2 text-neutral-700 focus:outline-none focus:border-neutral-900" style={{ fontSize: 13, background: ro ? '#fafafa' : '#fff' }} />
    <p className="text-neutral-400 mt-1.5 flex items-center gap-1.5" style={{ fontSize: 11.5 }}><Zap size={12} /> Forge passes this to the code-writing agent as an instruction.</p>
  </div>);

  if (step === 4) return (<div>
    <H t="Use cases & codes" s="The bank picks a code for each standard use case." />
    <div className="rounded-md border border-neutral-200 overflow-hidden">
      {[['OUTGOING_WIRE_API', 'OWIRE'], ['INCOMING_WIRE_API', 'IWIRE'], ['ACH_BATCH', 'ACHSCR']].map((r, i) => (
        <div key={r[0]} className="flex items-center justify-between px-4 py-2.5" style={{ borderTop: i === 0 ? 'none' : '1px solid #f0f0f0' }}>
          <span className="text-neutral-700 font-mono" style={{ fontSize: 13 }}>{r[0]}</span>
          <input defaultValue={r[1]} disabled={ro} className="rounded-md border border-neutral-200 px-2 py-1 text-right font-mono focus:outline-none focus:border-neutral-900" style={{ fontSize: 12.5, width: 110 }} />
        </div>
      ))}
    </div>
  </div>);

  if (step === 5) return (<div>
    <H t="Samples" s="Real request/response samples make the generated code sharper." />
    <div className="grid sm:grid-cols-2 gap-4">
      {['Sample request', 'Sample callback'].map(l => (
        <div key={l}><div className="text-neutral-500 mb-1.5" style={{ fontSize: 12.5 }}>{l}</div>
          <div className="rounded-md border border-neutral-200 p-3 text-neutral-400 font-mono" style={{ fontSize: 12, background: '#fafafa', minHeight: 84 }}>{'{ "customerId": "…" }'}</div></div>
      ))}
    </div>
  </div>);

  if (step === 6) return (<div>
    <H t="Secrets & connections" s="References only — values live in the vault, never in the spec or code." />
    <div className="grid sm:grid-cols-2 gap-4 mb-4">
      <Field label="Client ID (ref)" value="vault://summit/verafin/client_id" mono ro={ro} />
      <Field label="Client secret (ref)" value="vault://summit/verafin/client_secret" mono ro={ro} />
    </div>
    <div className="rounded-md border border-neutral-200 px-4 py-3 flex flex-wrap items-center gap-3" style={{ background: '#fafafa' }}>
      <span className="text-neutral-600" style={{ fontSize: 12.5 }}>Lower region:</span>
      <label className="flex items-center gap-1.5 text-neutral-700" style={{ fontSize: 12.5 }}><input type="radio" name="m" defaultChecked disabled={ro} /> Mock the vendor API</label>
      <label className="flex items-center gap-1.5 text-neutral-700" style={{ fontSize: 12.5 }}><input type="radio" name="m" disabled={ro} /> Use real credentials</label>
    </div>
  </div>);

  if (step === 7) return (<div>
    <H t="Customizations" s="Anything special that isn't a field above — describe it and Forge handles it." />
    <textarea disabled={ro} rows={5} defaultValue={"Batch-mode fallback: if the real-time endpoint returns 503, queue the request and retry on the 15-minute Azkaban job. Add a daily reconciliation report of screened vs cleared counts."}
      className="w-full rounded-md border border-neutral-200 px-3 py-2 text-neutral-700 focus:outline-none focus:border-neutral-900" style={{ fontSize: 13, background: ro ? '#fafafa' : '#fff' }} />
  </div>);

  return (<div>
    <H t="Review & run" s="A quick check before Forge starts writing code." />
    <div className="space-y-2">
      {[['Integrations & vendors', 1], ['Connection & auth', 1], ['Field mapping (4 + logic)', 1], ['Use case codes', 1], ['Secrets referenced (2)', 1], ['Sample payloads', 0]].map(([l, ok]) => (
        <div key={l} className="flex items-center gap-2" style={{ fontSize: 13, color: ok ? '#404040' : '#b45309' }}>
          {ok ? <CheckCircle2 size={15} color="#16a34a" /> : <AlertTriangle size={15} color="#d97706" />}{l}{!ok && <span className="text-neutral-400" style={{ fontSize: 11.5 }}>— optional</span>}
        </div>
      ))}
    </div>
  </div>);
}

/* ---------- Cockpit (build pipeline) ---------- */
const PIPE = ['Scaffold', 'Customize', 'Build', 'Unit tests', 'BDD', 'Review'];
const DUR = ['1.2s', '6.4s', '8.1s', '2.3s', '3.0s', '0.4s'];
const SCRIPT = [
  { s: 0, t: 'Generating galaxy-summit-clientadapter-screening' },
  { s: 0, t: 'Wired galaxy-plugins primitives + liquibase baseline' },
  { s: 1, t: 'Writing VerafinScreeningClient (oauth2)' },
  { s: 1, t: 'Mapping 14 request fields from ISD table' },
  { s: 1, t: 'Applying custom-logic instruction to callback handler' },
  { s: 2, t: 'mvn -q package … BUILD SUCCESS' },
  { s: 3, t: 'Unit: 38 tests, 38 passed' },
  { s: 4, t: 'BDD: 6 scenarios, 5 passed, 1 needs input' },
];

function Cockpit({ tenant, onApprove, onBack }) {
  const [logs, setLogs] = useState([]);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState('running');
  const ref = useRef(null);

  useEffect(() => {
    if (phase !== 'running') return;
    if (idx >= SCRIPT.length) { setPhase('question'); return; }
    const t = setTimeout(() => { setLogs(l => [...l, SCRIPT[idx]]); setIdx(i => i + 1); }, 650);
    return () => clearTimeout(t);
  }, [idx, phase]);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [logs]);

  const maxS = logs.reduce((m, l) => Math.max(m, l.s), -1);
  const answer = (c) => { setLogs(l => [...l, { s: 4, t: `↳ you: partial hit → ${c}`, you: true }, { s: 4, t: 'BDD: re-ran scenario → 6/6 passed' }]); setPhase('review'); };

  const stepState = (i) => {
    if (phase === 'review') return 'done';
    if (phase === 'question') return i < 4 ? 'done' : i === 4 ? 'run' : 'pend';
    if (i < maxS) return 'done'; if (i === maxS) return 'run'; return 'pend';
  };
  const top = phase === 'review'
    ? { label: 'Ready for review', dot: '#16a34a', bg: '#f0fdf4', fg: '#15803d', bd: '#bbf7d0', spin: false }
    : phase === 'question'
      ? { label: 'Needs input', dot: '#d97706', bg: '#fffbeb', fg: '#b45309', bd: '#fde68a', spin: false }
      : { label: 'Building', dot: '#d97706', bg: '#fffbeb', fg: '#b45309', bd: '#fde68a', spin: true };

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-neutral-500 mb-4" style={{ fontSize: 13 }}><ChevronLeft size={15} /> Adapters</button>
      <div className="flex items-center gap-2.5 mb-1">
        <h1 className="text-neutral-900 font-semibold" style={{ fontSize: 20, letterSpacing: '-0.02em' }}>{tenant}</h1>
        <span className="text-neutral-400 font-mono" style={{ fontSize: 12 }}>screening · verafin</span>
        <div className="ml-auto"><Pill s={top} /></div>
      </div>
      <p className="text-neutral-500 mb-5" style={{ fontSize: 12.5 }}>Forge is building the adapter. You review before anything merges.</p>

      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 rounded-lg border border-neutral-200 bg-white p-4">
          <div className="text-neutral-500 mb-3" style={{ fontSize: 12 }}>Pipeline</div>
          <div className="space-y-0.5">
            {PIPE.map((p, i) => {
              const st = stepState(i);
              return (
                <div key={p} className="flex items-center gap-2.5 py-1.5">
                  {st === 'done' ? <CheckCircle2 size={16} color="#16a34a" />
                    : st === 'run' ? <Loader2 size={16} className="animate-spin text-neutral-700" />
                      : <Circle size={16} className="text-neutral-300" />}
                  <span style={{ fontSize: 13, color: st === 'pend' ? '#a3a3a3' : '#404040', fontWeight: st === 'run' ? 500 : 400 }}>{p}</span>
                  <span className="ml-auto font-mono text-neutral-400" style={{ fontSize: 11.5 }}>{st === 'done' ? DUR[i] : st === 'run' ? '…' : ''}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-neutral-500 mb-2" style={{ fontSize: 12 }}><Terminal size={13} /> Build logs</div>
            <div ref={ref} className="rounded-lg p-3.5 overflow-auto" style={{ background: '#0a0a0a', height: 210, fontFamily: 'ui-monospace,monospace', fontSize: 12 }}>
              {logs.map((l, i) => {
                const ok = /SUCCESS|passed|6\/6/.test(l.t);
                return <div key={i} style={{ color: l.you ? '#fbbf24' : ok ? '#4ade80' : '#a3a3a3', marginBottom: 3 }}>{l.t}</div>;
              })}
              {phase === 'running' && <span style={{ color: '#525252' }}>▋</span>}
            </div>
          </div>

          {phase === 'question' && (
            <div className="rounded-lg border px-4 py-3.5" style={{ borderColor: '#fde68a', background: '#fffbeb' }}>
              <div className="flex items-center gap-2 text-amber-700 font-medium mb-1" style={{ fontSize: 13 }}><AlertTriangle size={15} /> Forge needs input</div>
              <p className="text-neutral-700 mb-3" style={{ fontSize: 12.5 }}>For a partial hit on the callback, should a review-band result auto-route to the manual queue, or hold for re-screen?</p>
              <div className="flex flex-wrap gap-2">
                <Btn kind="ghost" size="sm" onClick={() => answer('route to manual queue')}>Route to manual queue</Btn>
                <Btn kind="ghost" size="sm" onClick={() => answer('hold for re-screen')}>Hold for re-screen</Btn>
              </div>
            </div>
          )}

          {phase === 'review' && (
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-neutral-200 bg-white p-4">
                <div className="text-neutral-700 font-medium mb-2 flex items-center gap-1.5" style={{ fontSize: 12.5 }}><FileText size={14} /> Files (11)</div>
                {['VerafinScreeningClient.java', 'ScreeningSubmitCommand.java', 'VerafinCallbackHandler.java', 'V3__screening.sql'].map(f => (
                  <div key={f} className="flex items-center gap-1.5 py-0.5 text-neutral-600 font-mono" style={{ fontSize: 11.5 }}><span style={{ color: '#16a34a' }}>+</span> {f}</div>
                ))}
                <div className="text-neutral-400" style={{ fontSize: 11 }}>+ 7 more</div>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg border border-neutral-200 bg-white p-4">
                  <div className="flex items-center justify-between" style={{ fontSize: 12.5 }}><span className="text-neutral-600">Unit</span><span className="text-green-700" style={{ fontWeight: 500 }}>38 / 38</span></div>
                  <div className="flex items-center justify-between mt-1" style={{ fontSize: 12.5 }}><span className="text-neutral-600">BDD</span><span className="text-green-700" style={{ fontWeight: 500 }}>6 / 6</span></div>
                </div>
                <div className="rounded-lg border px-4 py-3" style={{ borderColor: '#fde68a', background: '#fffbeb' }}>
                  <div className="flex items-center gap-1.5 text-amber-700 font-medium mb-1" style={{ fontSize: 12 }}><AlertTriangle size={13} /> Reviewer flagged 1</div>
                  <p className="text-neutral-700" style={{ fontSize: 11.5 }}>ISD doesn't specify behavior when the vendor returns no immediate response. Forge assumed "await callback".</p>
                </div>
              </div>
              <div className="sm:col-span-2 flex items-center justify-between">
                <span className="text-neutral-400" style={{ fontSize: 11.5 }}>In production this opens a PR from a feature branch.</span>
                <Btn onClick={onApprove}><Check size={15} /> Approve & launch</Btn>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Members ---------- */
function Members() {
  const [u, setU] = useState([
    { name: 'Priya Menon', email: 'priya@finzly.com', role: 'admin', ps: true },
    { name: 'Diego Alvarez', email: 'diego@finzly.com', role: 'editor', ps: true },
    { name: 'Sara Kim', email: 'sara@finzly.com', role: 'editor', ps: true },
    { name: 'Nina Osei', email: 'nina@finzly.com', role: 'viewer', ps: true },
    { name: 'Tom Reilly', email: 'tom@summitbank.com', role: 'viewer', ps: false },
  ]);
  const set = (i, r) => setU(x => x.map((y, j) => j === i ? { ...y, role: r } : y));
  return (
    <div style={{ maxWidth: 780, margin: '0 auto' }}>
      <h1 className="text-neutral-900 font-semibold" style={{ fontSize: 22, letterSpacing: '-0.02em' }}>Members</h1>
      <p className="text-neutral-500 mt-0.5 mb-5" style={{ fontSize: 13 }}>Everyone starts as a viewer. Grant Editor access to PS team members.</p>
      <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
        <div className="grid px-4 py-2.5 text-neutral-500" style={{ gridTemplateColumns: '2fr 1fr 1.1fr', fontSize: 11.5, background: '#fafafa' }}><div>User</div><div>Team</div><div>Role</div></div>
        {u.map((m, i) => (
          <div key={m.email} className="grid items-center px-4 py-3" style={{ gridTemplateColumns: '2fr 1fr 1.1fr', borderTop: '1px solid #f0f0f0' }}>
            <div><div className="text-neutral-900 font-medium" style={{ fontSize: 13.5 }}>{m.name}</div><div className="text-neutral-400 font-mono" style={{ fontSize: 11.5 }}>{m.email}</div></div>
            <div>{m.ps ? <span className="rounded-full px-2 py-0.5" style={{ background: '#f5f5f5', color: '#525252', fontSize: 11 }}>PS team</span> : <span className="rounded-full px-2 py-0.5" style={{ background: '#f5f5f5', color: '#a3a3a3', fontSize: 11 }}>External</span>}</div>
            <div>
              <select value={m.role} onChange={e => set(i, e.target.value)} className="rounded-md border border-neutral-200 px-2 py-1.5 focus:outline-none focus:border-neutral-900" style={{ fontSize: 12.5 }}>
                <option value="viewer">Viewer</option>
                <option value="editor" disabled={!m.ps}>Editor{!m.ps ? ' — PS only' : ''}</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- App ---------- */
export default function GalaxyLaunchpad() {
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState('editor');
  const [tab, setTab] = useState('adapters');
  const [rows, setRows] = useState(seed);
  const [tenant, setTenant] = useState('Summit National Bank');
  const [toast, setToast] = useState('');
  const canEdit = role !== 'viewer';
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(''), 2500); return () => clearTimeout(t); } }, [toast]);
  const go = (t) => { if (t === 'new' && !canEdit) return; if (t === 'members' && role !== 'admin') return; setTab(t); };

  if (!authed) return <Login onIn={() => { setAuthed(true); setTab('adapters'); }} />;
  return (
    <Shell role={role} setRole={setRole} tab={tab} go={go} canEdit={canEdit}>
      {toast && <div className="fixed left-1/2 rounded-md px-4 py-2.5 text-white flex items-center gap-2" style={{ bottom: 24, transform: 'translateX(-50%)', background: '#171717', fontSize: 13, zIndex: 50 }}><Check size={15} color="#4ade80" /> {toast}</div>}
      {tab === 'adapters' && <Adapters rows={rows} canEdit={canEdit} go={go} open={(a) => { setTenant(a.bank); setTab(a.blocked || a.stageIdx >= 3 ? 'cockpit' : 'detailing'); }} />}
      {tab === 'new' && <NewAdapter go={go} start={(t) => { setTenant(t); setTab('detailing'); }} />}
      {tab === 'detailing' && <Detailing tenant={tenant} canEdit={canEdit} onBack={() => go('adapters')} onRun={() => setTab('cockpit')} />}
      {tab === 'cockpit' && <Cockpit tenant={tenant} onBack={() => go('adapters')} onApprove={() => { setRows(r => r.map(x => x.bank === tenant ? { ...x, stageIdx: 6, blocked: false, days: 0 } : x)); setToast('Approved and marked launched'); setTab('adapters'); }} />}
      {tab === 'members' && <Members />}
    </Shell>
  );
}
