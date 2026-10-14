"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  ClipboardList,
  CreditCard,
  FileText,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  PanelLeft,
  Route,
  Settings,
  Tags,
  UserPlus,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

const MAIN_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/paths", label: "Paths", icon: Route },
  { href: "/tags", label: "Tags", icon: Tags },
  { href: "/students", label: "Students", icon: Users },
  { href: "/assignments", label: "Assignments", icon: ClipboardList, badge: "12" },
  { href: "/grades", label: "Grades", icon: BarChart3 },
  { href: "/certificates", label: "Certificates", icon: Award },
];

const MANAGE_NAV = [
  { href: "/enrollments", label: "Enrollments", icon: UserPlus },
  { href: "/instructors", label: "Instructors", icon: GraduationCap },
  { href: "/schedule", label: "Schedule", icon: Calendar },
];

const ANALYTICS_NAV = [
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/payments", label: "Payments", icon: CreditCard },
];

const BOTTOM_NAV = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help & Support", icon: HelpCircle },
];

function NavItem({
  href,
  label,
  icon: Icon,
  badge,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
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

export function AppSidebar() {
  return (
    <aside className="flex h-full w-[248px] shrink-0 flex-col justify-between gap-4 overflow-y-auto rounded-[20px] border border-border bg-card p-4 shadow-sm">
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
          MANAGE
        </p>
        <nav className="flex flex-col gap-1">
          {MANAGE_NAV.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>

        <div className="h-px bg-border" />
        <p className="text-[11px] font-semibold tracking-wider text-muted-foreground">
          ANALYTICS
        </p>
        <nav className="flex flex-col gap-1">
          {ANALYTICS_NAV.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        <nav className="flex flex-col gap-1">
          {BOTTOM_NAV.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>
        <p className="text-[11px] text-muted-foreground">Provoks LMS v1.0</p>
      </div>
    </aside>
  );
}
