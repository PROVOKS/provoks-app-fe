import type { Metadata } from "next";
import localFont from "next/font/local";
import {
  Poppins,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
} from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Providers } from "./providers";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const rafaella = localFont({
  src: "./fonts/rafaella.otf",
  variable: "--font-rafaella-local",
  display: "swap",
  weight: "400",
});

const nekst = localFont({
  src: "./fonts/nekst-semibold.otf",
  variable: "--font-nekst-local",
  display: "swap",
  weight: "600",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Provoks LMS",
    template: "%s · Provoks LMS",
  },
  description:
    "Learning Management System yang dibuat untuk mendukung pembelajaran di setiap path Provoks.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${rafaella.variable} ${nekst.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Providers>
          <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
