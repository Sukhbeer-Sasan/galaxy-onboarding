import { OnboardHeader } from "@/components/shell/onboard-header";
import CoreBankingScreen from "@/components/screens/core-banking";

export default function CorePage() {
  return (
    <div className="min-h-screen" style={{ background: "transparent" }}>
      <OnboardHeader active="core" />
      <main className="mx-auto px-5 py-7" style={{ maxWidth: 1080 }}>
        <CoreBankingScreen />
      </main>
    </div>
  );
}
