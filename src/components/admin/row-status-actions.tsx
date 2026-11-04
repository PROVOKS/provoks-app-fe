import { Archive, FilePen, Send } from "lucide-react";

import type { RowAction } from "@/components/admin/row-actions";

type PublishStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

/**
 * Aksi ubah status untuk dropdown aksi baris.
 * Status yang sedang aktif tidak ditampilkan supaya tidak jadi aksi tanpa efek.
 */
export function buildStatusActions(
  current: PublishStatus,
  onChange: (status: PublishStatus) => void,
): RowAction[] {
  const items: RowAction[] = [];

  if (current !== "PUBLISHED") {
    items.push({
      label: "Publikasikan",
      icon: <Send />,
      onSelect: () => onChange("PUBLISHED"),
    });
  }

  if (current !== "DRAFT") {
    items.push({
      label: "Jadikan Draft",
      icon: <FilePen />,
      onSelect: () => onChange("DRAFT"),
    });
  }

  if (current !== "ARCHIVED") {
    items.push({
      label: "Arsipkan",
      icon: <Archive />,
      onSelect: () => onChange("ARCHIVED"),
    });
  }

  return items;
}
