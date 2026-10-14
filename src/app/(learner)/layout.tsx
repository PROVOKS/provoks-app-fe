import { Suspense } from "react";

import { LearnerSidebar } from "@/components/learner/learner-sidebar";
import { LearnerTopbar } from "@/components/learner/learner-topbar";

export const instant = false;

export default function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-start gap-[18px] bg-muted/60 p-[18px]">
      <div className="sticky top-[18px] h-[calc(100vh-36px)]">
        <Suspense
          fallback={
            <div className="h-full w-[248px] shrink-0 rounded-[20px] border border-border bg-card" />
          }
        >
          <LearnerSidebar />
        </Suspense>
      </div>
      <main className="flex w-full min-w-0 flex-col gap-4">
        <Suspense fallback={<div className="h-14 w-full" />}>
          <LearnerTopbar />
        </Suspense>
        {children}
      </main>
    </div>
  );
}
