"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api, type ApiEnvelope } from "@/lib/api-client";
import type { ContentBlock, Course, CoursePart, SilabusPart } from "@/types";

export type CourseDetail = Course & { parts: CoursePart[] };

export function useCourseDetail(courseId: string) {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<CourseDetail>>(
        `/courses/${courseId}`,
      );
      return data.data;
    },
    enabled: Boolean(courseId),
  });
}

type ReorderItem = { id: string; order: number };

export function useCourseMutations(courseId: string) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["course", courseId] });

  const onError = (error: Error) => toast.error(error.message);

  // ---------- course ----------
  const updateCourse = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.put<ApiEnvelope<Course>>(
        `/courses/${courseId}`,
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      toast.success("Course diperbarui");
      void invalidate();
      void queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError,
  });

  // ---------- course parts ----------
  const createPart = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.post<ApiEnvelope<CoursePart>>(
        "/silabus/course-parts",
        { courseId, ...payload },
      );
      return data.data;
    },
    onSuccess: () => {
      toast.success("Course part ditambahkan");
      void invalidate();
    },
    onError,
  });

  const updatePart = useMutation({
    mutationFn: async ({ id, ...payload }: { id: string } & Record<string, unknown>) => {
      const { data } = await api.put<ApiEnvelope<CoursePart>>(
        `/silabus/course-parts/${id}`,
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      toast.success("Course part diperbarui");
      void invalidate();
    },
    onError,
  });

  const deletePart = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/silabus/course-parts/${id}`);
    },
    onSuccess: () => {
      toast.success("Course part dihapus");
      void invalidate();
    },
    onError,
  });

  const reorderParts = useMutation({
    mutationFn: async (items: ReorderItem[]) => {
      await api.put("/silabus/course-parts/reorder", { items });
    },
    onSuccess: () => void invalidate(),
    onError,
  });

  // ---------- silabus parts ----------
  const createSilabus = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.post<ApiEnvelope<SilabusPart>>(
        "/silabus/silabus-parts",
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      toast.success("Silabus part ditambahkan");
      void invalidate();
    },
    onError,
  });

  const updateSilabus = useMutation({
    mutationFn: async ({ id, ...payload }: { id: string } & Record<string, unknown>) => {
      const { data } = await api.put<ApiEnvelope<SilabusPart>>(
        `/silabus/silabus-parts/${id}`,
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      toast.success("Silabus part diperbarui");
      void invalidate();
    },
    onError,
  });

  const deleteSilabus = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/silabus/silabus-parts/${id}`);
    },
    onSuccess: () => {
      toast.success("Silabus part dihapus");
      void invalidate();
    },
    onError,
  });

  const reorderSilabus = useMutation({
    mutationFn: async (items: ReorderItem[]) => {
      await api.put("/silabus/reorder", { items });
    },
    onSuccess: () => void invalidate(),
    onError,
  });

  // ---------- content blocks ----------
  const createBlock = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.post<ApiEnvelope<ContentBlock>>(
        "/blocks",
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      toast.success("Block ditambahkan");
      void invalidate();
    },
    onError,
  });

  const updateBlock = useMutation({
    mutationFn: async ({ id, ...payload }: { id: string } & Record<string, unknown>) => {
      const { data } = await api.put<ApiEnvelope<ContentBlock>>(
        `/blocks/${id}`,
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      toast.success("Block diperbarui");
      void invalidate();
    },
    onError,
  });

  const deleteBlock = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/blocks/${id}`);
    },
    onSuccess: () => {
      toast.success("Block dihapus");
      void invalidate();
    },
    onError,
  });

  const reorderBlocks = useMutation({
    mutationFn: async (items: ReorderItem[]) => {
      await api.put("/blocks/reorder", { items });
    },
    onSuccess: () => void invalidate(),
    onError,
  });

  // ---------- quiz ----------
  const createQuestion = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      await api.post("/quiz/questions", payload);
    },
    onSuccess: () => {
      toast.success("Soal ditambahkan");
      void invalidate();
    },
    onError,
  });

  const updateQuestion = useMutation({
    mutationFn: async ({ id, ...payload }: { id: string } & Record<string, unknown>) => {
      await api.put(`/quiz/questions/${id}`, payload);
    },
    onSuccess: () => {
      toast.success("Soal diperbarui");
      void invalidate();
    },
    onError,
  });

  const deleteQuestion = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/quiz/questions/${id}`);
    },
    onSuccess: () => {
      toast.success("Soal dihapus");
      void invalidate();
    },
    onError,
  });

  const importQuiz = useMutation({
    mutationFn: async ({
      blockId,
      payload,
    }: {
      blockId: string;
      payload: { questions: { q: string; options: string[]; answer: number }[] };
    }) => {
      await api.post(`/quiz/blocks/${blockId}/import`, payload);
    },
    onSuccess: () => {
      toast.success("Soal berhasil diimport");
      void invalidate();
    },
    onError,
  });

  return {
    updateCourse,
    createPart,
    updatePart,
    deletePart,
    reorderParts,
    createSilabus,
    updateSilabus,
    deleteSilabus,
    reorderSilabus,
    createBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    importQuiz,
  };
}
