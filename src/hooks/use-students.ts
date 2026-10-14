"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api, type ApiEnvelope } from "@/lib/api-client";
import type {
  Paginated,
  PathEnrollmentStatus,
  PathRequest,
  Student,
} from "@/types";

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

export function useStudents(params: { search?: string; pathId?: string; page?: number }) {
  return useQuery({
    queryKey: ["students", params],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Paginated<Student>>>("/students", {
        params: { ...params, perPage: 20 },
      });
      return data.data;
    },
  });
}

/** Preview CSV (tidak menulis ke DB) */
export function usePreviewImportStudents() {
  return useMutation({
    mutationFn: async (csv: string) => {
      const { data } = await api.post<ApiEnvelope<ImportPreview>>(
        "/students/import/preview",
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
        "/students/import",
        { csv },
      );
      return data.data;
    },
    onSuccess: (result) => {
      toast.success(
        `Import selesai: ${result.imported} siswa (${result.created} baru, ${result.updated} diperbarui)`,
      );
      void queryClient.invalidateQueries({ queryKey: ["students"] });
      void queryClient.invalidateQueries({ queryKey: ["path-requests"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function usePathRequests(status: PathEnrollmentStatus | "ALL" = "PENDING") {
  return useQuery({
    queryKey: ["path-requests", status],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Paginated<PathRequest>>>(
        "/students/path-requests",
        { params: { status, perPage: 50 } },
      );
      return data.data;
    },
  });
}

export function useReviewPathRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      id: string;
      status: "APPROVED" | "REJECTED";
      note?: string;
    }) => {
      const { data } = await api.patch<ApiEnvelope<unknown>>(
        `/students/path-requests/${payload.id}`,
        { status: payload.status, note: payload.note },
      );
      return data.data;
    },
    onSuccess: (_data, variables) => {
      toast.success(
        variables.status === "APPROVED" ? "Pengajuan disetujui" : "Pengajuan ditolak",
      );
      void queryClient.invalidateQueries({ queryKey: ["path-requests"] });
      void queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
