"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
import { DOMAINS } from "@/lib/domains";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[220px] shrink-0 flex-col gap-1 px-3 py-6">
      <p className="mx-3 mb-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-muted">
        Services
      </p>

      {DOMAINS.map((d) => {
        const Icon = d.icon;
        const active = pathname === d.href || pathname.startsWith(d.href + "/");
        const content = (
          <>
            <Icon size={16} strokeWidth={1.8} />
            <span className="flex-1">{d.label}</span>
            {!d.live && <Lock size={12} strokeWidth={2} />}
          </>
        );
        const base =
          "flex items-center gap-2.5 rounded-[9px] px-3 py-2.5 text-[13.5px]";

        if (!d.live) {
          return (
            <div
              key={d.key}
              className={cn(base, "cursor-default font-medium text-ink-muted opacity-75")}
            >
              {content}
            </div>
          );
        }

        return (
          <Link
            key={d.key}
            href={d.href}
            className={cn(
              base,
              "font-semibold transition-colors",
              active
                ? "bg-lilac-2 text-brand"
                : "text-ink-muted hover:bg-lilac hover:text-brand"
            )}
          >
            {content}
          </Link>
        );
      })}

      <div className="mt-[18px] rounded-[10px] border border-hair bg-white p-3">
        <p className="text-[11.5px] text-ink-muted">
          Other services unlock as this POC expands to screening, payments, trade,
          reporting, and digital channels.
        </p>
      </div>
    </aside>
  );
}
