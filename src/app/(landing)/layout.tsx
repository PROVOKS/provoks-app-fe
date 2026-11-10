import type { Metadata } from "next";

import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";

export const metadata: Metadata = {
  title: "Code, Create, Conquer",
  description:
    "Provoks adalah komunitas pengembangan talenta digital dengan lima path belajar: Web, Mobile, IoT, UI/UX & PM, dan Game Development.",
};

export default function LandingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col bg-black text-white">
      <LandingNavbar />
      <main className="flex-1">{children}</main>
      <LandingFooter />
    </div>
  );
}
