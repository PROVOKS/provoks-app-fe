"use client";

import { useQuery } from "@tanstack/react-query";

import { api, type ApiEnvelope } from "@/lib/api-client";

export type DashboardStats = {
  students: number;
  instructors: number;
  admins: number;
  courses: number;
  publishedCourses: number;
  paths: number;
  tags: number;
  enrollments: number;
  pendingPathRequests: number;
  completionRate: number;
  learningMinutes: number;
  enrollmentsPerMonth: { month: string; count: number }[];
  /** null = entitas belum ada di sistem → tampilkan "Coming soon" */
  assignments: number | null;
  certificates: number | null;
  payments: number | null;
};

export function useDashboardStats() {
  return useQuery({
    queryKey: ["stats", "dashboard"],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<DashboardStats>>("/stats");
      return data.data;
    },
  });
}
