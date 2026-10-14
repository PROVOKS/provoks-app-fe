export type Role = "ADMIN" | "INSTRUCTOR" | "STUDENT";

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
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  courseCount?: number;
  createdAt: string;
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
  pathId?: string | null;
  path?: Path | null;
  tags?: Tag[];
  studentCount?: number;
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
  | "QUIZ";

export type ContentBlock = {
  id: string;
  silabusPartId: string;
  type: BlockType;
  order: number;
  /** payload fleksibel per tipe block */
  content: Record<string, unknown>;
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
