import { Suspense } from "react";

import { AppSidebar } from "@/components/admin/app-sidebar";
import { AppTopbar } from "@/components/admin/app-topbar";

export const instant = false;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen gap-[18px] overflow-hidden bg-muted/60 p-[18px]">
      <div className="h-full shrink-0">
        <Suspense
          fallback={
            <div className="h-full w-[248px] rounded-[20px] border border-border bg-card" />
          }
        >
          <AppSidebar />
        </Suspense>
      </div>

      <main className="flex h-full w-full min-w-0 flex-col gap-4">
        <div className="shrink-0">
          <Suspense fallback={<div className="h-14 w-full" />}>
            <AppTopbar />
          </Suspense>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">{children}</div>
      </main>
    </div>
  );
}
