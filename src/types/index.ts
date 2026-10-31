import type { Role } from "@/lib/roles";

export type { Role };

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string | null;
  createdAt: string;
};

export type Path = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  courseCount?: number;
  createdAt: string;
};

export type PathEnrollmentStatus = "PENDING" | "APPROVED" | "REJECTED";

export type StudentPath = {
  id: string;
  name: string;
  slug: string;
  status: PathEnrollmentStatus;
  enrollmentId: string;
};

/** user yang dikelola dari halaman Manajemen User (semua role) */
export type ManagedUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  nim?: string | null;
  prodi?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
  paths: StudentPath[];
};

export type PathRequest = {
  id: string;
  status: PathEnrollmentStatus;
  note?: string | null;
  createdAt: string;
  reviewedAt?: string | null;
  student: {
    id: string;
    name: string;
    email: string;
    nim?: string | null;
    prodi?: string | null;
  };
  path: {
    id: string;
    name: string;
    slug: string;
  };
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  category?: string | null;
  courseCount?: number;
};

export type Course = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  passingGrade: number;
  /** false = Reguler, true = Fast Track */
  isFastTrack?: boolean;
  pathId?: string | null;
  path?: Path | null;
  /// prasyarat: course ini terbuka setelah course tersebut selesai 100%
  blockedByCourseId?: string | null;
  blockedBy?: { id: string; title: string; slug: string } | null;
  tags?: Tag[];
  studentCount?: number;
  parts?: CoursePart[];
  createdAt: string;
};

/** course_parts — grup besar (Getting Started, React Fundamentals, ...) */
export type CoursePart = {
  id: string;
  courseId: string;
  name: string;
  description?: string | null;
  durationMinutes: number;
  order: number;
  silabusParts?: SilabusPart[];
};

/** silabus_parts — item di dalam course_silabus */
export type SilabusPart = {
  id: string;
  coursePartId: string;
  title: string;
  slug: string;
  type: "VIDEO" | "ARTICLE" | "QUIZ";
  durationMinutes: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  order: number;
  blocks?: ContentBlock[];
};

export type BlockType =
  | "HEADING"
  | "PARAGRAPH"
  | "IMAGE"
  | "DIVIDER"
  | "VIDEO"
  | "CODE"
  | "CALLOUT"
  | "QUIZ"
  | "PDF"
  | "SLIDES"
  | "FILE";

export type ContentBlock = {
  id: string;
  silabusPartId: string;
  type: BlockType;
  order: number;
  /** payload fleksibel per tipe block */
  content: Record<string, unknown>;
  questions?: QuizQuestion[];
};

export type QuizQuestion = {
  id: string;
  contentBlockId: string;
  question: string;
  options: string[];
  answerIndex: number;
  points: number;
  order: number;
};

export type Paginated<T> = {
  items: T[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
};
