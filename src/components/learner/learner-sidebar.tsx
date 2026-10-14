"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  Grid2x2,
  HelpCircle,
  LayoutDashboard,
  PanelLeft,
  Settings,
  User,
} from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { BrandLogo } from "@/components/shared/brand-logo";
import { LogoutButton } from "@/components/shared/logout-button";
import { cn } from "@/lib/utils";

const MAIN_NAV = [
  { href: "/my-course", label: "My Learning", icon: LayoutDashboard },
  { href: "/my-course/catalog", label: "Katalog", icon: Grid2x2 },
  { href: "/my-course/certificates", label: "Certificates", icon: Award },
  { href: "/my-course/profile", label: "Profil", icon: User },
];

const BOTTOM_NAV = [
  { href: "/my-course/help", label: "Bantuan", icon: HelpCircle },
  { href: "/my-course/settings", label: "Pengaturan", icon: Settings },
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
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const pathname = usePathname();
  const active = isNavActive(pathname, href);

  return (
    <Link
      href={href}
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

export function LearnerSidebar() {
  const { user } = useAuth();
  const initials = (user?.name ?? "Siswa").charAt(0).toUpperCase();

  return (
    <aside className="flex h-full w-[248px] shrink-0 flex-col justify-between gap-4 overflow-y-auto rounded-[20px] border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BrandLogo className="h-[34px]" />
            <span className="font-heading text-[17px] font-bold">Provoks</span>
          </div>
          <PanelLeft className="size-4.5 text-muted-foreground" />
        </div>

        <nav className="flex flex-col gap-1">
          {MAIN_NAV.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>

        <div className="h-px bg-border" />
        <p className="text-[11px] font-semibold tracking-wider text-muted-foreground">
          LAINNYA
        </p>
        <nav className="flex flex-col gap-1">
          {BOTTOM_NAV.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2.5 rounded-xl bg-muted p-2.5">
          <span className="grid size-[34px] place-items-center rounded-full bg-primary/10 font-heading text-[13px] font-bold text-primary">
            {initials}
          </span>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-[13px] font-semibold">
              {user?.name ?? "Siswa"}
            </span>
            <span className="text-[11px] text-muted-foreground">Siswa</span>
          </div>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}
