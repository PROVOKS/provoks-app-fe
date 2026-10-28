"use client";

import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/skeleton";

/**
 * Halaman detail kursus sepenuhnya interaktif (semua datanya diambil lewat
 * react-query di client), jadi isinya dirender CSR saja — tidak ada gunanya
 * SSR pohon komponen yang berat ini, karena di server cuma menghasilkan skeleton.
 */
const CourseDetail = dynamic(
  () => import("./course-detail").then((mod) => mod.CourseDetail),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-[380px_minmax(0,1fr)]">
          <Skeleton className="h-[600px]" />
          <Skeleton className="h-[600px]" />
        </div>
      </div>
    ),
  },
);

export function CourseDetailClient({ courseId }: { courseId: string }) {
  return <CourseDetail courseId={courseId} />;
}
