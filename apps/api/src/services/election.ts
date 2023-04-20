import { Power, Role, StatePlayer, TransactionType, Vote } from "database";

export const finishElection = async (
  transaction: TransactionType,
  electionId: number,
  players: {
    state: StatePlayer | null;
    userId: string;
    role: Role | null;
    power: Power | null;
  }[]
) => {
  const votes = await transaction.vote.findMany({
    where: { electionId },
  });
  console.log(players);
  const nbPlayers = (
    await transaction.player.findMany({
      where: { state: StatePlayer.ALIVE },
    })
  ).length;

  const voteArray: number[] = new Array(nbPlayers);
  const killedPlayerId = null;
  const nbVictims = 0;
  votes.forEach((vote: Vote) => {
    voteArray[vote.targetId] += 1;
    if (voteArray[vote.targetId] >= nbPlayers / 2) {
      killedPlayerId = vote.targetId;
      nbVictims++;
    }
  });
  if (killedPlayerId !== null && nbVictims < 2) {
    await transaction.player.update({
      where: { userId: killedPlayerId },
      data: {
        state: StatePlayer.DEAD,
      },
    });
    const gameId = await transaction.election.findUnique({
      where: { electionId },
    }).gameId;
    const chats = await transaction.game.findUnique({
      where: { id: gameId },
      select: {
        dayChat: true,
        nightChat: true,
      },
    });
    const dayId = chats.dayChat.id;
    const nightId = chats.nightChat.id;
    await transaction.chatroom.update({
      where: { id: dayId },
      data: {
        writers: {
          disconnect: {
            playerId: killedPlayerId,
          },
        },
      },
    });
    await transaction.chatroom.update({
      where: { id: nightId },
      data: {
        writers: {
          disconnect: {
            playerId: killedPlayerId,
          },
        },
      },
    });
  }
};
