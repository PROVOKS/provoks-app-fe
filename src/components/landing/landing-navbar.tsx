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
  const [active, setActive] = useState<string>("");

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

  useEffect(() => {
    const sections = landingNav
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full text-white transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-black/90 backdrop-blur-md"
          : "border-b border-transparent bg-gradient-to-b from-black/50 to-transparent",
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-[1290px] items-center justify-between gap-6 px-6 transition-all duration-300 lg:px-10",
          scrolled ? "h-16 lg:h-[72px]" : "h-20 lg:h-24",
        )}
      >
        <Link
          href="/"
          onClick={() => setOpen(false)}
          aria-label="Provoks"
          className="flex items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F77229]"
        >
          <BrandLogo
            className={cn(
              "transition-all duration-300",
              scrolled ? "h-10 lg:h-11" : "h-12 lg:h-14",
            )}
          />
        </Link>

        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-1 lg:flex"
        >
          {landingNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active === item.href ? "true" : undefined}
              className={cn(
                "relative rounded-full px-3.5 py-2 text-sm font-medium tracking-wide transition-colors after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-[#F77229] after:transition-transform after:duration-300 hover:text-[#F77229] hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F77229]",
                active === item.href
                  ? "text-[#F77229] after:scale-x-100"
                  : "text-white/80",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button
            asChild
            className="h-10 rounded-full bg-[#F77229] px-5 text-sm font-semibold text-white hover:bg-[#F77229]/90"
          >
            <Link href="/login">Masuk</Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="grid size-11 place-items-center rounded-xl bg-white/10 transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F77229] lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          className="border-t border-white/10 bg-black/95 backdrop-blur-md lg:hidden"
        >
          <nav
            aria-label="Navigasi seluler"
            className="mx-auto flex w-full max-w-[1290px] flex-col gap-1 px-6 py-4 lg:px-10"
          >
            {landingNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active === item.href ? "true" : undefined}
                className={cn(
                  "flex min-h-11 items-center rounded-xl px-4 text-base font-medium transition-colors hover:bg-white/5 hover:text-[#F77229] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F77229]",
                  active === item.href ? "text-[#F77229]" : "text-white/85",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Button
              asChild
              className="mt-3 h-11 rounded-full bg-[#F77229] text-sm font-semibold text-white hover:bg-[#F77229]/90"
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
