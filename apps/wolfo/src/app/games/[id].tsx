import { useQuery } from "@tanstack/react-query";
import { Button, Text } from "@ui-kitten/components";
import { useRouter, useSearchParams } from "expo-router";
import { useContext } from "react";
import React from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Game, Player, Power, StateGame } from "types";
import { AuthContext } from "../../components/context/tokenContext";
import Loading from "../../components/loading";
import { getGame } from "../../utils/api/game";
import { getPlayer } from "../../utils/api/player";
const GameView = () => {
  const router = useRouter();
  const { id } = useSearchParams(); // idGame
  // get game data
  const {
    data: game,
    isLoading,
    isError,
  } = useQuery<Game, Error>({
    queryKey: ["mygames", id],
    queryFn: () => getGame(Number(id)),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
  const { id: userId } = useContext(AuthContext);
  // get player data
  const {
    data: player,
    isLoading: isLoadingPlayer,
    isError: isErrorPlayer,
  } = useQuery<Player, Error>({
    enabled: Boolean(game),
    queryKey: ["player", userId],
    queryFn: () => getPlayer(game?.id!, userId),
  });
  if (isLoading || isLoadingPlayer) {
    return <Loading title="Game loading" message={"Game " + String(id) + "is loading"} />;
  }
  if (isError || isErrorPlayer || !game || !player) {
    return router.back();
  }
  const redirectChat = () => {
    const chatId = game.state === StateGame.DAY ? game.dayChatRoomId : game.nightChatRoomId;
    router.push({ pathname: `./chatroom/${chatId}`, params: { gameId: game.id, userId } });
  };
  const redirectPower = () => {
    switch (player?.power) {
      case Power.SEER:
        router.push({ pathname: "/games/power/seer", params: { gameId: game.id, userId } });
        break;
      case Power.SPIRIT:
        router.push({ pathname: "/games/power/spirit", params: { gameId: game.id, userId } });
        break;
      case Power.INSOMNIAC:
        router.push({ pathname: "/games/power/insomniac", params: { gameId: game.id, userId } });
        break;
      case Power.CONTAMINATOR:
        router.push({ pathname: "/games/power/contaminator", params: { gameId: game.id, userId } });
        break;
    }
  };

  return (
    <SafeAreaView>
      {/* display all informations on the game after fetching data from backend*/}
      <Text>Game | {game.name}</Text>
      <Text>{game.state === StateGame.DAY ? "C'est le jour" : "C'est la nuit"}</Text>
      <Button onPress={redirectPower} disabled={player.usedPower}>
        Power
      </Button>
      <Button onPress={redirectChat}>Chat</Button>
      <Button onPress={() => router.back()}>Go Back</Button>
    </SafeAreaView>
  );
};

export default GameView;
