import { ComingSoon } from "@/components/shell/coming-soon";
import { DOMAINS } from "@/lib/domains";

const d = DOMAINS.find((x) => x.key === "trade")!;

export default function TradePage() {
  return <ComingSoon title={d.label} blurb={d.blurb} icon={d.icon} />;
}
