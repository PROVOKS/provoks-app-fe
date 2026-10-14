import { jwtVerify } from "jose";

import type { Role } from "./roles";

export type Session = {
  sub: string;
  email: string;
  role: Role;
};

export const COOKIE_NAME = process.env.COOKIE_NAME ?? "provoks_token";

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "");

/** Verifikasi JWT (HS256) dari cookie sesi. Edge-safe (jose). */
export async function verifySessionToken(
  token: string | undefined,
): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      sub: String(payload.sub ?? ""),
      email: String(payload.email ?? ""),
      role: String(payload.role ?? "STUDENT") as Role,
    };
  } catch {
    return null;
  }
}
