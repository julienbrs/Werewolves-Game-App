import { useQuery } from "@tanstack/react-query";
import { Button, Text } from "@ui-kitten/components";
import { useRouter, useSearchParams } from "expo-router";
import React from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Game } from "types";
import Loading from "../../components/loading";
import { getGame } from "../../utils/api/game";
const GameView = () => {
  const router = useRouter();
  const { id } = useSearchParams();
  const {
    data: game,
    isLoading,
    isError,
  } = useQuery<Game, Error>({
    queryKey: ["mygames", id],
    queryFn: () => getGame(Number(id)),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
  if (isLoading) {
    return <Loading title="Game loading" message={"Game " + String(id) + "is loading"} />;
  }
  if (isError) {
    router.back();
  }
  return (
    <SafeAreaView>
      {/* display all informations on the game after fetching data from backend*/}
      <Text>Game | {game!.name}</Text>
      <Button onPress={() => router.back()}>Go Back</Button>
    </SafeAreaView>
  );
};

export default GameView;
