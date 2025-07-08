import { Post } from './post';

export interface UserForm {
  email: string;
  name: string;
  handle: string;
}

export interface User {
  id: string;
  email: string;
  image: string;
  handle: string;
  name: string;
  description: string;
  posts: Post[];
  following: string[];
  favorites: string[];
}
