import { StatePlayer } from "database";
export const finishElection = async (
  transaction: any,
  electionId: number,
  players: { userId: string }[]
) => {
  const votes = await transaction.vote.findMany({
    where: { electionId },
    select: {
      voterId: true,
      targetId: true,
    },
  });
  console.log(players);
  console.log(votes);
  // TODO fonction qui détermine qui est éliminé
  // cond : le % est > 50% du nombre de joueurs
  // une fois qu'on a un joueur éliminé, il faut le mettre à l'état DEAD et le retirer des chatrooms
  // (uniquement le droit lecteur mais pas d'écriture)
  const nbPlayers = await transaction.player.findMany({
    where: { state: StatePlayer.ALIVE },
  }).length;
  var voteArray:number[] = new Array(nbPlayers);
  var killedPlayerId = null;
  var nbVictims = 0;
  votes.forEach(vote => {
     voteArray[vote.targetId] += 1;
     if (voteArray[vote.targetId] >= (nbPlayers / 2)) {
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
            playerId: killedPlayerId
          }
        }
      }
      });
      await transaction.chatroom.update({
        where: { id: nightId },
        data: {
          writers: {
            disconnect: {
              playerId: killedPlayerId
            }
          }
        }
        });
  }
};
