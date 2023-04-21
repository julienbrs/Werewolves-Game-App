import { useQuery } from "@tanstack/react-query";
import { Button, Text } from "@ui-kitten/components";
import { useRouter, useSearchParams } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Player } from "types";
import { getPlayers } from "../../../utils/api/player";

const SeerView = () => {
  const router = useRouter();
  const { gameId } = useSearchParams();
  const {
    data: players,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["players", gameId],
    queryFn: () => getPlayers(Number(gameId)),
  });
  const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setIsButtonDisabled(true);
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    router.back();
  }

  return (
    <SafeAreaView>
      <Text>Players:</Text>
      {players.map((player: Player) => (
        <Button
          key={player.userId}
          onPress={() => handlePlayerClick(player)}
          disabled={isButtonDisabled}
        >
          {player.user.name}
        </Button>
      ))}
      <Text>Selected player:</Text>
      {selectedPlayer ? <Text>{selectedPlayer.power}</Text> : <Text>No player selected</Text>}
    </SafeAreaView>
  );
};

export default SeerView;
