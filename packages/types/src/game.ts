type StateGame = "LOBBY" | "IN_GAME" | "END";
import { Player } from "./player";
export type Game = {
  id: number;
  name: string;
  state: StateGame;
  players?: Player[] | any;
  deadline: string;
  minPlayer: number;
  maxPlayer: number;
  wolfProb: number;
  seerProb: number;
  insomProb: number;
  contProb: number;
  spiritProb: number;
  startDay: string;
  endDay: string;
  dayChatRoomId: number;
  nightChatRoomId: number;
  spiritChatRoomId?: number;
};

export type NewGame = {
  name: string;
  state: StateGame;
  players?: Player[] | any;
  deadline: string;
  minPlayer: number;
  maxPlayer: number;
  wolfProb: number;
  seerProb: number;
  insomProb: number;
  contProb: number;
  spiritProb: number;
  startDay: string;
  endDay: string;
};
