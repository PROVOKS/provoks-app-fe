"use client";

import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api, type ApiEnvelope } from "@/lib/api-client";

export type BulkPayload = {
  action: string;
  ids: string[];
  status?: string;
  role?: string;
  note?: string;
};

/** Kirim aksi massal ke endpoint `<resource>/bulk`. */
export function useBulkAction(endpoint: string, invalidateKeys: string[][]) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: BulkPayload) => {
      const { data } = await api.post<ApiEnvelope<{ affected: number }>>(
        endpoint,
        payload,
      );
      return data.data;
    },
    onSuccess: (result) => {
      toast.success(`${result.affected} data diproses`);
      for (const key of invalidateKeys) {
        void queryClient.invalidateQueries({ queryKey: key });
      }
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

/** State pilihan baris untuk tabel. */
export function useRowSelection() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback((ids: string[]) => {
    setSelected((prev) => {
      const allSelected = ids.length > 0 && ids.every((id) => prev.has(id));
      return allSelected ? new Set() : new Set(ids);
    });
  }, []);

  const clear = useCallback(() => setSelected(new Set()), []);

  return { selected, toggle, toggleAll, clear };
}
