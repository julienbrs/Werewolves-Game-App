import { useQuery } from "@tanstack/react-query";
import { Text } from "@ui-kitten/components";
import { useSearchParams } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Game } from "types";
import { getGame } from "../../../utils/api/game";
const SpiritView = () => {
  const { gameId, userId } = useSearchParams();
  console.log(gameId, userId);
  const { data: game } = useQuery<Game, Error>({
    enabled: !isNaN(Number(gameId)),
    queryKey: ["mygames", gameId],
    queryFn: () => getGame(Number(gameId)),
    staleTime: 1000 * 60 * 60 * 24, // 1 day
  });
  return (
    <SafeAreaView>
      <Text>Spirit | {gameId as string}</Text>
      <Text>{game?.name}</Text>
    </SafeAreaView>
  );
};

export default SpiritView;
