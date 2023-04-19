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
};
