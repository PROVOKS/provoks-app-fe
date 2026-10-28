"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  LayoutDashboard,
  PanelLeft,
  Route,
  Tags,
  UserCheck,
  Users,
} from "lucide-react";

import { BrandLogo } from "@/components/shared/brand-logo";
import { LogoutButton } from "@/components/shared/logout-button";
import { api, type ApiEnvelope } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import type { Paginated, PathRequest } from "@/types";

const MAIN_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/courses", label: "Courses", icon: BookOpen },
  { href: "/dashboard/paths", label: "Paths", icon: Route },
  { href: "/dashboard/tags", label: "Tags", icon: Tags },
  { href: "/dashboard/users", label: "Users", icon: Users },
];

const MANAGE_NAV = [
  { href: "/dashboard/path-requests", label: "Permintaan Path", icon: UserCheck },
];

function isNavActive(pathname: string, href: string) {
  if (pathname === href) return true;
  // root section (/dashboard) jangan ikut aktif di sub-halaman
  if (href === "/dashboard") return false;
  return pathname.startsWith(`${href}/`);
}

function NavItem({
  href,
  label,
  icon: Icon,
  badge,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isNavActive(pathname, href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex h-9 items-center justify-between rounded-[10px] px-2.5 text-sm transition-colors",
        active
          ? "bg-primary/10 font-semibold text-primary"
          : "text-foreground hover:bg-muted",
      )}
    >
      <span className="flex items-center gap-2.5">
        <Icon
          className={cn("size-4.5", active ? "text-primary" : "text-muted-foreground")}
        />
        {label}
      </span>
      {badge ? (
        <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

export function AppSidebar({
  onNavigate,
}: {
  onNavigate?: () => void;
} = {}) {
  const { data: pendingRequests } = useQuery({
    queryKey: ["path-requests", "PENDING"],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Paginated<PathRequest>>>(
        "/users/path-requests",
        { params: { status: "PENDING", perPage: 1 } },
      );
      return data.data.meta.total;
    },
  });

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
            <NavItem key={item.href} {...item} onNavigate={onNavigate} />
          ))}
        </nav>

        <div className="h-px bg-border" />
        <p className="text-[11px] font-semibold tracking-wider text-muted-foreground">
          MANAGE
        </p>
        <nav className="flex flex-col gap-1">
          {MANAGE_NAV.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              onNavigate={onNavigate}
              badge={
                item.href === "/dashboard/path-requests" && pendingRequests
                  ? String(pendingRequests)
                  : undefined
              }
            />
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-3">
        <nav className="flex flex-col gap-1">
          <LogoutButton />
        </nav>
        <p className="text-[11px] text-muted-foreground">Provoks LMS v1.0</p>
      </div>
    </aside>
  );
}
