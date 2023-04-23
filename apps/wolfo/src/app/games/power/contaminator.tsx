

const ContaminatorView = () => {
  // const { userId } = useSearchParams();
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
  const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handlePlayerClick = (player: Player) => {
    const updatedPlayer = { ...player, role: "WOLF", power: "NONE" };
    setSelectedPlayer(updatedPlayer);
    const {
      data: player,
      isLoading: isLoadingPlayer,
      isError: isErrorPlayer,
    } = useQuery({
      queryKey: ["mygames", id],
      queryFn: () => updatedPlayer(Number(id),player.id,updatedPlayer),
    });
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
      {game.players.map((player: Player) => (
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
        <Text>Contaminated player</Text>
      ) : (
        <Text>No player selected</Text>
      )}
    </SafeAreaView>
  );
};


export default ContaminatorView;

import { useQuery } from "@tanstack/react-query";
import { Button, Text } from "@ui-kitten/components";
import { useRouter, useSearchParams } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Game, Player } from "types";
import Loading from "../../../components/loading";
import { getGame } from "../../../utils/api/game";
import { getPlayers } from "../../../utils/api/player";

  

