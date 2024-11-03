import { Post } from './post';

export interface Profile {
  id: string;
  image: string;
  name: string;
  handle: string;
  followers: number;
  tags: string[];
  following: boolean;
  posts: Post[] | [];
}
