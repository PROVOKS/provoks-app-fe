"use client";

import { Ellipsis, Pencil, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type RowAction = {
  label: string;
  icon?: React.ReactNode;
  onSelect: () => void;
  destructive?: boolean;
  disabled?: boolean;
};

type RowActionsProps = {
  /** Aksi khusus baris (ubah status, kode akses, ubah role, dst). */
  actions?: RowAction[];
  onEdit?: () => void;
  onDelete?: () => void;
  label?: string;
};

export function RowActions({
  actions = [],
  onEdit,
  onDelete,
  label = "Aksi baris",
}: RowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className="grid size-8 place-items-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-muted"
        >
          <Ellipsis className="size-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.label}
            disabled={action.disabled}
            variant={action.destructive ? "destructive" : undefined}
            onClick={action.onSelect}
          >
            {action.icon}
            {action.label}
          </DropdownMenuItem>
        ))}

        {actions.length > 0 && onEdit ? <DropdownMenuSeparator /> : null}

        {onEdit ? (
          <DropdownMenuItem onClick={onEdit}>
            <Pencil />
            Edit
          </DropdownMenuItem>
        ) : null}

        {onDelete ? (
          <>
            {actions.length > 0 || onEdit ? <DropdownMenuSeparator /> : null}
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              <Trash2 />
              Hapus
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
