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
