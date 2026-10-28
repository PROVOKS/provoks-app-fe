"use client";

import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserMenu } from "@/components/shared/user-menu";

export function AppTopbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="flex h-14 w-full items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <Button
          variant="outline"
          size="icon"
          className="size-9.5 shrink-0 rounded-[10px] bg-card lg:hidden"
          onClick={onMenuClick}
          aria-label="Buka menu"
        >
          <Menu className="size-4.5" />
        </Button>

        <div className="relative hidden w-[240px] min-w-0 sm:block md:w-[360px]">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari course, siswa..."
            className="h-10 rounded-xl bg-card pl-10"
          />
          <kbd className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 rounded-md bg-muted px-2 py-0.5 text-[12px] font-semibold text-muted-foreground md:block">
            Ctrl K
          </kbd>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Button
          variant="outline"
          size="icon"
          className="size-9.5 rounded-[10px] bg-card"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label="Ganti tema"
        >
          <Sun className="size-4.5 dark:hidden" />
          <Moon className="hidden size-4.5 dark:block" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="hidden size-9.5 rounded-[10px] bg-card sm:inline-flex"
          aria-label="Notifikasi"
        >
          <Bell className="size-4.5" />
        </Button>
        <UserMenu settingsHref="/dashboard/settings" />
      </div>
    </header>
  );
}
