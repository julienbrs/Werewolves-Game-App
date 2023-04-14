export interface User {
  id: number;
  name: string;
  password: string;
};

export type NewUser = Omit<User, "id">;