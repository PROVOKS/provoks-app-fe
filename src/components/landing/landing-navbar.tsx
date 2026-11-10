"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { BrandLogo } from "@/components/shared/brand-logo";
import { Button } from "@/components/ui/button";
import { landingNav } from "@/lib/landing-content";
import { cn } from "@/lib/utils";

export function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full text-white transition-colors",
        scrolled
          ? "border-b border-white/15 bg-black/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="flex h-20 w-full items-center justify-between gap-6 px-6 lg:h-24 lg:px-10">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 lg:ml-[max(0px,calc((100vw_-_1290px)/2))]"
        >
          <BrandLogo className="h-14 lg:h-16" />
        </Link>

        <div className="hidden items-center gap-3 lg:flex">
          <nav className="flex items-center gap-1">
            {landingNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-[#F77229]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <Button
            asChild
            className="h-10 rounded-full bg-[#F77229] px-6 text-sm font-semibold text-white hover:bg-[#F77229]/90"
          >
            <Link href="/login">Masuk</Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          className="grid size-10 place-items-center rounded-xl bg-white/10 lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/15 bg-black lg:hidden">
          <nav className="mx-auto flex w-full max-w-[1290px] flex-col gap-1 px-6 py-4 lg:px-10">
            {landingNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:text-[#F77229]"
              >
                {item.label}
              </a>
            ))}
            <Button
              asChild
              className="mt-2 h-10 rounded-full bg-[#F77229] text-sm font-semibold text-white hover:bg-[#F77229]/90"
            >
              <Link href="/login" onClick={() => setOpen(false)}>
                Masuk
              </Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
