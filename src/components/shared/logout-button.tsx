"use client";

import { LogOut } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

export function LogoutButton({
  className,
  compact,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { logout } = useAuth();

  return (
    <button
      type="button"
      onClick={() => void logout()}
      title={compact ? "Keluar" : undefined}
      className={cn(
        "flex h-9 items-center gap-2.5 rounded-[10px] px-2.5 text-sm text-foreground transition-colors hover:bg-muted",
        compact && "justify-center px-0",
        className,
      )}
    >
      <LogOut className="size-4.5 text-muted-foreground" />
      {compact ? null : "Keluar"}
    </button>
  );
}
