import { OnboardHeader } from "@/components/shell/onboard-header";
import NewAdapter from "@/components/screens/new-adapter";

export default function ClientOnboardPage() {
  return (
    <div className="min-h-screen" style={{ background: "transparent" }}>
      <OnboardHeader />
      <main className="mx-auto px-5 py-7" style={{ maxWidth: 1080 }}>
        <NewAdapter />
      </main>
    </div>
  );
}
