import { Archive, FilePen, Send } from "lucide-react";

import type { RowAction } from "@/components/admin/row-actions";

type PublishStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

/**
 * Aksi ubah status untuk dropdown aksi baris.
 * Status yang sedang aktif tidak ditampilkan supaya tidak jadi aksi tanpa efek.
 * `showAll` dipakai untuk aksi massal (status tiap baris bisa berbeda).
 */
export function buildStatusActions(
  current: PublishStatus,
  onChange: (status: PublishStatus) => void,
  options: { showAll?: boolean } = {},
): RowAction[] {
  const items: RowAction[] = [];
  const show = (status: PublishStatus) =>
    options.showAll === true || current !== status;

  if (show("PUBLISHED")) {
    items.push({
      label: "Publikasikan",
      icon: <Send />,
      onSelect: () => onChange("PUBLISHED"),
    });
  }

  if (show("DRAFT")) {
    items.push({
      label: "Jadikan Draft",
      icon: <FilePen />,
      onSelect: () => onChange("DRAFT"),
    });
  }

  if (show("ARCHIVED")) {
    items.push({
      label: "Arsipkan",
      icon: <Archive />,
      onSelect: () => onChange("ARCHIVED"),
    });
  }

  return items;
}
