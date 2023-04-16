export type Role = "WOLF" | "VILLAGER";
export type StatePlayer = "ALIVE" | "DEAD";
export type Power = "INSOMNIAC" | "SEER" | "CONTAMINATOR" | "SPIRIT";
import { User } from "./user";

export interface Player {
  state?: StatePlayer;
  role?: Role;
  power?: Power;
  user: User;
  createdAt?: string;
  updatedAt?: string;
}
