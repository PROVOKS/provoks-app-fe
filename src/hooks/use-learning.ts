"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api, type ApiEnvelope } from "@/lib/api-client";
import type { ContentBlock, Course, CoursePart, Path, SilabusPart, Tag } from "@/types";

export type LearningBlock = ContentBlock & {
  attempt?: { id: string; score: number; passed: boolean } | null;
};

export type LearningSilabusPart = Omit<SilabusPart, "blocks"> & {
  hasContent: boolean;
  hasQuiz: boolean;
  completed: boolean;
  quizPassed: boolean;
  unlocked: boolean;
  lockedReason: string | null;
  blocks: LearningBlock[];
};

export type LearningCourse = Omit<Course, "parts"> & {
  parts: (Omit<CoursePart, "silabusParts"> & {
    silabusParts: LearningSilabusPart[];
  })[];
};

export type LearningCourseResponse = {
  course: LearningCourse;
  enrollment: { id: string; progressPercent: number };
  summary: { total: number; done: number; progressPercent: number };
};

export type MyCourse = {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl?: string | null;
  progressPercent: number;
  silabusCount: number;
  durationMinutes: number;
  path?: Path | null;
  tags?: Tag[];
  isFastTrack?: boolean;
  enrolledAt?: string | null;
  /// terkunci karena course prasyarat belum selesai
  locked?: boolean;
  blockedBy?: {
    id: string;
    title: string;
    slug: string;
    progressPercent: number;
  } | null;
};

export type QuizPayload = {
  id: string;
  silabusPartId: string;
  title: string;
  passingGrade: number;
  questions: {
    id: string;
    question: string;
    options: string[];
    points: number;
    order: number;
  }[];
  lastAttempt: { id: string; score: number; passed: boolean } | null;
};

export type QuizReviewItem = {
  questionId: string;
  question: string;
  options: string[];
  answerIndex: number;
  chosenIndex: number | null;
  correct: boolean;
  points: number;
};

export type QuizSubmitResult = {
  attemptId: string;
  score: number;
  passed: boolean;
  passingGrade: number;
  totalPoints: number;
  earned: number;
  review: QuizReviewItem[];
};

export type QuizAttemptResult = {
  attemptId: string;
  score: number;
  passed: boolean;
  passingGrade: number;
  courseTitle: string;
  quizTitle: string;
  silabusPartId: string;
  submittedAt: string;
  review: QuizReviewItem[];
};

export type LearningPath = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  courseCount: number;
  /// true kalau siswa sudah bergabung lewat kode
  joined: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED" | null;
  enrollmentId: string | null;
};

export function useMyPaths() {
  return useQuery({
    queryKey: ["learning-paths"],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<LearningPath[]>>("/learning/paths");
      return data.data;
    },
  });
}

/** Gabung path memakai kode dari admin. */
export function useJoinPath() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      const { data } = await api.post<
        ApiEnvelope<{
          alreadyJoined: boolean;
          path: { id: string; name: string; slug: string };
        }>
      >("/learning/paths/join", { code });
      return data.data;
    },
    onSuccess: (result) => {
      toast.success(
        result.alreadyJoined
          ? `Kamu sudah terdaftar di ${result.path.name}`
          : `Berhasil bergabung ke ${result.path.name}`,
      );
      void queryClient.invalidateQueries({ queryKey: ["learning-paths"] });
      void queryClient.invalidateQueries({ queryKey: ["learning-my-courses"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useLearningCourse(slug: string) {
  return useQuery({
    queryKey: ["learning-course", slug],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<LearningCourseResponse>>(
        `/learning/courses/${slug}`,
      );
      return data.data;
    },
    enabled: Boolean(slug),
  });
}

export function useMyCourses() {
  return useQuery({
    queryKey: ["learning-my-courses"],
    queryFn: async () => {
      const { data } =
        await api.get<ApiEnvelope<MyCourse[]>>("/learning/my-courses");
      return data.data;
    },
  });
}

export function useUpdateProgress(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { silabusPartId: string; completed: boolean }) => {
      await api.post("/learning/progress", payload);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["learning-course", slug] });
      void queryClient.invalidateQueries({ queryKey: ["learning-my-courses"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useQuiz(blockId: string) {
  return useQuery({
    queryKey: ["learning-quiz", blockId],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<QuizPayload>>(
        `/learning/quiz/${blockId}`,
      );
      return data.data;
    },
    enabled: Boolean(blockId),
  });
}

export function useSubmitQuiz(blockId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (answers: Record<string, number>) => {
      const { data } = await api.post<ApiEnvelope<QuizSubmitResult>>(
        `/learning/quiz/${blockId}/submit`,
        { answers },
      );
      return data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["learning-quiz", blockId] });
      void queryClient.invalidateQueries({ queryKey: ["learning-course"] });
      void queryClient.invalidateQueries({ queryKey: ["learning-my-courses"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useQuizAttempt(attemptId: string) {
  return useQuery({
    queryKey: ["learning-attempt", attemptId],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<QuizAttemptResult>>(
        `/learning/quiz/attempts/${attemptId}`,
      );
      return data.data;
    },
    enabled: Boolean(attemptId),
  });
}
