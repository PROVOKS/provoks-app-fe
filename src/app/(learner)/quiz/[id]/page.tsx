import { QuizAttempt } from "./quiz-attempt";

export const metadata = { title: "Quiz" };
export const instant = false;

export default async function QuizAttemptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <QuizAttempt id={id} />;
}
