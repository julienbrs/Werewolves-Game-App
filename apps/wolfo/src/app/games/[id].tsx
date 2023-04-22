import { useQuery } from "@tanstack/react-query";
import { Button, Text } from "@ui-kitten/components";
import { useRouter, useSearchParams } from "expo-router";
import React from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Game, Power, StateGame } from "types";
import Loading from "../../components/loading";
import { getGame } from "../../utils/api/game";
import { getPlayer } from "../../utils/api/player";
import useAuth from "../../utils/hooks/useAuth";
const GameView = () => {
  const router = useRouter();
  const { id } = useSearchParams();
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
  // get token (cached)
  const {
    data: token,
    isLoading: isLoadingToken,
    isError: isErrorUser,
  } = useQuery({
    queryKey: ["token"],
    queryFn: useAuth,
  });
  // get player data
  const {
    data: player,
    isLoading: isLoadingPlayer,
    isError: isErrorPlayer,
  } = useQuery({
    enabled: !isLoadingToken,
    queryKey: ["player", token],
    queryFn: () => getPlayer(game?.id!, token!),
  });
  if (isLoading && isLoadingPlayer) {
    return <Loading title="Game loading" message={"Game " + String(id) + "is loading"} />;
  }
  if (isError || isErrorPlayer || isErrorUser || !game || !player) {
    return router.back();
  }
  const redirectChat = () => {
    const chatId = game.state === StateGame.DAY ? game.dayChatRoomId : game.nightChatRoomId;
    router.push(`./chatroom/${chatId}`);
  };
  const redirectPower = () => {
    switch (player?.power) {
      case Power.SEER:
        router.push(`/power/seer?userId=${player.userId}&gameId=${game?.id}`);
        break;
      case Power.SPIRIT:
        router.push(`/power/spirit?userId=${player.userId}&gameId=${game?.id}`);
        break;
      case Power.INSOMNIAC:
        router.push(`/power/insomniac?userId=${player.userId}&gameId=${game?.id}`);
        break;
      case Power.CONTAMINATOR:
        router.push(`/power/contaminator?userId=${player.userId}&gameId=${game?.id}`);
        break;
    }
  };

  return (
    <SafeAreaView>
      {/* display all informations on the game after fetching data from backend*/}
      <Text>Game | {game.name}</Text>
      <Text>{game.state === StateGame.DAY ? "C'est le jour" : "C'est la nuit"}</Text>
      <Button onPress={redirectPower}>Power</Button>
      <Button onPress={redirectChat}>Chat</Button>
      <Button onPress={() => router.back()}>Go Back</Button>
    </SafeAreaView>
  );
};

export default GameView;
