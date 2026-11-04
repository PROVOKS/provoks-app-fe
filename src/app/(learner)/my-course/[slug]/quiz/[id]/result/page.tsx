import { QuizResult } from "./quiz-result";

export const metadata = { title: "Hasil Kuis" };
export const instant = false;

export default async function QuizResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; id: string }>;
  searchParams: Promise<{ attempt?: string }>;
}) {
  const { slug, id } = await params;
  const { attempt } = await searchParams;
  return <QuizResult slug={slug} blockId={id} attemptId={attempt ?? null} />;
}
