"use client";

import { useRouter } from "next/navigation";
import { Rocket } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "transparent" }}>
      <div className="w-full" style={{ maxWidth: 360 }}>
        <div className="mb-7 flex items-center justify-center gap-2">
          <div className="flex items-center justify-center rounded-md" style={{ width: 30, height: 30, background: "#5201FF" }}>
            <Rocket size={16} color="#fff" />
          </div>
          <span className="font-semibold text-neutral-900" style={{ fontSize: 17, letterSpacing: "-0.02em" }}>
            Galaxy Launchpad
          </span>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="font-semibold text-neutral-900" style={{ fontSize: 15.5, letterSpacing: "-0.01em" }}>
            Sign in
          </div>
          <p className="mb-5 mt-1 text-neutral-500" style={{ fontSize: 13 }}>
            Continue with your Finzly Microsoft account.
          </p>

          <button
            onClick={() => router.push("/client-onboard")}
            className="flex w-full items-center justify-center gap-2 rounded-md py-2.5 font-medium text-white"
            style={{ background: "#5201FF", fontSize: 13.5 }}
          >
            <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 14 }}>◧</span> Continue with Microsoft
          </button>

          <p className="mt-4 text-neutral-400" style={{ fontSize: 11.5, lineHeight: 1.5 }}>
            New accounts are <span className="text-neutral-600">Viewer</span> by default. An admin grants Editor access to PS team members.
          </p>
        </div>
      </div>
    </div>
  );
}
