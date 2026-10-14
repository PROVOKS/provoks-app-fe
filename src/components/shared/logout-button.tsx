"use client";

import { LogOut } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

export function LogoutButton({ className }: { className?: string }) {
  const { logout } = useAuth();

  return (
    <button
      type="button"
      onClick={() => void logout()}
      className={cn(
        "flex h-9 items-center gap-2.5 rounded-[10px] px-2.5 text-sm text-foreground transition-colors hover:bg-muted",
        className,
      )}
    >
      <LogOut className="size-4.5 text-muted-foreground" />
      Keluar
    </button>
  );
}
