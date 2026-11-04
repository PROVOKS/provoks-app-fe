"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api, type ApiEnvelope } from "@/lib/api-client";

export type PathMentor = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
  assignedAt: string;
};

export function usePathMentors(pathId: string | null) {
  return useQuery({
    queryKey: ["path-mentors", pathId],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<PathMentor[]>>(
        `/paths/${pathId}/mentors`,
      );
      return data.data;
    },
    enabled: Boolean(pathId),
  });
}

export function useAddPathMentor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pathId,
      userId,
    }: {
      pathId: string;
      userId: string;
    }) => {
      const { data } = await api.post<ApiEnvelope<PathMentor>>(
        `/paths/${pathId}/mentors`,
        { userId },
      );
      return data.data;
    },
    onSuccess: (_data, variables) => {
      toast.success("Mentor dialokasikan");
      void queryClient.invalidateQueries({
        queryKey: ["path-mentors", variables.pathId],
      });
      void queryClient.invalidateQueries({ queryKey: ["paths"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useRemovePathMentor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pathId,
      userId,
    }: {
      pathId: string;
      userId: string;
    }) => {
      await api.delete(`/paths/${pathId}/mentors/${userId}`);
      return { pathId, userId };
    },
    onSuccess: (_data, variables) => {
      toast.success("Alokasi mentor dicabut");
      void queryClient.invalidateQueries({
        queryKey: ["path-mentors", variables.pathId],
      });
      void queryClient.invalidateQueries({ queryKey: ["paths"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
