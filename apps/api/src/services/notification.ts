import { Player, Power, Role, TransactionType } from "database";

const notificationService = {
  async newDay(transaction: TransactionType, players: Player[], gameName: string) {
    const notificationPromise = players.map(player => {
      return transaction.notification.create({
        data: {
          userId: player.userId,
          title: `Le jour se lève sur ${gameName}`,
          content: player.role === Role.WOLF ? "N'oubliez pas de vous voter" : "",
          link: "/game/" + player.gameId,
        },
      });
    });
    await Promise.all(notificationPromise);
  },
  async newNight(transaction: TransactionType, players: Player[], gameName: string) {
    const notificationPromise = players.map(player => {
      return transaction.notification.create({
        data: {
          userId: player.userId,
          title: `La nuit tombe sur ${gameName}`,
          content:
            player.power !== Power.NONE ? "N'oubliez pas d'utiliser votre pouvoir" : "Bonne nuit",
          link: "/game/" + player.gameId,
        },
      });
    });
    await Promise.all(notificationPromise);
  },
  async startGame(transaction: TransactionType, players: Player[], gameName: string) {
    const notificationPromise = players.map(player => {
      let content =
        `Vous êtes ${player.role}` +
        (player.power !== Power.NONE ? ` et vous avez le pouvoir ${player.power}` : "");
      return transaction.notification.create({
        data: {
          userId: player.userId,
          title: `La partie ${gameName} commence`,
          content,
          link: "/game/" + player.gameId,
        },
      });
    });
    await Promise.all(notificationPromise);
  },
};

export default notificationService;
