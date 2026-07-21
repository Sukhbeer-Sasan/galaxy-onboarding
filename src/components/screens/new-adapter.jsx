"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, X, Circle, CheckCircle2, Loader2, FileText, UploadCloud, Zap,
} from "lucide-react";

function Btn({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 font-medium text-white"
      style={{ fontSize: 13.5, cursor: disabled ? "not-allowed" : "pointer", background: disabled ? "#d4d4d4" : "#5201FF" }}
    >
      {children}
    </button>
  );
}

/* New adapter — pick what to build, import the ISD, Launchpad pre-fills the rest. */
export default function NewAdapter() {
  const router = useRouter();

  const [integrations, setintegrations] = useState({ "CORE Banking": true, SWIFT: false, Compliance: false, Fraud: false });
  const [reports, setReports] = useState({ AML: true, GL: false, HardPost: false, "Custom Reports": false, "Account Analysis": false });
  const [rails, setRails] = useState({ FedWire: true, SWIFT: false, RTP: false, Fednow: false, ACH: false});
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [p, setP] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!busy) return;
    const t = setInterval(() => {
      setP((x) => {
        if (x >= 100) { clearInterval(t); setDone(true); return 100; }
        return x + 9;
      });
    }, 85);
    return () => clearInterval(t);
  }, [busy]);

  const steps = [
    "Reading Summit_Verafin_ISD.docx",
    "Extracting endpoints & auth",
    "Reading field-mapping table",
    "Pre-filling the spec",
  ];
  const at = Math.min(Math.floor(p / 25), 3);

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <h1 className="font-semibold text-neutral-900" style={{ fontSize: 22, letterSpacing: "-0.02em" }}>New adapter</h1>
      <p className="mb-5 mt-0.5 text-neutral-500" style={{ fontSize: 13 }}>
        Pick what to build, import the ISD, and Launchpad pre-fills the rest.
      </p>

      {done ? (
        <div className="rounded-lg border border-neutral-200 bg-white p-8">
          <div className="mb-1 flex items-center gap-2 font-medium text-neutral-900" style={{ fontSize: 14.5 }}>
            <CheckCircle2 size={16} color="#16a34a" /> Spec pre-filled
          </div>
          <p className="text-neutral-500" style={{ fontSize: 12.5 }}>
            {tenant} — the spec is ready to review. Select a domain from the nav bar above to configure it.
          </p>
        </div>
      ) : !busy ? (
        <div className="space-y-3">
          <div className="rounded-lg border border-neutral-200 bg-white p-5">
            <div className="mb-2 font-medium text-neutral-700" style={{ fontSize: 13 }}>Bank</div>
            <input
              placeholder="Bank name"
              className="w-full rounded-md border border-neutral-200 px-3 py-2 focus:border-neutral-900 focus:outline-none"
              style={{ fontSize: 13.5 }}
            >
            </input>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-5">
            <div className="mb-2 font-medium text-neutral-700" style={{ fontSize: 13 }}>Version</div>
            <input
              placeholder="6.0.3.4"
              className="w-full rounded-md border border-neutral-200 px-3 py-2 focus:border-neutral-900 focus:outline-none"
              style={{ fontSize: 13.5 }}
            >
            </input>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-5">
            <div className="mb-3 font-medium text-neutral-700" style={{ fontSize: 13 }}>Reports</div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(reports).map((d) => {
                const on = reports[d], en = d === "Screening";
                return (
                  <button
                    key={d}
                    onClick={() => setReports((s) => ({ ...s, [d]: !s[d] }))}
                    className="flex items-center gap-2 rounded-md border px-3.5 py-2"
                    style={{ fontSize: 13, borderColor: "#5201FF", background: "#fafafa", color: "#404040", cursor: "pointer"}}
                  >
                    {on ? <CheckCircle2 size={15} color="#5201FF" /> : <Circle size={15} />} {d}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-5">
            <div className="mb-3 font-medium text-neutral-700" style={{ fontSize: 13 }}>Rails</div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(rails).map((d) => {
                const on = rails[d], en = d === "Screening";
                return (
                  <button
                    key={d}
                    onClick={() => setRails((s) => ({ ...s, [d]: !s[d] }))}
                    className="flex items-center gap-2 rounded-md border px-3.5 py-2"
                    style={{ fontSize: 13, borderColor: "#5201FF", background: "#fafafa", color: "#404040", cursor: "pointer"}}
                  >
                    {on ? <CheckCircle2 size={15} color="#5201FF" /> : <Circle size={15} />} {d}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-5">
            <div className="mb-3 font-medium text-neutral-700" style={{ fontSize: 13 }}>Integrations</div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(integrations).map((d) => {
                const on = integrations[d], en = d === "Screening";
                return (
                  <button
                    key={d}
                    onClick={() => setintegrations((s) => ({ ...s, [d]: !s[d] }))}
                    className="flex items-center gap-2 rounded-md border px-3.5 py-2"
                    style={{ fontSize: 13, borderColor: "#5201FF", background: "#fafafa", color: "#404040", cursor: "pointer"}}
                  >
                    {on ? <CheckCircle2 size={15} color="#5201FF" /> : <Circle size={15} />} {d}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Btn onClick={() => router.push("/core") }><Zap size={14} />On-Board to finzly</Btn>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-neutral-200 bg-white p-8">
          <div className="mb-1 flex items-center gap-2 font-medium text-neutral-900" style={{ fontSize: 14.5 }}>
            <Loader2 size={15} className="animate-spin" /> Reading your ISD
          </div>
          <p className="mb-5 text-neutral-500" style={{ fontSize: 12.5 }}>
            Extracting what it can and pre-filling the spec. You&apos;ll review everything next.
          </p>
          <div className="mb-5 rounded-full" style={{ height: 4, background: "#f0f0f0" }}>
            <div style={{ height: 4, width: `${p}%`, background: "#5201FF", borderRadius: 999, transition: "width .1s" }} />
          </div>
          <div className="space-y-2">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2" style={{ fontSize: 13, color: i <= at ? "#404040" : "#a3a3a3" }}>
                {i < at ? <CheckCircle2 size={15} color="#16a34a" /> : i === at ? <Loader2 size={15} className="animate-spin" /> : <Circle size={15} />}
                {s}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
