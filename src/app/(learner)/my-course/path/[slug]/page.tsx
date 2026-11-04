import { PathDetail } from "./path-detail";

export const metadata = { title: "Detail Path" };
export const instant = false;

export default async function PathDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PathDetail slug={slug} />;
}
