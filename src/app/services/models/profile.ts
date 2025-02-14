import { Post } from './post';

export interface Profile {
  id: string;
  image: string;
  name: string;
  handle: string;
  description: string;
  followers: number;
  tags: string[];
  posts: Post[];
}
