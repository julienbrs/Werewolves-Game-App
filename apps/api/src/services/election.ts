import { StatePlayer, TransactionType, Vote } from "database";
import { pl } from "date-fns/locale";
import notificationService from "./notification";

export const finishElection = async (transaction: TransactionType, electionId: number) => {
  const gameId = (await transaction.game.findUnique({
    where: { curElecId: electionId },
    select: {
      id: true,
    },
  }))!.id;

  if (!gameId) {
    throw new Error("game id undefined");
  }
  const votes = await transaction.vote.findMany({
    where: { electionId },
  });
  const players = await transaction.player.findMany({
    where: { state: StatePlayer.ALIVE, gameId },
  });
  const nbPlayers = players.length;

  // const voteArray: number[] = new Array(nbPlayers);
  // let killedPlayerId = null;
  // let nbVictims = 0;
  // votes.forEach((vote: Vote) => {
  //   voteArray[+vote.targetId] += 1;
  //   if (voteArray[+vote.targetId] >= nbPlayers / 2) {
  //     killedPlayerId = vote.targetId;
  //     nbVictims++;
  //   }
  // });
  const voteArray: Vote[][] = await Promise.all(
    Array.from(players).map(async p => {
      return await transaction.vote.findMany({
        where: { targetId: p.userId, electionId },
      });
    })
  );
  const votesFiltered: { targetId: string; nbVotes: number }[] = voteArray
    .filter(vArray => vArray.length !== 0)
    .map(vArray => {
      return { targetId: vArray[0].targetId, nbVotes: vArray.length };
    });
  let highestVote = votesFiltered.reduce(
    (previousValue, { targetId, nbVotes }) => {
      if (previousValue.nbVotes < nbVotes) {
        return { targetId, nbVotes };
      }
      if (previousValue.nbVotes === nbVotes) {
        return { targetId: " ", nbVotes: NaN };
      }
      return previousValue;
    },
    { targetId: " ", nbVotes: -1 }
  );

  console.log(
    "highest vote " +
      highestVote.targetId +
      " " +
      highestVote.nbVotes +
      "nbpleyr /2" +
      Math.ceil(nbPlayers / 2.0) +
      " " +
      nbPlayers
  );

  if (!gameId) {
    throw Error;
  } else if (highestVote.nbVotes !== -1 && highestVote.nbVotes >= Math.ceil(nbPlayers / 2)) {
    console.log("killed");
    await transaction.player.update({
      where: { userId_gameId: { userId: highestVote.targetId, gameId } },
      data: {
        state: StatePlayer.DEAD,
      },
    });
    console.log("killed");
    const game = await transaction.game.findUnique({
      where: { id: gameId },
      select: {
        name: true,
        dayChatRoomId: true,
        nightChatRoomId: true,
      },
    });
    if (!game) throw Error;
    notificationService.isDead(
      transaction,
      players.filter(p => p.userId === highestVote.targetId)[0],
      game.name
    );
    // vire le mort des chat rooms
    await transaction.chatRoom.update({
      where: { id: game.dayChatRoomId },
      data: {
        writers: {
          disconnect: {
            playerId_gameId_chatRoomId: {
              playerId: highestVote.targetId,
              gameId,
              chatRoomId: game.dayChatRoomId,
            },
          },
        },
      },
    });
    await transaction.chatRoom.update({
      where: { id: game.nightChatRoomId },
      data: {
        writers: {
          disconnect: {
            playerId_gameId_chatRoomId: {
              playerId: highestVote.targetId,
              gameId,
              chatRoomId: game.nightChatRoomId,
            },
          },
        },
      },
    });
  }
};
