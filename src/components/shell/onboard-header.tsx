"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Rocket, Lock } from "lucide-react";
import { DOMAINS } from "@/lib/domains";

/** Neutral v2 header + domain nav bar, shared by /client-onboard and /core. */
export function OnboardHeader({ active }: { active?: string }) {
  const router = useRouter();

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex items-center justify-between px-5 py-3" style={{ maxWidth: 1080 }}>
        <Link href="/client-onboard" className="flex items-center gap-2.5">
          <div className="flex items-center justify-center rounded-md" style={{ width: 24, height: 24, background: "#5201FF" }}>
            <Rocket size={13} color="#fff" />
          </div>
          <span className="font-semibold text-neutral-900" style={{ fontSize: 14, letterSpacing: "-0.01em" }}>Galaxy Launchpad</span>
          <span className="text-neutral-300" style={{ fontSize: 14 }}>/</span>
          <span className="font-mono text-neutral-500" style={{ fontSize: 12.5 }}>finzly</span>
        </Link>
        <div className="flex items-center justify-center rounded-full text-white" style={{ width: 28, height: 28, background: "#5201FF", fontSize: 11, fontWeight: 500 }}>PM</div>
      </div>

      {/* Domain nav bar — Core banking routes to /core, others unlock later */}
      <div className="mx-auto px-5" style={{ maxWidth: 1080 }}>
        <nav className="flex items-center gap-5 overflow-x-auto" style={{ marginBottom: -1 }}>
          {DOMAINS.map((d) => {
            const isActive = d.key === active;
            return (
              <button
                key={d.key}
                onClick={() => d.live && router.push(d.href)}
                disabled={!d.live}
                className="flex items-center gap-1.5 whitespace-nowrap py-2.5"
                style={{
                  fontSize: 13.5,
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? "#5201FF" : d.live ? "#404040" : "#c2c2c2",
                  cursor: d.live ? "pointer" : "not-allowed",
                  borderBottom: isActive ? "2px solid #5201FF" : "2px solid transparent",
                }}
              >
                {d.label}
                {!d.live && <Lock size={12} />}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
