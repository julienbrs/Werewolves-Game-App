import { Player } from "types";
import api from "./api";

const playerApi = {
  getPlayers: async (gameId: number) => {
    const { data } = await api.get(`games/${gameId}/players`);
    return data;
  },
  getPlayer: async (gameId: number, userId: string): Promise<Player> => {
    console.log("request at " + `games/${gameId}/players/${userId}`);
    const { data } = await api.get(`games/${gameId}/players/${userId}`);
    return data;
  },
};

export const { getPlayer, getPlayers } = playerApi;
