export interface Post {
  id: string;
  title: string;
  image: string;
  description: string;
  favorites: number;
  comments: string[];
  createdAt?: string;
  userId?: string; // ID of the user who created the post
}
