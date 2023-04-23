import { useQuery } from "@tanstack/react-query";
import { Button, Text } from "@ui-kitten/components";
import { useRouter, useSearchParams } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Game, Player } from "types";
import Loading from "../../../components/loading";
import { getGame } from "../../../utils/api/game";
const SeerView = () => {
  const router = useRouter();
  const { gameId, userId } = useSearchParams();
  console.log(userId);
  const {
    data: game,
    isLoading,
    isError,
  } = useQuery<Game, Error>({
    queryKey: ["mygames", gameId],
    queryFn: () => getGame(Number(gameId)),
  });
  const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setIsButtonDisabled(true);
  };

  if (isLoading) {
    return <Loading title="Power loading" message={"Loading..."} />;
  }
  if (isError || !game) {
    return router.back();
  }

  return (
    <SafeAreaView>
      <Text>Players:</Text>
      {game.players &&
        game.players.map((player: Player) => (
          <Button
            key={player.userId}
            onPress={() => handlePlayerClick(player)}
            disabled={isButtonDisabled}
          >
            {player.user.name}
          </Button>
        ))}
      <Text>Selected player:</Text>
      {selectedPlayer ? (
        <Text>
          {selectedPlayer.role !== undefined ? selectedPlayer.role : ""}
          {selectedPlayer.power !== undefined ? `, ${selectedPlayer.power}` : ""}
        </Text>
      ) : (
        <Text>No player selected</Text>
      )}
    </SafeAreaView>
  );
};

export default SeerView;
