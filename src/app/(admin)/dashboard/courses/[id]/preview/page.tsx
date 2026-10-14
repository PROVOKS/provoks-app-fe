import { CoursePreview } from "./course-preview";

export const metadata = { title: "Preview Course" };
export const instant = false;

export default async function CoursePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CoursePreview courseId={id} />;
}
