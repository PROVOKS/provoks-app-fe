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

import { cn } from "@/lib/utils";

const MAIN_NAV = [
  { href: "/my-learning", label: "My Learning", icon: LayoutDashboard },
  { href: "/catalog", label: "Katalog", icon: Grid2x2 },
  { href: "/certificates", label: "Certificates", icon: Award },
  { href: "/profile", label: "Profil", icon: User },
];

const BOTTOM_NAV = [
  { href: "/help", label: "Bantuan", icon: HelpCircle },
  { href: "/settings", label: "Pengaturan", icon: Settings },
];

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
  const active = pathname === href || pathname.startsWith(`${href}/`);

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
  return (
    <aside className="flex w-[248px] shrink-0 flex-col justify-between gap-4 rounded-[20px] border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid size-[34px] place-items-center rounded-[10px] bg-primary font-heading text-[17px] font-bold text-primary-foreground">
              P
            </span>
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

      <div className="flex items-center gap-2.5 rounded-xl bg-muted p-2.5">
        <span className="grid size-[34px] place-items-center rounded-full bg-primary/10 font-heading text-[13px] font-bold text-primary">
          A
        </span>
        <div className="flex flex-col">
          <span className="text-[13px] font-semibold">Andi Pratama</span>
          <span className="text-[11px] text-muted-foreground">Siswa</span>
        </div>
      </div>
    </aside>
  );
}
