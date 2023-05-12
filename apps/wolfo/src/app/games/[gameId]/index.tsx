import { useQuery } from "@tanstack/react-query";
import { Button, Text } from "@ui-kitten/components";
import { Stack, useRouter, useSearchParams } from "expo-router";
import { useContext } from "react";
import React from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Game, Player, Power, StateGame } from "types";
import { AuthContext } from "../../../components/context/tokenContext";
import Loading from "../../../components/loading";
import { getGame } from "../../../utils/api/game";
import { getPlayer } from "../../../utils/api/player";
const GameView = () => {
  const router = useRouter();
  const { gameId } = useSearchParams(); // idGame
  const { id: userId } = useContext(AuthContext);
  // get game data
  const {
    data: game,
    isLoading,
    isError,
  } = useQuery<Game, Error>({
    enabled: !isNaN(Number(gameId)),
    queryKey: ["mygames", gameId],
    queryFn: () => getGame(Number(gameId)),
    staleTime: 1000 * 60 * 5,
  });
  // get player data
  const {
    data: player,
    isLoading: isLoadingPlayer,
    isError: isErrorPlayer,
  } = useQuery<Player, Error>({
    enabled: Boolean(game),
    queryKey: ["player", userId],
    queryFn: () => getPlayer(game?.id!, userId),
    staleTime: 1000 * 60 * 5,
  });
  if (isLoading || isLoadingPlayer) {
    return <Loading title="Game loading" message={"Game " + String(gameId) + "is loading"} />;
  }
  if (isError || isErrorPlayer || !game || !player) {
    return <Loading title="Game error" message="oui" />;
  }
  const redirectChat = () => {
    const chatId = game.state === StateGame.DAY ? game.dayChatRoomId : game.nightChatRoomId;
    return router.push({
      pathname: `/games/${gameId}/chatroom/${chatId}`,
      params: { gameId, userId },
    });
  };

  const redirectPower = () => {
    switch (player?.power) {
      case Power.SEER:
        router.push({ pathname: `/games/${gameId}/power/seer`, params: { userId } });
        break;
      case Power.SPIRIT:
        router.push({ pathname: `/games/${gameId}/power/spirit`, params: { userId } });
        break;
      case Power.INSOMNIAC:
        router.push({ pathname: `/games/${gameId}/power/insomniac`, params: { userId } });
        break;
      case Power.CONTAMINATOR:
        router.push({
          pathname: `/games/${gameId}/power/contaminator`,
          params: { userId },
        });
        break;
    }
    return;
  };
  const redirectVote = () => {
    router.push({ pathname: `/games/${gameId}/vote`, params: { userId } });
    return;
  };
  return (
    <SafeAreaView>
      <Stack.Screen options={{ title: game.name, headerRight: () => null }} />
      {/* display all informations on the game after fetching data from backend*/}
      <Text>Game | {game.name}</Text>
      <Text>{game.state === StateGame.DAY ? "C'est le jour" : "C'est la nuit"}</Text>
      <Text>{player.power}</Text>
      <Text>{player.role}</Text>
      <Button onPress={redirectVote}>Vote</Button>
      <Button onPress={redirectPower} disabled={player.usedPower && player.power !== Power.SPIRIT}>
        Power
      </Button>
      <Button onPress={redirectChat}>Chat</Button>
      <Button onPress={() => router.back()}>Go Back</Button>
    </SafeAreaView>
  );
};

export default GameView;
