export interface MockFollower {
  id: string;
  userId: string;
  followedAt: string;
}

export const FOLLOWERS: MockFollower[] = [
  { id: '1', userId: 'user1', followedAt: '2024-01-01T00:00:00.000Z' },
  { id: '2', userId: 'user2', followedAt: '2024-01-02T00:00:00.000Z' },
];
