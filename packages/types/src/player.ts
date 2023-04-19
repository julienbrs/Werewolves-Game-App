type ObjectValues<T> = T[keyof T];

export const Role = {
  LOBBY: "LOBBY",
  DAY: "DAY",
  NIGHT: "NIGHT",
  END: "END",
} as const;
export type Role = ObjectValues<typeof Role>;

export const StatePlayer = {
  LOBBY: "LOBBY",
  DAY: "DAY",
  NIGHT: "NIGHT",
  END: "END",
} as const;
export type StatePlayer = ObjectValues<typeof StatePlayer>;

export const Power = {
  LOBBY: "LOBBY",
  DAY: "DAY",
  NIGHT: "NIGHT",
  END: "END",
} as const;
export type Power = ObjectValues<typeof Power>;

import { User } from "./user";

export interface Player {
  state?: StatePlayer;
  role?: Role;
  power?: Power;
  user: User;
  createdAt?: string;
  updatedAt?: string;
}
