import { QuizAttempt } from "./quiz-attempt";

export const metadata = { title: "Kuis" };
export const instant = false;

export default async function QuizAttemptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <QuizAttempt blockId={id} />;
}
