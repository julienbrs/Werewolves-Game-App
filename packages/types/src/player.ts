export type ROLE = "WOLF" | "VILLAGER";
export type STATEPLAYER = "ALIVE" | "DEAD";
export type POWER = "INSOMNIAC" | "SEER" | "CONTAMINATOR" | "SPIRIT";
import { User } from "./user";

export interface Player {
  state?: STATEPLAYER;
  role?: ROLE;
  power?: POWER;
  user: User;
}
