type StateGame = "LOBBY" | "DAY" | "NIGHT" | "END";
import { Player } from "./player";
export interface Game {
  id: number;
  name: string;
  state: StateGame;
  players: Player[];
  deadline: Date;
  minPlayer: number;
  maxPlayer: number;
  wolfProb: number;
  seerProb: number;
  insomProb: number;
  contProb: number;
  spiritProb: number;
  startDay: Date;
  endDay: Date;
}
export interface NewGame extends Omit<Game, "id"> {}
