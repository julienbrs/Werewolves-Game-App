export interface User {
  id: string;
  name: string;
  password: string;
}

export type NewUser = Omit<User, "id">;
