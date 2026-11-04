"use client";

import { Suspense, useState } from "react";
import { X } from "lucide-react";

import { LearnerSidebar } from "@/components/learner/learner-sidebar";
import { LearnerTopbar } from "@/components/learner/learner-topbar";

function SidebarSkeleton() {
  return (
    <div className="h-full w-[248px] rounded-[20px] border border-border bg-card" />
  );
}

/**
 * Kerangka halaman siswa.
 * - >= lg: sidebar menetap.
 * - < lg : sidebar jadi drawer, dibuka lewat tombol menu di topbar.
 */
export function LearnerShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex h-dvh gap-3 overflow-hidden bg-muted/60 p-3 lg:gap-[18px] lg:p-[18px]">
      <div className="hidden h-full shrink-0 lg:block">
        <Suspense fallback={<SidebarSkeleton />}>
          <LearnerSidebar />
        </Suspense>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Tutup menu"
            className="absolute inset-0 bg-foreground/30 backdrop-blur-[2px]"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 h-full p-3">
            <div className="relative h-full">
              <Suspense fallback={<SidebarSkeleton />}>
                <LearnerSidebar onNavigate={() => setDrawerOpen(false)} />
              </Suspense>
              <button
                type="button"
                aria-label="Tutup menu"
                onClick={() => setDrawerOpen(false)}
                className="absolute top-3 right-3 grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <main className="flex h-full w-full min-w-0 flex-col gap-3 lg:gap-4">
        <div className="shrink-0">
          <Suspense fallback={<div className="h-14 w-full" />}>
            <LearnerTopbar onMenuClick={() => setDrawerOpen(true)} />
          </Suspense>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">{children}</div>
      </main>
    </div>
  );
}
