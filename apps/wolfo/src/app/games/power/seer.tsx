import { useQuery } from "@tanstack/react-query";
import { Button, Text } from "@ui-kitten/components";
import { useRouter, useSearchParams } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Game, Player } from "types";
import Loading from "../../../components/loading";
import { getGame } from "../../../utils/api/game";
import { getPlayers } from "../../../utils/api/player";

const SeerView = () => {
  const router = useRouter();
  const { id } = useSearchParams();
  const {
    data: game,
    isLoading,
    isError,
  } = useQuery<Game, Error>({
    queryKey: ["mygames", id],
    queryFn: () => getGame(Number(id)),
  });
  const {
    data: players,
    isLoading: isLoadingPlayer,
    isError: isErrorPlayer,
  } = useQuery({
    queryKey: ["players", game?.id],
    queryFn: () => getPlayers(Number(game?.id)),
  });
  const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setIsButtonDisabled(true);
  };

  if (isLoading && isLoadingPlayer) {
    return <Loading title="Power loading" message={"Loading..."} />;
  }

  if (isError && isErrorPlayer) {
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
