import type { Metadata, Viewport } from "next";

import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";

export const metadata: Metadata = {
  title: { absolute: "Provoks — Programmer Vokasi" },
  description:
    "PROVOKS (Programmer Vokasi) adalah UKM Vokasi Universitas Brawijaya untuk mengasah talenta digital lewat proyek nyata, mentoring, dan kurikulum yang selaras industri.",
  openGraph: {
    title: "Provoks — Programmer Vokasi",
    description:
      "UKM Vokasi Universitas Brawijaya untuk mengasah kemampuan pemrograman lewat proyek nyata, mentoring, dan kurikulum yang selaras industri.",
    type: "website",
    locale: "id_ID",
    images: [{ url: "/images/pengurus-provoks.jpeg" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function LandingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="landing-theme flex min-h-dvh flex-col bg-black text-white">
      <a
        href="#beranda"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-lg focus:bg-[#F77229] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
      >
        Lewati ke konten
      </a>
      <LandingNavbar />
      <main className="flex-1">{children}</main>
      <LandingFooter />
    </div>
  );
}
