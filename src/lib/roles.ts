export type Role = "ADMIN" | "INSTRUCTOR" | "STUDENT";

export const STAFF_ROLES: Role[] = ["ADMIN", "INSTRUCTOR"];

export function isStaff(role: Role) {
  return STAFF_ROLES.includes(role);
}

/** Halaman awal sesuai role. */
export function homeFor(role: Role) {
  return isStaff(role) ? "/dashboard" : "/my-course";
}
