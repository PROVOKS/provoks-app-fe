"use client";

import Link from "next/link";
import { LogOut, Settings, User as UserIcon } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserMenuProps = {
  profileHref?: string;
  settingsHref?: string;
};

export function UserMenu({ profileHref, settingsHref }: UserMenuProps) {
  const { user, logout } = useAuth();
  const initials = (user?.name ?? "?").charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Menu akun"
          className="grid size-9.5 place-items-center rounded-full bg-primary/10 font-heading text-sm font-bold text-primary outline-none transition-colors hover:bg-primary/20 focus-visible:ring-2 focus-visible:ring-ring"
        >
          {initials}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold">
              {user?.name ?? "Belum masuk"}
            </span>
            <span className="text-xs font-normal text-muted-foreground">
              {user?.email ?? "-"}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {profileHref ? (
          <DropdownMenuItem asChild>
            <Link href={profileHref}>
              <UserIcon />
              Profil
            </Link>
          </DropdownMenuItem>
        ) : null}

        {settingsHref ? (
          <DropdownMenuItem asChild>
            <Link href={settingsHref}>
              <Settings />
              Pengaturan
            </Link>
          </DropdownMenuItem>
        ) : null}

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onClick={() => void logout()}>
          <LogOut />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
