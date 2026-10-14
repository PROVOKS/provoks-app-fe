import { CourseDetail } from "./course-detail";

export const metadata = { title: "Detail Kursus" };
export const instant = false;

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CourseDetail courseId={id} />;
}
