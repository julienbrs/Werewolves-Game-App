import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "expo-router";
import React, { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Game } from "types";
import { getGame } from "../../utils/api/game";
const GameView = () => {
  const router = useRouter();
  const { id } = useSearchParams();
  const { data: game } = useQuery<Game>({
    queryKey: ["mygames", id],
    queryFn: () => getGame(Number(id)),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
  return (
    <SafeAreaView>
      {/* display all informations on the game after fetching data from backend*/}
      <Text>
        Game | {game?.name} | {id}
      </Text>
      <Button title="Go back" onPress={() => router.back()} />
    </SafeAreaView>
  );
};

export default GameView;
