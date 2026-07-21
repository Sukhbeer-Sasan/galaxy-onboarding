import { Lock, type LucideIcon } from "lucide-react";

export function ComingSoon({
  title,
  blurb,
  icon: Icon,
}: {
  title: string;
  blurb: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-hair bg-white">
        <Icon size={26} strokeWidth={1.6} className="text-brand" />
      </div>
      <h1 className="font-heading text-[22px] font-semibold tracking-[-0.01em] text-ink">
        {title}
      </h1>
      <p className="mt-2 max-w-[440px] text-[13.5px] text-ink-muted">{blurb}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-hair bg-white px-3.5 py-1.5 text-[12px] font-medium text-ink-muted">
        <Lock size={12} strokeWidth={2} /> Coming soon
      </span>
    </div>
  );
}
