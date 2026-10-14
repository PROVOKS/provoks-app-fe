import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { homeFor } from "@/lib/roles";

export const instant = false;

export default async function RootPage() {
  const store = await cookies();
  const session = await verifySessionToken(store.get(COOKIE_NAME)?.value);
  redirect(session ? homeFor(session.role) : "/login");
}
