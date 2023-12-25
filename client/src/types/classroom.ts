export interface Post {
  id: number;
  name: string;
  time: string;
  content: string;
  comments: Comment[];
}

export interface Comment {
  id: number;
  name: string;
  time: string;
  content: string;
}

export interface TeacherType {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface ClassType {
  id: number;
  teacher: TeacherType;
  code: string;
  inviteCode: string;
  inviteLink: string;
  name: string;
  status: string;
  theme: string;
  description: string;
  gradeStructure: gradeCol[] | null;
}

export interface gradeCol {
  id: number;
  name: string;
  scale: number;
}

export interface Exam {
  gradeComposition?: { name: string; scale: number };
  isFinalized?: boolean;
  name?: string;
  position?: number;
}

export interface Point {
  exam?: Exam;
  point?: number;
}

export interface Grade {
  id?: number;
  classId?: number;
  studentId?: number;
  overall?: number;
  student: { firstName: string; lastName: string; points?: any[] };
  points: Point[];
}

export interface Review {
  comments: Comment[];
  exam: any;
  examId: number;
  expectationPoint: number;
  explaination: string;
  id: number;
  reporter: { id: number; email: string; firstName: string; lastName: string };
  reporterId: number;
  status: string;
}

export interface Comment {
  id: number;
  reviewId?: number;
  userId?: number;
  content: string;
}
