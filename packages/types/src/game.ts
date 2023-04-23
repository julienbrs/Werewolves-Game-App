import { Player } from "./player";

export const StateGame = {
  LOBBY: "LOBBY",
  DAY: "DAY",
  NIGHT: "NIGHT",
  END: "END",
} as const;

type ObjectValues<T> = T[keyof T];

export type StateGame = ObjectValues<typeof StateGame>;

export type Game = {
  id: number;
  name: string;
  state: StateGame;
  players?: Player[] | any;
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
  dayChatRoomId: number;
  nightChatRoomId: number;
  spiritChatRoomId?: number;
};

export type NewGame = {
  name: string;
  state: StateGame;
  players?: Player[] | any;
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
};
