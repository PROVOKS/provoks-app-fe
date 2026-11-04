import { QuizAttempt } from "./quiz-attempt";

export const metadata = { title: "Kuis" };
export const instant = false;

export default async function QuizAttemptPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  return <QuizAttempt slug={slug} blockId={id} />;
}
