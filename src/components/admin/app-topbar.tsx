"use client";

import { Bell, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserMenu } from "@/components/shared/user-menu";

export function AppTopbar() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="flex h-14 w-full items-center justify-between">
      <div className="relative w-[360px]">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari course, siswa..."
          className="h-10 rounded-xl bg-card pl-10"
        />
        <kbd className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md bg-muted px-2 py-0.5 text-[12px] font-semibold text-muted-foreground">
          Ctrl K
        </kbd>
      </div>

      <div className="flex items-center gap-3">
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
          className="size-9.5 rounded-[10px] bg-card"
          aria-label="Notifikasi"
        >
          <Bell className="size-4.5" />
        </Button>
        <UserMenu settingsHref="/dashboard/settings" />
      </div>
    </header>
  );
}
