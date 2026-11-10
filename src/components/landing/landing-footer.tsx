import { Briefcase, Camera, GitBranch, Mail, type LucideIcon } from "lucide-react";

import { BrandLogo } from "@/components/shared/brand-logo";
import { footerContent } from "@/lib/landing-content";

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  Instagram: Camera,
  LinkedIn: Briefcase,
  Github: GitBranch,
};

export function LandingFooter() {
  return (
    <footer className="bg-[#1F1F1F] text-white">
      <div className="mx-auto grid w-full max-w-[1290px] gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[1.5fr_1fr_1fr] lg:py-20">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo className="h-10" />
            <span className="font-heading text-lg font-bold text-white">
              Provoks
            </span>
          </div>
          <p className="max-w-sm text-base/7 text-white">
            {footerContent.description}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-[2px] text-white">
            NAVIGASI
          </p>
          <ul className="flex flex-col gap-2 text-sm">
            {footerContent.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-white transition-colors hover:text-[#F77229]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-[2px] text-white">
            TERHUBUNG
          </p>
          <a
            href={`mailto:${footerContent.contact}`}
            className="flex items-center gap-2 text-sm text-white transition-colors hover:text-[#F77229]"
          >
            <Mail className="size-4" />
            {footerContent.contact}
          </a>
          <div className="mt-1 flex gap-2">
            {footerContent.social.map((item) => {
              const Icon = SOCIAL_ICONS[item.label] ?? Mail;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  className="grid size-10 place-items-center rounded-xl bg-black text-white transition-colors hover:bg-black/80"
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto w-full max-w-[1290px] px-6 py-6 text-center text-xs text-white sm:px-10">
          <p>{footerContent.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
