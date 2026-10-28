"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api, type ApiEnvelope } from "@/lib/api-client";
import type { ManagedUser, Paginated, Role } from "@/types";

export type UserFilters = {
  search?: string;
  role?: Role | "ALL";
  pathId?: string;
  page?: number;
  perPage?: number;
};

export type ImportRow = {
  line: number;
  nama: string;
  nim: string;
  email: string;
  prodi: string;
  pathSlug: string;
  pathName: string;
  perluReview: boolean;
  catatan: string;
  status: "ok" | "warning" | "error";
  action: "create" | "update";
  message: string;
};

export type ImportPreview = {
  rows: ImportRow[];
  summary: {
    total: number;
    ok: number;
    warning: number;
    error: number;
    create: number;
    update: number;
    paths: { slug: string; name: string; count: number }[];
  };
};

export type ImportResult = {
  total: number;
  imported: number;
  created: number;
  updated: number;
  enrollments: number;
  skipped: number;
  needReview: number;
  errors: { line: number; nama: string; nim: string; message: string }[];
};

export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Paginated<ManagedUser>>>("/users", {
        params: {
          search: filters.search || undefined,
          role: filters.role && filters.role !== "ALL" ? filters.role : undefined,
          pathId: filters.pathId || undefined,
          page: filters.page,
          perPage: filters.perPage ?? 20,
        },
      });
      return data.data;
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      name: string;
      email: string;
      role: Role;
      nim?: string;
      prodi?: string;
      password?: string;
      pathId?: string;
    }) => {
      const { data } = await api.post<ApiEnvelope<ManagedUser>>("/users", payload);
      return data.data;
    },
    onSuccess: (user) => {
      toast.success(`User "${user.name}" ditambahkan`);
      void queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      id: string;
      name?: string;
      email?: string;
      role?: Role;
      nim?: string;
      prodi?: string;
      password?: string;
    }) => {
      const { id, ...body } = payload;
      const { data } = await api.put<ApiEnvelope<ManagedUser>>(`/users/${id}`, body);
      return data.data;
    },
    onSuccess: () => {
      toast.success("User diperbarui");
      void queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      toast.success("User dihapus");
      void queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

/** Preview CSV (tidak menulis ke DB) */
export function usePreviewImportStudents() {
  return useMutation({
    mutationFn: async (csv: string) => {
      const { data } = await api.post<ApiEnvelope<ImportPreview>>(
        "/users/import/preview",
        { csv },
      );
      return data.data;
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useImportStudents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (csv: string) => {
      const { data } = await api.post<ApiEnvelope<ImportResult>>(
        "/users/import",
        { csv },
      );
      return data.data;
    },
    onSuccess: (result) => {
      toast.success(
        `Import selesai: ${result.imported} siswa (${result.created} baru, ${result.updated} diperbarui)`,
      );
      void queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
