"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  PanelLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Route,
  Tags,
  Users,
} from "lucide-react";

import { BrandLogo } from "@/components/shared/brand-logo";
import { LogoutButton } from "@/components/shared/logout-button";
import { cn } from "@/lib/utils";

const MAIN_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/courses", label: "Courses", icon: BookOpen },
  { href: "/dashboard/paths", label: "Paths", icon: Route },
  { href: "/dashboard/tags", label: "Tags", icon: Tags },
  { href: "/dashboard/users", label: "Users", icon: Users },
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
  collapsed,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const pathname = usePathname();
  const active = isNavActive(pathname, href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={cn(
        "relative flex h-9 items-center rounded-[10px] text-sm transition-colors",
        collapsed ? "justify-center px-0" : "justify-between px-2.5",
        active
          ? "bg-primary/10 font-semibold text-primary"
          : "text-foreground hover:bg-muted",
      )}
    >
      <span className="flex items-center gap-2.5">
        <Icon
          className={cn("size-4.5 shrink-0", active ? "text-primary" : "text-muted-foreground")}
        />
        {collapsed ? null : label}
      </span>

      {badge && !collapsed ? (
        <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
          {badge}
        </span>
      ) : null}

      {badge && collapsed ? (
        <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" />
      ) : null}
    </Link>
  );
}

export function AppSidebar({
  onNavigate,
  collapsed = false,
  onToggleCollapse,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
  /** kalau diisi, tombol ciutkan/perluas ditampilkan */
  onToggleCollapse?: () => void;
} = {}) {
  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col justify-between gap-4 overflow-y-auto overflow-x-hidden rounded-[20px] border border-border bg-card shadow-sm transition-[width,padding] duration-200",
        collapsed ? "w-[76px] p-2.5" : "w-[248px] p-4",
      )}
    >
      <div className="flex flex-col gap-4">
        <div
          className={cn(
            "flex items-center",
            collapsed ? "flex-col gap-2" : "justify-between",
          )}
        >
          <div className={cn("flex items-center gap-2.5", collapsed && "justify-center")}>
            <BrandLogo className="h-[34px]" />
            {collapsed ? null : (
              <span className="font-heading text-[17px] font-bold">Provoks</span>
            )}
          </div>

          {onToggleCollapse ? (
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
              title={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
              className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"
            >
              {collapsed ? (
                <PanelLeftOpen className="size-4.5" />
              ) : (
                <PanelLeftClose className="size-4.5" />
              )}
            </button>
          ) : (
            <PanelLeft className="size-4.5 text-muted-foreground" />
          )}
        </div>

        <nav className="flex flex-col gap-1">
          {MAIN_NAV.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              onNavigate={onNavigate}
              collapsed={collapsed}
            />
          ))}
        </nav>

      </div>

      <div className="flex flex-col gap-3">
        <nav className="flex flex-col gap-1">
          <LogoutButton compact={collapsed} />
        </nav>
        {collapsed ? null : (
          <p className="text-[11px] text-muted-foreground">Provoks LMS v1.0</p>
        )}
      </div>
    </aside>
  );
}
