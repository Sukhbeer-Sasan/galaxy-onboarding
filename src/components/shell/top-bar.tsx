import { CircleDot } from "lucide-react";

export function TopBar() {
  return (
    <header className="flex items-center justify-between bg-ink px-7 py-3.5 text-white">
      <div className="flex items-center gap-2.5">
        <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px] bg-gradient-to-br from-brand to-brand-bright">
          <CircleDot size={15} color="#fff" strokeWidth={2.2} />
        </div>
        <span className="font-heading text-[15.5px] font-semibold tracking-[-0.01em]">
          Galaxy Launchpad
        </span>
      </div>
      <div className="flex items-center gap-[18px]">
        <span className="font-mono text-[12.5px] text-[#c9c2d6]">tenant: summit-bank</span>
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-brand-bright text-xs font-semibold">
          PS
        </div>
      </div>
    </header>
  );
}
