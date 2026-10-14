import { QuizResult } from "./quiz-result";

export const metadata = { title: "Hasil Kuis" };
export const instant = false;

export default async function QuizResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ attempt?: string }>;
}) {
  const { id } = await params;
  const { attempt } = await searchParams;
  return <QuizResult blockId={id} attemptId={attempt ?? null} />;
}
