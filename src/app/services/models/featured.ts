export interface FeaturedProfile {
  id: number;
  imageUrl: string;
  name: string;
  handle: string;
  followers: number;
  tags: string[];
  following: boolean;
}
