export interface Post {
  title: string;
  description: string;
  content: string;
  image: File;
  minutesToRead: number;
}

export interface PostResponse {
    id: number;
    title: string;
    description: string;
    content: string;
    image: string;
    minutesToRead: number;
    createdAt: string;
}

export interface Project {
    title: string;
    description: string;
    content: string;
    image: File;
    githubUrl: string;
}

export interface ProjectResponse {
    id: number;
    title: string;
    description: string;
    content: string;
    image: string;
    githubUrl: string;
    createdAt: string;
}

export interface User {
    username: string;
    password: string;
}