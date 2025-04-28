
export interface Category {
  id: string;
  title: string;
  slug: string;
  order: number;
  description?: string;
  parentId?: string;
}

export interface DocPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  categoryId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  excerpt?: string;
  author?: string;
  views?: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: "admin" | "user" | "guide editor";
  avatar?: string;
}

export type EditorContent = string;
