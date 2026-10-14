import { CoursePlayer } from "./course-player";

export const metadata = { title: "Belajar" };
export const instant = false;

export default async function CoursePlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CoursePlayer slug={slug} />;
}
