import { NextResponse, type NextRequest } from "next/server";

import { COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { homeFor, isStaff } from "@/lib/roles";

/**
 * Role middleware (Next 16: `proxy.ts` menggantikan `middleware.ts`).
 *
 * - `/dashboard/*`  → wajib login, role ADMIN | INSTRUCTOR
 * - `/my-course/*`  → wajib login, role STUDENT
 * - `/login`        → kalau sudah login, langsung ke home sesuai role
 * - `/`             → arahkan sesuai role
 *
 * Ini "optimistic check" untuk routing/UX. Otorisasi sebenarnya tetap
 * di backend (authenticate + authorize).
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = await verifySessionToken(
    request.cookies.get(COOKIE_NAME)?.value,
  );

  const isDashboardArea =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isMyCourseArea =
    pathname === "/my-course" || pathname.startsWith("/my-course/");
  const isLogin = pathname === "/login";
  const isRoot = pathname === "/";

  if (isRoot) {
    return NextResponse.redirect(
      new URL(session ? homeFor(session.role) : "/login", request.url),
    );
  }

  if (isLogin && session) {
    return NextResponse.redirect(new URL(homeFor(session.role), request.url));
  }

  if (isDashboardArea) {
    if (!session) return redirectToLogin(request, pathname, search);
    if (!isStaff(session.role)) {
      return NextResponse.redirect(new URL("/my-course", request.url));
    }
    return NextResponse.next();
  }

  if (isMyCourseArea) {
    if (!session) return redirectToLogin(request, pathname, search);
    if (isStaff(session.role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest, pathname: string, search: string) {
  const url = new URL("/login", request.url);
  url.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*", "/my-course/:path*"],
};
