"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api, type ApiEnvelope } from "@/lib/api-client";

export type PathJoinCode = {
  id: string;
  code: string;
  status: "ACTIVE" | "EXPIRED" | "REVOKED";
  expiresAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  usedCount: number;
};

export function usePathCodes(pathId: string | null) {
  return useQuery({
    queryKey: ["path-codes", pathId],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<PathJoinCode[]>>(
        `/paths/${pathId}/codes`,
      );
      return data.data;
    },
    enabled: Boolean(pathId),
  });
}

export function useGeneratePathCode(pathId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expiresAt: string | null) => {
      const { data } = await api.post<ApiEnvelope<PathJoinCode>>(
        `/paths/${pathId}/codes`,
        { expiresAt },
      );
      return data.data;
    },
    onSuccess: () => {
      toast.success("Kode akses dibuat");
      void queryClient.invalidateQueries({ queryKey: ["path-codes", pathId] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useRevokePathCode(pathId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (codeId: string) => {
      await api.patch(`/paths/${pathId}/codes/${codeId}/revoke`);
    },
    onSuccess: () => {
      toast.success("Kode dicabut");
      void queryClient.invalidateQueries({ queryKey: ["path-codes", pathId] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
