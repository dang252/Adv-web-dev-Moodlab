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
}
