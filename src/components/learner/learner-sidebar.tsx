"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Route } from "lucide-react";

import { BrandLogo } from "@/components/shared/brand-logo";
import { LogoutButton } from "@/components/shared/logout-button";
import { cn } from "@/lib/utils";

const MAIN_NAV = [
  { href: "/my-course", label: "My Learning", icon: LayoutDashboard },
  { href: "/my-course/path", label: "Path", icon: Route },
];

function isNavActive(pathname: string, href: string) {
  if (pathname === href) return true;
  // root section (/my-course) jangan ikut aktif di sub-halaman
  if (href === "/my-course") return false;
  return pathname.startsWith(`${href}/`);
}

function NavItem({
  href,
  label,
  icon: Icon,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isNavActive(pathname, href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex h-9 items-center gap-2.5 rounded-[10px] px-2.5 text-sm transition-colors",
        active
          ? "bg-primary/10 font-semibold text-primary"
          : "text-foreground hover:bg-muted",
      )}
    >
      <Icon
        className={cn("size-4.5", active ? "text-primary" : "text-muted-foreground")}
      />
      {label}
    </Link>
  );
}

export function LearnerSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="flex h-full w-[248px] shrink-0 flex-col justify-between gap-4 overflow-y-auto rounded-[20px] border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <BrandLogo className="h-[34px]" />
          <span className="font-heading text-[17px] font-bold">Provoks</span>
        </div>

        <nav className="flex flex-col gap-1">
          {MAIN_NAV.map((item) => (
            <NavItem key={item.href} {...item} onNavigate={onNavigate} />
          ))}
        </nav>
      </div>

      <LogoutButton />
    </aside>
  );
}
