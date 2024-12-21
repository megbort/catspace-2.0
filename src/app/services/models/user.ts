export interface User {
  id: string;
  email: string;
  image: string;
  handle: string;
  name: string;
  description: string;
  following?: string[];
  favorites?: string[];
}
