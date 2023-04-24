type ObjectValues<T> = T[keyof T];

export const Role = {
  WOLF: "WOLF",
  VILLAGER: "VILLAGER",
} as const;
export type Role = ObjectValues<typeof Role>;

export const StatePlayer = {
  ALIVE: "ALIVE",
  DEAD: "DEAD",
} as const;
export type StatePlayer = ObjectValues<typeof StatePlayer>;

export const Power = {
  INSOMNIAC: "INSOMNIAC",
  SEER: "SEER",
  CONTAMINATOR: "CONTAMINATOR",
  SPIRIT: "SPIRIT",
  NONE: "NONE",
} as const;
export type Power = ObjectValues<typeof Power>;

import { User } from "./user";

export type Player = {
  userId: string;
  gameId: number;
  state?: StatePlayer;
  role?: Role;
  power?: Power;
  usedPower: boolean;
  user?: User;
  createdAt?: string;
  updatedAt?: string;
}
