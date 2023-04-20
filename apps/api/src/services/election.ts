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
  let killedPlayerId = null;
  let nbVictims = 0;
  votes.forEach((vote: Vote) => {
    voteArray[+vote.targetId] += 1;
    if (voteArray[+vote.targetId] >= nbPlayers / 2) {
      killedPlayerId = vote.targetId;
      nbVictims++;
    }
  });
  const gameId = await transaction.game.findUnique({
    where: { curElecId: electionId },
    select: {
      id: true,
    },
  });
  if (!gameId) {
    throw Error;
  } else if (killedPlayerId !== null && nbVictims < 2) {
    await transaction.player.update({
      where: { userId_gameId: { userId: killedPlayerId, gameId: gameId.id }},
      data: {
        state: StatePlayer.DEAD,
        },
    });
    
    const chatsId = await transaction.game.findUnique({
      where: { id: gameId.id },
      select: {
        dayChatRoomId: true,
        nightChatRoomId: true,
      },
    });
    if (!chatsId) {
      throw Error;
    }
    else {
      await transaction.chatRoom.update({
        where: { id: chatsId?.dayChatRoomId },
        data: {
          writers: {
            disconnect: {
              playerId_gameId_chatRoomId: {playerId: killedPlayerId, gameId: gameId, chatRoomId: chatsId?.dayChatRoomId},
            },
          },
        },
      });
      await transaction.chatRoom.update({
        where: { id: chatsId?.nightChatRoomId },
        data: {
          writers: {
            disconnect: {
              playerId_gameId_chatRoomId: {playerId: killedPlayerId, gameId: gameId.id, chatRoomId: chatsId?.nightChatRoomId},
            },
          },
        },
      });
    }
    
  }
};
