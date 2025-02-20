export interface Agent {
  ID: number;
  Name: string;
  ListingCount: number;
  AveragePrice: number;
}

export interface SortConfig {
  key: keyof Agent;
  direction: 'asc' | 'desc';
}