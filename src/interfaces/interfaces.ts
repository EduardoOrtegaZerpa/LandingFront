export interface Post {
  title: string;
  description: string;
  content: string;
  image?: File;
  minutesToRead: number;
  tags: string[];
}

export interface PostResponse {
    id: number;
    title: string;
    description: string;
    content: string;
    imageUrl: string;
    minutesToRead: number;
    created: string;
    tags: string[];
}

export interface Project {
    title: string;
    description: string;
    content: string;
    image?: File;
    githubUrl: string;
}

export interface ProjectResponse {
    id: number;
    title: string;
    description: string;
    content: string;
    imageUrl: string;
    githubUrl: string;
    created: string;
}

export interface User {
    username: string;
    password: string;
}