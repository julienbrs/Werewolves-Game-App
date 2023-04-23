export type Vote = {
  voteId: string;
  targetId: string;
  gameId: number;
  electionId: number;
  createdAt?: Date;
  updatedAt?: Date;
};
