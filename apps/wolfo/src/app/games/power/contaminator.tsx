import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Text } from "@ui-kitten/components";
import { useRouter, useSearchParams } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Game, Player } from "types";

import Loading from "../../../components/loading";
import { getGame } from "../../../utils/api/game";
import { getPlayer, updatePlayer } from "../../../utils/api/player";

const ContaminatorView = () => {
  const router = useRouter();
  const { gameId, userId } = useSearchParams();
  const queryClient = useQueryClient();
  console.log(gameId);
  const {
    data: game,
    isLoading,
    isError,
  } = useQuery<Game, Error>({
    queryKey: ["mygames", gameId],
    queryFn: () => getGame(Number(gameId)),
  });
  console.log(game);
  const {
    data: currentPlayer,
    isLoading: isLoadingPlayer,
    isError: isErrorPlayer,
  } = useQuery<Player, Error>({
    enabled: Boolean(game),
    queryKey: ["player", userId],
    queryFn: () => getPlayer(game?.id!, Array.isArray(userId) ? userId[0] : userId!),
  });

  const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handlePlayerClick = async (contaminatedPlayer: Player) => {
    setSelectedPlayer(contaminatedPlayer);
    setIsButtonDisabled(true);

    // Update the contaminated player's role and power
    const updatedPlayer: Player = {
      ...contaminatedPlayer,
      role: "WOLF",
      power: "NONE",
    };
    console.log(updatedPlayer);
    await updatePlayer(updatedPlayer);

    // Update the contaminator's power usage
    const updatedContaminator: Player = {
      ...currentPlayer!,
      usedPower: true,
    };
    await updatePlayer(updatedContaminator);
  };

  if (isError || isErrorPlayer || !game) {
    queryClient.invalidateQueries(["players", gameId]);
    router.back();
    console.log("erreur");
  }

  if (isLoading || isLoadingPlayer) {
    return <Loading title="Power loading" message={"Loading..."} />;
  }

  return (
    <SafeAreaView>
      <Text>Players:</Text>
      {game?.players &&
        game.players.map((player: Player) => (
          <Button
            key={player.userId}
            onPress={async () => {
              handlePlayerClick(player);
            }}
            disabled={isButtonDisabled}
          >
            {player.user?.name}
          </Button>
        ))}
      <Text>Selected player:</Text>
      {selectedPlayer ? (
        <Text>
          {selectedPlayer.user?.name!}
          {` is now a wolf...`}
        </Text>
      ) : (
        <Text>No player selected</Text>
      )}
    </SafeAreaView>
  );
};

export default ContaminatorView;
