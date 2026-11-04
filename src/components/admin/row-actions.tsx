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
  /** Aksi khusus satu baris (kode akses, ubah status, ubah role, dst). */
  actions?: RowAction[];
  /**
   * Aksi saat ada baris yang dicentang (mode massal).
   * Kalau diisi, isinya menggantikan `actions` selama `selectionCount > 0`.
   */
  bulkActions?: RowAction[];
  /** Jumlah baris terpilih. > 0 berarti mode aksi massal. */
  selectionCount?: number;
  onEdit?: () => void;
  /** Hapus baris ini saja. */
  onDelete?: () => void;
  /** Hapus semua baris terpilih. */
  onBulkDelete?: () => void;
  label?: string;
};

export function RowActions({
  actions = [],
  bulkActions = [],
  selectionCount = 0,
  onEdit,
  onDelete,
  onBulkDelete,
  label = "Aksi baris",
}: RowActionsProps) {
  const isBulk = selectionCount > 0;
  const items = isBulk ? bulkActions : actions;
  const canDelete = isBulk ? Boolean(onBulkDelete) : Boolean(onDelete);

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

      <DropdownMenuContent align="end" className="w-52">
        {items.map((action) => (
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

        {items.length > 0 && onEdit ? <DropdownMenuSeparator /> : null}

        {onEdit ? (
          <DropdownMenuItem disabled={isBulk} onClick={onEdit}>
            <Pencil />
            Edit
          </DropdownMenuItem>
        ) : null}

        {canDelete ? (
          <>
            {items.length > 0 || onEdit ? <DropdownMenuSeparator /> : null}
            <DropdownMenuItem
              variant="destructive"
              onClick={isBulk ? onBulkDelete : onDelete}
            >
              <Trash2 />
              {isBulk ? `Hapus ${selectionCount} baris` : "Hapus"}
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
