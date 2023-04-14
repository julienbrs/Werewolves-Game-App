enum StateGame {
  LOBBY,
  DAY,
  NIGHT,
  END,
}

export interface Game {
  id :number;
  name: string;
  state: StateGame;
  deadline: Date;
  minPlayer: number;
  maxPlayer: number;
  wolfProb: number;
  seerProb: number;
  insomProb: number;
  contProb: number;
  spiritProb: number;
  startDay: number;
  endDay: number;
}
export interface NewGame extends Omit<Game, "id"> {}
