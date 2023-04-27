import { Player, Vote } from "types";
import api from "./api";

const voteApi = {
  createVote: async (player: Player, electionId: Number, vote: Vote) => {
    api.post(`/games/${player.gameId}/players/${player.userId}/elections/${electionId}`, vote);
  },
  updateVote: async (player: Player, electionId: Number, vote: Vote) => {
    api.patch(`/games/${player.gameId}/players/${player.userId}/elections/${electionId}`, vote);
  },
  deleteVote: async (player: Player, electionId: Number) => {
    api.delete(`/games/${player.gameId}/players/${player.userId}/elections/${electionId}`);
  },
};

export default voteApi;
