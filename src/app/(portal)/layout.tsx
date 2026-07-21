import { TopBar } from "@/components/shell/top-bar";
import { Sidebar } from "@/components/shell/sidebar";

export default function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <TopBar />
      <div className="mx-auto flex max-w-[1180px]">
        <Sidebar />
        <main className="min-w-0 flex-1 px-6 pb-16 pt-6">{children}</main>
      </div>
    </div>
  );
}
