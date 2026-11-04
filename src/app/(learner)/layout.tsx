import { LearnerShell } from "@/components/learner/learner-shell";

export const instant = false;

export default function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LearnerShell>{children}</LearnerShell>;
}
