import api from "../api";
import { Game, NewGame } from "types";

const game = {
  getGamesLobby: async (): Promise<Game[]> => {
    const { data } = await api.get("/games?state=LOBBY");
    return data;
  },
  getMyGames: async (): Promise<Game[]> => {
    const { data } = await api.get("/games/mygames");
    return data;
  },
  createGame: async (game: NewGame) => {
    const { data } = await api.post("/games", game);
    return data;
  },
  deleteGame: async (id: number) => {
    const { data } = await api.delete(`/games/${id}`);
    return data;
  },
  updateGame: async (id: number, game: Game) => {
    const { data } = await api.put(`/games/${id}`, game);
    return data;
  },
  login: async (game: Game) => {
    const { data } = await api.post("/games/login", game);
    return data;
  },
};

export const {
  getGamesLobby,
  getMyGames,
  createGame,
  deleteGame,
  updateGame,
  login,
} = game;
